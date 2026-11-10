import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';

test.describe('API de produtos', () => {
  test('cria dois produtos distintos e retorna os IDs gerados', async ({ request }) => {
    const products = [
      { title: `QA notebook ${randomUUID()}`, price: 749.5 },
      { title: `QA headset ${randomUUID()}`, price: 89.9 },
    ];
    const createdProducts = [];

    for (const product of products) {
      const response = await request.post('/products/add', { data: product });
      expect(response.status()).toBe(201);
      expect(response.headers()['content-type']).toContain('application/json');

      const body = await response.json();
      expect(body).toMatchObject(product);
      expect(Number.isInteger(body.id)).toBe(true);
      createdProducts.push(body);
    }

    expect(createdProducts[0].title).not.toBe(createdProducts[1].title);
  });

  test('não persiste um produto criado pelo endpoint de escrita simulado', async ({ request }) => {
    const createResponse = await request.post('/products/add', {
      data: { title: `QA transient ${randomUUID()}`, price: 25.75 },
    });
    expect(createResponse.status()).toBe(201);
    const createdProduct = await createResponse.json();
    expect(Number.isInteger(createdProduct.id)).toBe(true);

    const getResponse = await request.get(`/products/${createdProduct.id}`);
    expect(getResponse.status()).toBe(404);
    expect(typeof (await getResponse.json()).message).toBe('string');
  });

  test('consulta um produto do catálogo e valida a estrutura da resposta', async ({ request }) => {
    const response = await request.get('/products/1');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const product = await response.json();
    expect(product).toMatchObject({
      id: 1,
      title: expect.any(String),
      price: expect.any(Number),
      category: expect.any(String),
      stock: expect.any(Number),
    });
  });

  test('retorna 404 para um produto inexistente', async ({ request }) => {
    const response = await request.get('/products/999999');

    expect(response.status()).toBe(404);
    expect(typeof (await response.json()).message).toBe('string');
  });

  test('retorna 404 quando o ID do produto não é numérico', async ({ request }) => {
    const response = await request.get('/products/not-a-number');

    expect(response.status()).toBe(404);
    expect(typeof (await response.json()).message).toBe('string');
  });

  test('registra que a criação simulada não valida campos obrigatórios ou numéricos', async ({ request }) => {
    const emptyResponse = await request.post('/products/add', { data: {} });
    expect(emptyResponse.status()).toBe(201);
    expect(Number.isInteger((await emptyResponse.json()).id)).toBe(true);

    const invalidResponse = await request.post('/products/add', {
      data: { title: '', price: -1 },
    });
    expect(invalidResponse.status()).toBe(201);
    expect(await invalidResponse.json()).toMatchObject({ title: '', price: -1 });
  });
});
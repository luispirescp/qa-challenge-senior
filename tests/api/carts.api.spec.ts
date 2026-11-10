import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

test.describe('API de carrinhos', () => {
  test('cria um carrinho e retorna produtos do catálogo com totais calculados', async ({ request }) => {
    const requestedProducts = [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ];
    const response = await request.post('/carts/add', {
      data: { userId: 1, products: requestedProducts },
    });

    expect(response.status()).toBe(201);
    expect(response.headers()['content-type']).toContain('application/json');
    const cart = await response.json();

    expect(Number.isInteger(cart.id)).toBe(true);
    expect(cart.userId).toBe(1);
    expect(cart.products).toHaveLength(requestedProducts.length);
    expect(cart.products).toEqual(
      expect.arrayContaining(
        requestedProducts.map((requestedProduct) =>
          expect.objectContaining({
            id: requestedProduct.id,
            quantity: requestedProduct.quantity,
            title: expect.any(String),
            price: expect.any(Number),
            total: expect.any(Number),
            discountPercentage: expect.any(Number),
          }),
        ),
      ),
    );
    expect(cart.total).toBeCloseTo(
      cart.products.reduce((sum: number, product: { total: number }) => sum + product.total, 0),
      2,
    );
    expect(cart.totalProducts).toBe(cart.products.length);
    expect(cart.totalQuantity).toBe(
      cart.products.reduce((sum: number, product: { quantity: number }) => sum + product.quantity, 0),
    );
    expect(typeof cart.discountedTotal).toBe('number');
  });

  test('registra que produtos recém-criados não ficam disponíveis para o carrinho', async ({ request }) => {
    const createdProducts = [];
    for (const title of [`QA cart item A ${randomUUID()}`, `QA cart item B ${randomUUID()}`]) {
      const response = await request.post('/products/add', { data: { title, price: 12.5 } });
      expect(response.status()).toBe(201);
      createdProducts.push(await response.json());
    }

    const response = await request.post('/carts/add', {
      data: {
        userId: 1,
        products: createdProducts.map((product) => ({ id: product.id, quantity: 1 })),
      },
    });

    expect(response.status()).toBe(201);
    const cart = await response.json();
    expect(Number.isInteger(cart.id)).toBe(true);
    expect(cart.userId).toBe(1);
    expect(cart.products).toEqual([]);
    expect(cart.totalProducts).toBe(0);
    expect(cart.totalQuantity).toBe(0);
  });

  test('consulta um carrinho predefinido e valida os campos de produto e preço', async ({ request }) => {
    const response = await request.get('/carts/1');

    expect(response.status()).toBe(200);
    const cart = await response.json();
    expect(cart.id).toBe(1);
    expect(Number.isInteger(cart.userId)).toBe(true);
    expect(Array.isArray(cart.products)).toBe(true);
    expect(cart.products.length).toBeGreaterThan(0);

    for (const product of cart.products) {
      expect(Number.isInteger(product.id)).toBe(true);
      expect(typeof product.title).toBe('string');
      expect(typeof product.quantity).toBe('number');
      expect(typeof product.price).toBe('number');
      expect(typeof product.total).toBe('number');
      expect(typeof product.discountedTotal).toBe('number');
    }

    expect(cart.total).toBeCloseTo(
      cart.products.reduce((sum: number, product: { total: number }) => sum + product.total, 0),
      2,
    );
    expect(cart.totalProducts).toBe(cart.products.length);
    expect(cart.totalQuantity).toBe(
      cart.products.reduce((sum: number, product: { quantity: number }) => sum + product.quantity, 0),
    );
  });

  test('retorna 404 para um carrinho inexistente', async ({ request }) => {
    const response = await request.get('/carts/999999');

    expect(response.status()).toBe(404);
    expect(typeof (await response.json()).message).toBe('string');
  });

  test('retorna 404 quando o ID do carrinho não é numérico', async ({ request }) => {
    const response = await request.get('/carts/not-a-number');

    expect(response.status()).toBe(404);
    expect(typeof (await response.json()).message).toBe('string');
  });

  test('rejeita um carrinho sem os dados obrigatórios', async ({ request }) => {
    const response = await request.post('/carts/add', { data: {} });

    expect(response.status()).toBe(400);
    expect((await response.text()).length).toBeGreaterThan(0);
  });

  test('exclui um carrinho e informa o estado simulado da exclusão', async ({ request }) => {
    const response = await request.delete('/carts/1');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body.isDeleted).toBe(true);
    expect(typeof body.deletedOn).toBe('string');
    expect(Number.isNaN(Date.parse(body.deletedOn))).toBe(false);
  });
});
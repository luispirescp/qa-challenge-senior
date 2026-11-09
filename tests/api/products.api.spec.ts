import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';

test.describe('Products API', () => {
  test('creates two distinct products and returns their generated IDs', async ({ request }) => {
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

  test('does not persist a product created through the simulated write endpoint', async ({ request }) => {
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

  test('returns 404 for a product that does not exist', async ({ request }) => {
    const response = await request.get('/products/999999');

    expect(response.status()).toBe(404);
    expect(typeof (await response.json()).message).toBe('string');
  });

  test('returns 404 when the product ID is not numeric', async ({ request }) => {
    const response = await request.get('/products/not-a-number');

    expect(response.status()).toBe(404);
    expect(typeof (await response.json()).message).toBe('string');
  });

  test('documents that simulated product creation does not validate required or numeric fields', async ({ request }) => {
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
import { expect, test } from '../fixtures/authenticated.fixture';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Estoque', () => {
  test('exibe seis produtos com nomes e preços', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);

    await expect(inventory.title).toHaveText('Products');
    await expect(inventory.products).toHaveCount(6);
    await expect(inventory.productByName('Sauce Labs Backpack').getByTestId('inventory-item-price'))
      .toHaveText('$29.99');
  });

  test('adiciona vários produtos e atualiza o contador do carrinho', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);

    await inventory.addProduct('sauce-labs-backpack');
    await inventory.addProduct('sauce-labs-bike-light');

    await expect(inventory.cartBadge).toHaveText('2');
  });
});
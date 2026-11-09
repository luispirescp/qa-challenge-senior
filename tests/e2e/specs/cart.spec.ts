import { expect, test } from '../fixtures/authenticated.fixture';
import { CartPage } from '../pages/CartPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Cart', () => {
  test('shows selected products, quantities, and prices', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.addProduct('sauce-labs-backpack');
    await inventory.addProduct('sauce-labs-bike-light');
    await inventory.openCart();

    const cart = new CartPage(authenticatedPage);
    await expect(cart.title).toHaveText('Your Cart');
    await expect(cart.items).toHaveCount(2);
    await expect(cart.productByName('Sauce Labs Backpack')).toContainText('$29.99');
    await expect(cart.productByName('Sauce Labs Bike Light')).toContainText('$9.99');
    await expect(cart.productByName('Sauce Labs Backpack').locator('.cart_quantity')).toHaveText('1');
  });

  test('removes products, shows an empty cart, and continues shopping', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.addProduct('sauce-labs-backpack');
    await inventory.openCart();

    const cart = new CartPage(authenticatedPage);
    await cart.removeProduct('sauce-labs-backpack');
    await expect(cart.items).toHaveCount(0);
    await expect(authenticatedPage.getByTestId('shopping-cart-badge')).toHaveCount(0);

    await cart.continueShopping();
    await expect(authenticatedPage).toHaveURL(/inventory\.html/);
  });
});
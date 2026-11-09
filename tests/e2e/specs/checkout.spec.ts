import { expect, test } from '../fixtures/authenticated.fixture';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Checkout', () => {
  test('reports each required personal field', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.addProduct('sauce-labs-backpack');
    await inventory.openCart();
    await new CartPage(authenticatedPage).checkout();

    const checkout = new CheckoutPage(authenticatedPage);
    await checkout.continue();
    await expect(checkout.errorMessage).toHaveText('Error: First Name is required');

    await checkout.fillFirstName('Ada');
    await checkout.continue();
    await expect(checkout.errorMessage).toHaveText('Error: Last Name is required');

    await checkout.fillLastName('Lovelace');
    await checkout.continue();
    await expect(checkout.errorMessage).toHaveText('Error: Postal Code is required');
  });

  test('reviews totals and completes an order', async ({ authenticatedPage }) => {
    const inventory = new InventoryPage(authenticatedPage);
    await inventory.addProduct('sauce-labs-backpack');
    await inventory.addProduct('sauce-labs-bike-light');
    await inventory.openCart();
    await new CartPage(authenticatedPage).checkout();

    const checkout = new CheckoutPage(authenticatedPage);
    await checkout.fillFirstName('Ada');
    await checkout.fillLastName('Lovelace');
    await checkout.fillPostalCode('10001');
    await checkout.continue();

    await expect(checkout.products).toHaveCount(2);
    await expect(checkout.productByName('Sauce Labs Backpack')).toContainText('$29.99');
    await expect(checkout.productByName('Sauce Labs Bike Light')).toContainText('$9.99');

    const subtotal = await checkout.amount('subtotal-label');
    const tax = await checkout.amount('tax-label');
    const total = await checkout.amount('total-label');
    expect(subtotal).toBeCloseTo(39.98, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);

    await checkout.finish();
    await expect(authenticatedPage.getByTestId('complete-header')).toHaveText(
      'Thank you for your order!',
    );
  });
});
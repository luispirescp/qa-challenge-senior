import type { Locator, Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  get title() {
    return this.page.getByTestId('title');
  }

  get items() {
    return this.page.getByTestId('cart-list').getByTestId('inventory-item');
  }

  productByName(name: string): Locator {
    return this.items.filter({ has: this.page.getByText(name, { exact: true }) });
  }

  async removeProduct(productId: string): Promise<void> {
    await this.page.getByTestId(`remove-${productId}`).click();
  }

  async continueShopping(): Promise<void> {
    await this.page.getByTestId('continue-shopping').click();
  }

  async checkout(): Promise<void> {
    await this.page.getByTestId('checkout').click();
  }
}
import type { Locator, Page } from '@playwright/test';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  get title() {
    return this.page.getByTestId('title');
  }

  get products() {
    return this.page.getByTestId('inventory-item');
  }

  get cartBadge() {
    return this.page.getByTestId('shopping-cart-badge');
  }

  productByName(name: string): Locator {
    return this.products.filter({ has: this.page.getByText(name, { exact: true }) });
  }

  async addProduct(productId: string): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${productId}`).click();
  }

  async openCart(): Promise<void> {
    await this.page.getByTestId('shopping-cart-link').click();
  }
}
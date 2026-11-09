import type { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  get errorMessage() {
    return this.page.getByTestId('error');
  }

  get products() {
    return this.page.getByTestId('cart-list').getByTestId('inventory-item');
  }

  productByName(name: string): Locator {
    return this.products.filter({ has: this.page.getByText(name, { exact: true }) });
  }

  async fillFirstName(value: string): Promise<void> {
    await this.page.getByTestId('firstName').fill(value);
  }

  async fillLastName(value: string): Promise<void> {
    await this.page.getByTestId('lastName').fill(value);
  }

  async fillPostalCode(value: string): Promise<void> {
    await this.page.getByTestId('postalCode').fill(value);
  }

  async continue(): Promise<void> {
    await this.page.getByTestId('continue').click();
  }

  async finish(): Promise<void> {
    await this.page.getByTestId('finish').click();
  }

  async amount(testId: string): Promise<number> {
    const text = await this.page.getByTestId(testId).innerText();
    const match = text.match(/\$([0-9]+\.\d{2})/);
    if (!match) {
      throw new Error(`Could not read currency amount from: ${text}`);
    }
    return Number(match[1]);
  }
}
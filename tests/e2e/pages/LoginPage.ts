import type { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  get errorMessage() {
    return this.page.getByTestId('error');
  }

  async open(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.getByTestId('username').fill(username);
    await this.page.getByTestId('password').fill(password);
    await this.page.getByTestId('login-button').click();
  }
}
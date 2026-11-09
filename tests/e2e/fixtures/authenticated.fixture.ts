import { expect, test as base, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type E2EFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<E2EFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
    await use(page);
  },
});

export { expect };
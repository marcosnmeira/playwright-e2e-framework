import { expect, type Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectAlert(message: string | RegExp): Promise<void> {
    await expect(this.page.getByRole('alert')).toContainText(message);
  }
}

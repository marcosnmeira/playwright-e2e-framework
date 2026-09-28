import { expect } from '@playwright/test';

import { APP_ROUTES } from '../config/routes';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  private readonly selectors = {
    rows: this.page.getByTestId('cart-row'),
    total: this.page.getByTestId('cart-total'),
    checkout: this.page.getByTestId('go-to-checkout'),
  };

  async goto(): Promise<void> {
    await super.goto(APP_ROUTES.cart);
  }

  async expectProductInCart(productName: string): Promise<void> {
    await expect(this.selectors.rows.filter({ hasText: productName })).toBeVisible();
  }

  async proceedToCheckout(): Promise<void> {
    await this.selectors.checkout.click();
  }

  async expectTotal(amount: string): Promise<void> {
    await expect(this.selectors.total).toHaveText(amount);
  }
}

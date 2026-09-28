import { expect } from '@playwright/test';

import { APP_ROUTES } from '../config/routes';
import type { CheckoutData } from '../data/products';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  private readonly selectors = {
    fullName: this.page.getByLabel('Nome completo'),
    address: this.page.getByLabel('Endereço'),
    cardNumber: this.page.getByLabel('Cartão'),
    submit: this.page.getByRole('button', { name: 'Finalizar pedido' }),
    feedback: this.page.getByTestId('checkout-feedback'),
    confirmation: this.page.getByTestId('order-confirmation'),
    summary: this.page.getByTestId('checkout-summary'),
  };

  async goto(): Promise<void> {
    await super.goto(APP_ROUTES.checkout);
  }

  async fillOrder(data: CheckoutData): Promise<void> {
    try {
      await this.selectors.fullName.fill(data.fullName);
      await this.selectors.address.fill(data.address);
      await this.selectors.cardNumber.fill(data.cardNumber);
      await this.selectors.submit.click();
    } catch (error) {
      throw new Error(`Falha ao preencher checkout: ${String(error)}`);
    }
  }

  async expectOrderConfirmed(customerName: string): Promise<void> {
    await expect(this.selectors.feedback).toContainText('Pedido realizado com sucesso');
    await expect(this.selectors.confirmation).toContainText(customerName);
  }

  async expectSummaryContains(productName: string): Promise<void> {
    await expect(this.selectors.summary).toContainText(productName);
  }
}

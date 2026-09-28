import { expect } from '@playwright/test';

import { APP_ROUTES } from '../config/routes';
import type { UserCredentials } from '../data/users';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly selectors = {
    email: this.page.getByLabel('E-mail'),
    password: this.page.getByLabel('Senha'),
    submit: this.page.getByRole('button', { name: 'Entrar' }),
    feedback: this.page.getByTestId('login-feedback'),
  };

  async goto(): Promise<void> {
    await super.goto(APP_ROUTES.login);
  }

  async login(credentials: UserCredentials): Promise<void> {
    try {
      await this.selectors.email.fill(credentials.email);
      await this.selectors.password.fill(credentials.password);
      await this.selectors.submit.click();
    } catch (error) {
      throw new Error(`Falha ao executar login para ${credentials.email}: ${String(error)}`);
    }
  }

  async expectSuccessfulLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/products\.html/);
    await expect(this.page.getByRole('heading', { name: 'Busca de produtos' })).toBeVisible();
  }

  async expectInvalidCredentials(): Promise<void> {
    await expect(this.selectors.feedback).toContainText('Credenciais inválidas');
  }
}

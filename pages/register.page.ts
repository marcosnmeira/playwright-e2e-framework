import { expect } from '@playwright/test';

import { APP_ROUTES } from '../config/routes';
import type { UserRegistration } from '../data/users';
import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  private readonly selectors = {
    firstName: this.page.getByLabel('Nome', { exact: true }),
    lastName: this.page.getByLabel('Sobrenome'),
    email: this.page.getByLabel('E-mail'),
    password: this.page.getByLabel('Senha'),
    submit: this.page.getByRole('button', { name: 'Criar conta' }),
    feedback: this.page.getByTestId('register-feedback'),
  };

  async goto(): Promise<void> {
    await super.goto(APP_ROUTES.register);
  }

  async register(user: UserRegistration): Promise<void> {
    try {
      await this.selectors.firstName.fill(user.firstName);
      await this.selectors.lastName.fill(user.lastName);
      await this.selectors.email.fill(user.email);
      await this.selectors.password.fill(user.password);
      await this.selectors.submit.click();
    } catch (error) {
      throw new Error(`Falha ao cadastrar usuário ${user.email}: ${String(error)}`);
    }
  }

  async expectRegistrationSuccess(): Promise<void> {
    await expect(this.selectors.feedback).toContainText('Cadastro realizado com sucesso');
    await expect(this.page).toHaveURL(/products\.html/);
  }
}

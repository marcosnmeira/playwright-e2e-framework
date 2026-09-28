import { test as base } from '@playwright/test';

import { checkoutData, checkoutProducts, searchScenarios } from '../data/products';
import { defaultUser, invalidLoginAttempts, registrationUsers } from '../data/users';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { LoginPage } from '../pages/login.page';
import { ProductsPage } from '../pages/products.page';
import { RegisterPage } from '../pages/register.page';
import { resetApplicationState } from '../utils/test-helpers';

type FrameworkFixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  accounts: {
    defaultUser: typeof defaultUser;
    invalidLoginAttempts: typeof invalidLoginAttempts;
    registrationUsers: typeof registrationUsers;
  };
  commerce: {
    searchScenarios: typeof searchScenarios;
    checkoutData: typeof checkoutData;
    checkoutProducts: typeof checkoutProducts;
  };
};

export const test = base.extend<FrameworkFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  accounts: async ({}, use) => {
    await use({ defaultUser, invalidLoginAttempts, registrationUsers });
  },
  commerce: async ({}, use) => {
    await use({ searchScenarios, checkoutData, checkoutProducts });
  },
  page: async ({ page, baseURL }, use) => {
    await resetApplicationState(page, baseURL || undefined);
    await use(page);
  },
});

export { expect } from '@playwright/test';

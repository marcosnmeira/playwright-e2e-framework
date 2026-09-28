import { test } from '../fixtures/test.fixture';
import { attachFailureArtifacts } from '../utils/test-helpers';

test.describe('Checkout flow', () => {
  test.beforeEach(async ({ loginPage, productsPage, accounts, commerce }) => {
    await loginPage.goto();
    await loginPage.login(accounts.defaultUser);
    await loginPage.expectSuccessfulLogin();

    for (const product of commerce.checkoutProducts) {
      await productsPage.addProductToCart(product);
      await productsPage.expectAddToCartFeedback(product);
    }
  });

  test.afterEach(async ({ page }, testInfo) => {
    await attachFailureArtifacts(page, testInfo);
  });

  test('should complete a checkout journey for authenticated user @smoke @regression', async ({
    cartPage,
    checkoutPage,
    commerce,
  }) => {
    await cartPage.goto();
    await cartPage.expectProductInCart(commerce.checkoutProducts[0]);
    await cartPage.expectProductInCart(commerce.checkoutProducts[1]);
    await cartPage.expectTotal('R$ 1.259,80');
    await cartPage.proceedToCheckout();

    await checkoutPage.expectSummaryContains(commerce.checkoutProducts[0]);
    await checkoutPage.expectSummaryContains(commerce.checkoutProducts[1]);
    await checkoutPage.fillOrder(commerce.checkoutData);
    await checkoutPage.expectOrderConfirmed(commerce.checkoutData.fullName);
  });
});

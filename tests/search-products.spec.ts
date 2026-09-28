import { test } from '../fixtures/test.fixture';
import { attachFailureArtifacts } from '../utils/test-helpers';

test.describe('Busca de produtos', () => {
  test.beforeEach(async ({ loginPage, productsPage, accounts }) => {
    await loginPage.goto();
    await loginPage.login(accounts.defaultUser);
    await loginPage.expectSuccessfulLogin();
    await productsPage.goto();
  });

  test.afterEach(async ({ page }, testInfo) => {
    await attachFailureArtifacts(page, testInfo);
  });

  for (const scenario of [0, 1]) {
    test(`should filter catalog using search dataset ${scenario + 1} @smoke @regression`, async ({
      productsPage,
      commerce,
    }) => {
      const searchScenario = commerce.searchScenarios[scenario];

      await productsPage.search(searchScenario.term);
      await productsPage.expectProductVisible(searchScenario.expectedProduct);
    });
  }
});

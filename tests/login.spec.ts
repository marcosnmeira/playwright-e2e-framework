import { test } from '../fixtures/test.fixture';
import { attachFailureArtifacts, expectVisibleHeading } from '../utils/test-helpers';

test.describe('Login E2E', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test.afterEach(async ({ page }, testInfo) => {
    await attachFailureArtifacts(page, testInfo);
  });

  test('should authenticate a seeded user successfully @smoke @regression', async ({
    loginPage,
    accounts,
    page,
  }) => {
    await loginPage.login(accounts.defaultUser);

    await loginPage.expectSuccessfulLogin();
    await expectVisibleHeading(page, 'Busca de produtos');
  });

  for (const attempt of [
    { label: 'senha inválida', data: '0' },
    { label: 'usuário inexistente', data: '1' },
  ]) {
    test(`should block login with ${attempt.label} @regression`, async ({
      loginPage,
      accounts,
    }) => {
      await loginPage.login(accounts.invalidLoginAttempts[Number(attempt.data)]);
      await loginPage.expectInvalidCredentials();
    });
  }
});

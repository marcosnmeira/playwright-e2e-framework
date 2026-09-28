import { test } from '../fixtures/test.fixture';
import { attachFailureArtifacts } from '../utils/test-helpers';

test.describe('Cadastro de usuário', () => {
  test.beforeEach(async ({ registerPage }) => {
    await registerPage.goto();
  });

  test.afterEach(async ({ page }, testInfo) => {
    await attachFailureArtifacts(page, testInfo);
  });

  for (const user of [0, 1]) {
    test(`should register a new account with dataset ${user + 1} @regression`, async ({
      registerPage,
      accounts,
      page,
    }) => {
      const candidate = accounts.registrationUsers[user];

      await registerPage.register(candidate);
      await registerPage.expectRegistrationSuccess();
      await page.getByTestId('current-user').waitFor({ state: 'visible' });
    });
  }
});

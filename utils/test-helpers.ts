import { expect, type Page, type TestInfo } from '@playwright/test';

export async function resetApplicationState(page: Page, baseURL?: string): Promise<void> {
  const target = baseURL ?? 'http://127.0.0.1:3000';
  await page.goto(target);
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
}

export async function attachFailureArtifacts(page: Page, testInfo: TestInfo): Promise<void> {
  if (testInfo.status === testInfo.expectedStatus) {
    return;
  }

  await testInfo.attach('dom-snapshot.html', {
    body: Buffer.from(await page.content()),
    contentType: 'text/html',
  });

  await testInfo.attach('local-storage.json', {
    body: Buffer.from(
      JSON.stringify(await page.evaluate(() => ({ ...window.localStorage })), null, 2),
    ),
    contentType: 'application/json',
  });
}

export async function expectVisibleHeading(page: Page, name: string | RegExp): Promise<void> {
  await expect(page.getByRole('heading', { name })).toBeVisible();
}

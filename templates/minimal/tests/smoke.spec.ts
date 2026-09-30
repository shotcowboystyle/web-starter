import { expect, test } from '@playwright/test';

test('index lists experiments and detail page links back', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  const firstEntry = page.locator('main li a').first();
  await expect(firstEntry).toBeVisible();
  await firstEntry.click();
  await expect(page.locator('h1')).toBeVisible();
  const back = page.getByRole('link', { name: /back/iu });
  await back.click();
  await expect(page).toHaveURL('/');
});

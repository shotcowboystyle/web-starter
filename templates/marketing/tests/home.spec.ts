import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load and show the main title', async ({ page }) => {
    await page.goto('/');
    const brandName = page.getByText(/Cooper/i).first();
    await expect(brandName).toBeVisible();
    await expect(page.getByText(/Ship Faster with/i)).toBeVisible();
    await expect(page.locator('[data-hero-variant="centered"]')).toBeVisible();
  });

  test('navigation to Pricing should work via Get Started button', async ({ page }) => {
    await page.goto('/');
    const getStartedBtn = page.getByRole('link', { name: /Get Started/i }).first();
    await getStartedBtn.click();
    await expect(page).toHaveURL(/\/pricing/);
  });
});

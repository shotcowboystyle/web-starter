import { test, expect } from '@playwright/test';

test.describe('Responsive', () => {
  test.use({ viewport: { height: 667, width: 375 } }); // iPhone SE size

  test('should show mobile menu and links', async ({ page }) => {
    await page.goto('/');

    // Wait for hydration
    await page.waitForTimeout(2000);

    // 1. Verify mobile menu button is visible
    const mobileMenuBtn = page.getByLabel(/Open Mobile Menu/i);
    await expect(mobileMenuBtn).toBeVisible();

    // 2. Click mobile menu
    await mobileMenuBtn.click();

    // 3. Verify menu panel is shown
    const menuPanel = page.getByRole('dialog');
    await expect(menuPanel).toBeVisible();

    // 4. Click a link in mobile menu
    const blogLink = menuPanel.getByRole('link', { name: /Blog/i }).first();
    await expect(blogLink).toBeVisible();
    await blogLink.click();

    // 5. Verify navigation away from home
    await expect(page).not.toHaveURL(/\/$/);
  });
});

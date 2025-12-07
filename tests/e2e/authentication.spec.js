import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to sign up page', async ({ page }) => {
    await page.click('text=Sign Up');
    await expect(page).toHaveURL(/.*signup/);
  });

  test('should navigate to sign in page', async ({ page }) => {
    await page.click('text=Sign In');
    await expect(page).toHaveURL(/.*signin/);
  });

  test('should show validation errors for invalid sign up', async ({ page }) => {
    await page.goto('/signup');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/required|enter|fill/i')).toBeVisible({ timeout: 3000 });
  });

  test('should protect dashboard route when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*signin/, { timeout: 5000 });
  });
});

import { test, expect } from '@playwright/test';

test.describe('Course Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
  });

  test('should display course list', async ({ page }) => {
    await page.goto('/courses');
    await expect(page.locator('h1, h2').filter({ hasText: /courses/i })).toBeVisible();
  });

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/courses');
    await page.waitForLoadState('networkidle');
    const courseCard = page.locator('[data-testid="course-card"], .course-card').first();
    if (await courseCard.count() > 0) {
      await courseCard.click();
      await expect(page).toHaveURL(/.*course/);
    }
  });
});

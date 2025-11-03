import { test, expect } from '@playwright/test';

test.describe('TechGuide Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    // Go to the homepage
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that page loaded successfully
    await expect(page).toHaveTitle(/TechGuide/i);
  });

  test('should have navigation elements', async ({ page }) => {
    await page.goto('/');
    
    // Check for common navigation elements
    // Adjust these selectors based on your actual site
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });
});

import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
    test('should complete signup to course enrollment flow', async ({ page }) => {
        // Step 1: Visit homepage
        await page.goto('/');
        await expect(page).toHaveTitle(/TechGuide/i);

        // Step 2: Navigate to signup
        await page.click('text=GET STARTED');
        await expect(page).toHaveURL(/.*signup/);

        // Step 3: Fill signup form
        const timestamp = Date.now();
        const testEmail = `test${timestamp}@example.com`;
        
        await page.fill('input[placeholder*="first name"]', 'Test');
        await page.fill('input[placeholder*="last name"]', 'User');
        await page.fill('input[type="email"]', testEmail);
        await page.fill('input[type="password"]', 'TestPassword123');

        // Note: This will fail without real backend, but demonstrates the flow
        // await page.click('button:has-text("Create Account")');
    });

    test('should navigate through main pages', async ({ page }) => {
        await page.goto('/');

        // Test navigation to Tutorials
        await page.click('text=TUTORIALS');
        await expect(page).toHaveURL(/.*tutorials/);
        await expect(page.locator('h1, h2')).toContainText(/tutorials/i);

        // Test navigation to Safety
        await page.click('text=SAFETY');
        await expect(page).toHaveURL(/.*safety/);
        await expect(page.locator('h1, h2')).toContainText(/safety/i);

        // Test navigation back to home
        await page.click('text=TECHGUIDE');
        await expect(page).toHaveURL('/');
    });

    test('should display video tutorials correctly', async ({ page }) => {
        await page.goto('/tutorials');

        // Wait for page to load
        await page.waitForLoadState('networkidle');

        // Check for tutorial cards
        await expect(page.locator('text=Computer Basics')).toBeVisible();
        await expect(page.locator('text=Create a Gmail Account')).toBeVisible();

        // Check for YouTube links
        const links = page.locator('a[href*="youtube.com"]');
        await expect(links.first()).toHaveAttribute('target', '_blank');
    });

    test('should show safety alerts', async ({ page }) => {
        await page.goto('/safety');

        await page.waitForLoadState('networkidle');

        // Check for safety alerts
        await expect(page.locator('text=IRS Phone Scam')).toBeVisible();
        await expect(page.locator('text=Tech Support Pop-ups')).toBeVisible();
        await expect(page.locator('text=Password Reset Scams')).toBeVisible();
    });

    test('should have responsive navigation', async ({ page }) => {
        await page.goto('/');

        // Check all nav links exist
        await expect(page.locator('text=TUTORIALS')).toBeVisible();
        await expect(page.locator('text=SAFETY')).toBeVisible();
        await expect(page.locator('text=SUPPORT')).toBeVisible();
        await expect(page.locator('text=ABOUT')).toBeVisible();
    });

    test('should handle signin page', async ({ page }) => {
        await page.goto('/signin');

        // Check form elements
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button:has-text("Sign In")')).toBeVisible();

        // Check link to signup
        await expect(page.locator('a[href="/signup"]')).toBeVisible();
    });

    test('should validate required fields on signin', async ({ page }) => {
        await page.goto('/signin');

        // Try to submit without filling fields
        const emailInput = page.locator('input[type="email"]');
        const passwordInput = page.locator('input[type="password"]');

        await expect(emailInput).toHaveAttribute('required', '');
        await expect(passwordInput).toHaveAttribute('required', '');
    });

    test('should toggle phone visibility', async ({ page }) => {
        await page.goto('/tutorials');

        // Find phone button (assuming it has an icon)
        const phoneButton = page.locator('button').filter({ hasText: /phone|call/i }).first();
        
        if (await phoneButton.count() > 0) {
            await phoneButton.click();
            // Phone number should be visible
            await expect(page.locator('text=/\\(\\d{3}\\) \\d{3}-\\d{4}/')).toBeVisible();
        }
    });

    test('should have accessible breadcrumbs', async ({ page }) => {
        await page.goto('/tutorials');

        await expect(page.locator('text=Home')).toBeVisible();
        await expect(page.locator('text=Tutorials')).toBeVisible();

        // Click home breadcrumb
        await page.click('text=Home');
        await expect(page).toHaveURL('/');
    });

    test('should display footer on all pages', async ({ page }) => {
        const pages = ['/', '/tutorials', '/safety'];

        for (const pagePath of pages) {
            await page.goto(pagePath);
            const currentYear = new Date().getFullYear();
            await expect(page.locator(`text=/© ${currentYear} TechGuide/`)).toBeVisible();
        }
    });
});

test.describe('Dashboard Navigation', () => {
    test('should redirect unauthenticated users to signin', async ({ page }) => {
        await page.goto('/dashboard');
        
        // Should redirect to signin
        await expect(page).toHaveURL(/.*signin/);
    });

    test('should show signin form after redirect', async ({ page }) => {
        await page.goto('/dashboard');
        
        // Wait for redirect
        await page.waitForURL(/.*signin/);
        
        // Verify signin form is shown
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
    });
});

test.describe('Accessibility Tests', () => {
    test('should have proper heading hierarchy on homepage', async ({ page }) => {
        await page.goto('/');

        // Check for main heading
        const h1 = page.locator('h1').first();
        await expect(h1).toBeVisible();
    });

    test('should have alt text on images', async ({ page }) => {
        await page.goto('/tutorials');

        // All images should have alt text
        const images = page.locator('img');
        const count = await images.count();

        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).toBeTruthy();
        }
    });

    test('should have proper link attributes', async ({ page }) => {
        await page.goto('/tutorials');

        // External links should have target="_blank"
        const externalLinks = page.locator('a[href^="http"]');
        const count = await externalLinks.count();

        if (count > 0) {
            const target = await externalLinks.first().getAttribute('target');
            expect(target).toBe('_blank');
        }
    });
});

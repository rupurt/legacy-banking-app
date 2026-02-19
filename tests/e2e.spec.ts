import { test, expect } from '@playwright/test';

test.describe('Banking App E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
  });

  test('should navigate to customer list and view a profile', async ({ page }) => {
    await page.click('text=Customer List');
    await expect(page.locator('h2')).toContainText('Customer Directory');
    
    // Check if some customers are listed
    await expect(page.locator('table tbody tr')).toHaveCount(3); // John, Jane, Frodo
    
    await page.click('text=View Profile >> nth=0'); // First customer
    await expect(page.locator('.card-header')).toContainText('Customer Record');
  });

  test('should register a new customer', async ({ page }) => {
    await page.click('text=New Customer');
    await page.fill('input[name="firstName"]', 'Bilbo');
    await page.fill('input[name="lastName"]', 'Baggins');
    await page.fill('input[name="email"]', 'bilbo@example.com');
    await page.fill('input[name="dateOfBirth"]', '1900-01-01');
    await page.fill('input[name="cifNumber"]', 'CIF-111111');
    await page.click('button:has-text("Submit Registration")');
    
    // Should redirect to customer profile
    await page.waitForURL(/.*#customers\/\d+/);
    await expect(page.locator('.card-header')).toContainText('Customer Record: Bilbo Baggins');
  });

  test('should search for a customer', async ({ page }) => {
    await page.fill('#nav-customer-id', 'Frodo');
    await page.click('#lookup-customer-form button');
    
    await expect(page.locator('.card-header')).toContainText('Customer Record: Frodo Baggins');
  });

  test('should open a new account and process a transaction', async ({ page }) => {
    // Navigate to Frodo's profile
    await page.goto('http://localhost:8080/#customers/3');
    
    // Open new account
    await page.selectOption('select[name="productCode"]', 'SAV-HYS');
    await page.fill('input[name="balance"]', '1000');
    
    // Count existing SAV-HYS rows
    const initialCount = await page.locator('table tbody tr:has-text("SAV-HYS")').count();
    
    await page.click('button:has-text("Initialize Account")');
    
    // Wait for a new account row to appear
    await expect(page.locator('table tbody tr:has-text("SAV-HYS")')).toHaveCount(initialCount + 1);
    
    const accountRow = page.locator('table tbody tr:has-text("SAV-HYS")').last();
    
    // View account details
    await accountRow.locator('text=View').click();
    
    // Wait for the new page to load
    await expect(page.locator('.card-header').first()).toContainText('Account Overview', { timeout: 10000 });
    
    // Process a deposit
    await page.selectOption('select[name="transactionType"]', 'DEPOSIT');
    await page.fill('input[name="amount"]', '500');
    await page.click('button:has-text("Execute Transaction")');
    
    // Check new balance (should be 1500)
    await expect(page.locator('text=Current Balance: 1500')).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('dashboard and core views render', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Profitability overview' })).toBeVisible();
  await expect(page.locator('.metric')).toHaveCount(4);
  await expect(page.locator('.chart svg')).toBeVisible();
  await page.locator('.nav [data-page="portfolio"]').click();
  await expect(page.getByRole('heading', { name: 'Product portfolio' })).toBeVisible();
  await expect(page.locator('tbody tr')).toHaveCount(6);
  await page.locator('[data-page="lab"]').click();
  await expect(page.getByRole('heading', { name: 'Unit economics' })).toBeVisible();
});

test('add a product and search for it', async ({ page }) => {
  await page.locator('[data-action="add-product"]').first().click();
  await page.locator('#p-name').fill('QA test product');
  await page.locator('#p-category').fill('QA fixture');
  await page.locator('#p-price').fill('120');
  await page.locator('#p-cost').fill('30');
  await page.locator('#p-fulfill').fill('2');
  await page.locator('#p-fixed').fill('0.3');
  await page.locator('#p-fee').fill('3');
  await page.locator('#p-overhead').fill('4');
  await page.locator('#p-target').fill('60');
  await page.locator('#p-volume').fill('10');
  await page.locator('#p-description').fill('Created by browser smoke test');
  await page.locator('#save-product').click();
  await page.locator('.nav [data-page="portfolio"]').click();
  await page.locator('#search').fill('QA test product');
  await expect(page.getByText('QA test product')).toBeVisible();
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('tbody tr').first()).toContainText('$120.00');
});

test('price lab updates and saves a scenario', async ({ page }) => {
  await page.locator('[data-page="lab"]').click();
  await page.locator('#lab-price').fill('129');
  await expect(page.locator('#lab-profit')).not.toHaveText('$0.00');
  page.once('dialog', dialog => dialog.accept('Playwright test scenario'));
  await page.locator('[data-action="save-scenario"]').click();
  await page.locator('[data-page="scenarios"]').click();
  await expect(page.getByText('Playwright test scenario')).toBeVisible();
  await expect(page.locator('.scenario')).toHaveCount(1);
});

test('workspace backup triggers a JSON download', async ({ page }) => {
  await page.locator('.nav [data-page="settings"]').click();
  await page.locator('[data-settings-tab="data"]').click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-action="backup"]').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^marginguard-backup-.*\.json$/);
});

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
  const getTargetPrice = async () => Number((await page.locator('#lab-targetprice').textContent()).replace(/[^0-9.]/g, ''));
  const noDiscountTarget = await getTargetPrice();
  await page.locator('#lab-discount').evaluate(el => { el.value = '20'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  const discountedTarget = await getTargetPrice();
  expect(discountedTarget).toBeGreaterThan(noDiscountTarget);
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
  await page.getByRole('button', { name: '↧ Download JSON backup' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^marginguard-backup-.*\.json$/);
});

test('CSV export protects formula-like cells even when whitespace comes first', async ({ page }) => {
  await page.evaluate(() => {
    const key = 'marginguard.workspace.v1';
    const workspace = JSON.parse(localStorage.getItem(key));
    workspace.products[0].name = '  =1+1';
    localStorage.setItem(key, JSON.stringify(workspace));
  });
  await page.reload();
  await page.locator('.nav [data-page="portfolio"]').click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-action="export-csv"]').click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const csvText = Buffer.concat(chunks).toString('utf8');
  expect(csvText).toContain('"\'  =1+1"');
  expect(csvText.split(/\r?\n/).length).toBe(7);
});

test('JSON restore sanitizes settings and ignores malformed scenarios', async ({ page }) => {
  const backup = await page.evaluate(() => {
    const workspace = JSON.parse(localStorage.getItem('marginguard.workspace.v1'));
    workspace.settings = { business: '<img src=x onerror=alert(1)>', currency: 'INVALID', target: 999, fee: -5 };
    workspace.scenarios = [{ id: 'bad', productId: 'not-a-product', name: '<img src=x>', date: 'not-a-date', price: -2 }];
    return JSON.stringify({ ...workspace, product: 'MarginGuard', format: 'marginguard-workspace-backup' });
  });
  await page.locator('.nav [data-page="settings"]').click();
  await page.locator('[data-settings-tab="data"]').click();
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#import-file').setInputFiles({
    name: 'edited-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(backup)
  });
  await expect(page.getByText('Workspace backup imported.')).toBeVisible();
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('marginguard.workspace.v1')));
  expect(state.settings.currency).toBe('USD');
  expect(state.settings.target).toBe(65);
  expect(state.settings.fee).toBe(2.9);
  expect(state.scenarios).toHaveLength(0);
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
});

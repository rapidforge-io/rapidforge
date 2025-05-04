
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  const adminPassword = process.env.RF_ADMIN_PASSWORD;
  await page.goto('https://main.rapidforge.io/login');
  await page.getByRole('textbox', { name: 'Username *' }).click();
  await page.getByRole('textbox', { name: 'Username *' }).fill('admin');
  await page.getByRole('textbox', { name: 'Username *' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password *' }).fill(adminPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Create Block' }).click();
  await page.locator('#title-container svg').click();
  await page.getByRole('textbox').click();
  await page.getByRole('radio', { name: 'Pages' }).click();
  await page.locator('#entities').getByRole('button', { name: 'Create' }).click();
  await page.getByRole('link', { name: 'Back' }).click();
  await page.locator('#entities').getByRole('button', { name: 'Create' }).click();
  await page.locator('.CodeMirror-scroll').click();
  await page.getByLabel('Editor').locator('div').filter({ hasText: '# Special variables injected by RapidForge, check tooltip # echo \'You can write' }).getByRole('textbox').fill('i"');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByLabel('Blocks').click();
  await page.getByRole('radio', { name: 'Pages' }).click();
  await page.getByText('page-').click();
  await page.getByRole('link', { name: 'Edit' }).click();
  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByText('webhook -').click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByText('Delete').click();
  await page.getByLabel('Blocks').click();
});
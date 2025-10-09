
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
  await page.locator('#codeEditor').click();
  await page.getByText('# Special variables injected')
  await page.getByRole('button', { name: 'Save' }).click();
  await page.locator('#backButton').click();
  await page.getByRole('radio', { name: 'Pages' }).click();
  await page.getByText('page-').click();
  await page.getByRole('link', { name: 'Edit' }).click();
  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByRole('radio', { name: 'Periodic Tasks' }).click();
  await page.locator('#entities').getByRole('button', { name: 'Create' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.locator('#backButton').click();

  await page.getByText('webhook -').click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByText('Delete').click();
  await page.locator('#backButton').click();
});
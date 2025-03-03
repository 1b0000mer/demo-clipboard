import { test, expect, Page } from '@playwright/test';

let page: Page;
let clipboardText = "Hello World";

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage({permissions: []});
  await page.goto('https://www.w3schools.com/howto/howto_js_copy_clipboard.asp');
  await page.getByText('Accept all').click();
  // await page.evaluate((clipboardText) => {
  //   navigator.clipboard.writeText(clipboardText);
  // }, clipboardText);
});

test.afterEach(async () => page.context().close());

test('Clipboard success', async () => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole("button", { name: "Copy text", exact: true }).click();
  // await page.keyboard.press('Control+v');
  await expect(page.getByText(`Copied: ${clipboardText}`)).toBeVisible({ timeout: 3000 });
  await expect(page.evaluate(() => navigator.clipboard.readText())).resolves.toBe(clipboardText);
});

test('Clipboard fail', async () => {
  await page.context().clearPermissions();
  await page.getByRole("button", { name: "Copy text", exact: true }).click();
  await expect(page.getByText(`Copied: ${clipboardText}`)).not.toBeVisible({ timeout: 3000 });
  await expect(page.evaluate(() => navigator.clipboard.readText())).resolves.not.toBe(clipboardText);
});

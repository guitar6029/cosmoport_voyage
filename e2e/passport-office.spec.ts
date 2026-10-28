import { expect, test } from "@playwright/test";

test("keeps the Passport Office readable on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto("/passport-office");

  await expect(page.getByRole("button", { name: "Just looking around." })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

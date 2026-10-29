import { expect, test } from "@playwright/test";

test("presents AstroPop as the only active Grand Concourse experience", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Explore the Concourse" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Enter AstroPop" })).toHaveAttribute("href", "/astro-pop");
  await expect(page.getByText("Under Construction", { exact: true })).toBeVisible();
  await expect(page.locator('a[href="/cosmoport-voyage"]')).toHaveCount(0);

  await page.getByRole("link", { name: "Enter AstroPop" }).click();
  await expect(page).toHaveURL(/\/astro-pop$/);
});

test("keeps the hero, auth navigation, and content free of horizontal overflow", async ({ page }) => {
  for (const width of [320, 375, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    await expect(page.locator(".grand-concourse__hero-art")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "CosmoPort Universe" }).getByRole("link", { name: "Sign In" })).toHaveAttribute("href", "/passport-office?intent=sign-in");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

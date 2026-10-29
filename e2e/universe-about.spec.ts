import { expect, test } from "@playwright/test";

test.describe("CosmoPort Universe About page", () => {
  test("offers a route back to the Universe home", async ({ page }) => {
    await page.goto("/about");

    await expect(page.getByRole("heading", { name: /One Universe/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Visit Astro Pop/ })).toHaveAttribute("href", "/astro-pop");
    await expect(page.getByText("In development", { exact: true })).toBeVisible();
    await expect(page.locator(".universe-multiverse-collage img")).toHaveCount(6);

    await page.getByRole("link", { name: /Return to the Universe/ }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("keeps the collage in the viewport without horizontal overflow on representative widths", async ({ page }) => {
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/about");
      await expect(page.locator(".universe-multiverse-collage img")).toHaveCount(6);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  });
});

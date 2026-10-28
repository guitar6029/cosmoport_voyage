import { expect, test } from "@playwright/test";

test.describe("CosmoPort Universe About page", () => {
  test("offers the About destination and a route back to the Universe home", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "About", exact: true }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole("heading", { name: /One Universe/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Visit Astro Pop/ })).toHaveAttribute("href", "/astro-pop");
    await expect(page.getByText("In development", { exact: true })).toBeVisible();

    await page.getByRole("link", { name: /Return to the Universe/ }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});

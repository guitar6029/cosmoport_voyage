import { expect, test } from "@playwright/test";

test.describe("AstroPop route-aware navigation", () => {
  test("keeps homepage section shortcuts as local anchors", async ({ page }) => {
    await page.goto("/astro-pop");

    await page.getByRole("link", { name: "Flavors", exact: true }).click();

    await expect(page).toHaveURL(/\/astro-pop#astropop-flavors-title$/);
    await expect(page.locator("#astropop-flavors-title")).toBeInViewport();
  });

  test("takes story and flavor-detail visitors to the homepage flavors section", async ({ page }) => {
    await page.goto("/astro-pop/our-story");
    await page.getByRole("link", { name: "Shop Flavors" }).click();

    await expect(page).toHaveURL(/\/astro-pop\/#astropop-flavors-title$/);
    await expect(page.locator("#astropop-flavors-title")).toBeInViewport();

    await page.goBack();
    await expect(page).toHaveURL(/\/astro-pop\/our-story$/);

    await page.goto("/astro-pop/flavors/atomic-cherry-fizz");
    await page.getByRole("link", { name: "Shop Flavors" }).click();

    await expect(page).toHaveURL(/\/astro-pop\/#astropop-flavors-title$/);
    await expect(page.locator("#astropop-flavors-title")).toBeInViewport();
  });

  test("takes the Our Story closing CTA to the homepage flavors section", async ({ page }) => {
    await page.goto("/astro-pop/our-story");

    await page.getByRole("link", { name: "Explore Our Flavors" }).click();

    await expect(page).toHaveURL(/\/astro-pop\/#astropop-flavors-title$/);
    await expect(page.locator("#astropop-flavors-title")).toBeInViewport();
  });

  test("supports direct flavor anchors, home links, reactive cart labels, and the mobile drawer", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("astropop-crate", JSON.stringify([
        { flavorId: "atomic-cherry-fizz", quantity: 2 },
      ]));
    });
    await page.goto("/astro-pop/#astropop-flavors-title");

    await expect(page.locator("#astropop-flavors-title")).toBeInViewport();

    await page.goto("/astro-pop/our-story");
    await expect(page.getByRole("link", { name: "Astro Pop home" })).toHaveAttribute("href", "/astro-pop");
    await expect(page.getByRole("link", { name: "Cart, 2 bottles" })).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page.getByRole("dialog", { name: "AstroPop navigation menu" }).getByRole("link", { name: "Shop Flavors" }).click();

    await expect(page).toHaveURL(/\/astro-pop\/#astropop-flavors-title$/);
    await expect(page.getByRole("dialog", { name: "AstroPop navigation menu" })).toHaveCount(0);
  });
});

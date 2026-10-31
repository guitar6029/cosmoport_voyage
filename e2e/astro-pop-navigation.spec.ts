import { expect, test } from "@playwright/test";

test.describe("AstroPop route-aware navigation", () => {
  test("keeps homepage section shortcuts as local anchors", async ({ page }) => {
    await page.goto("/app/astro-pop");

    // Wait until the desktop navigation has mounted.
    await expect(
      page.getByRole("button", { name: "Back to top" }),
    ).toBeVisible();

    const flavorsLink = page.getByRole("link", {
      name: "Flavors",
      exact: true,
    });

    await expect(flavorsLink).toHaveAttribute(
      "href",
      "#astropop-flavors-title",
    );

    await flavorsLink.click();

    await expect(page).toHaveURL(
      /\/app/astro-pop#astropop-flavors-title$/,
    );

    await expect(
      page.locator("#astropop-flavors-title"),
    ).toBeInViewport();
  });

  test("takes story and flavor-detail visitors to the homepage flavors section", async ({ page }) => {
    await page.goto("/app/astro-pop/our-story");
    await page.getByRole("link", { name: "Shop Flavors" }).click();

    await expect(page).toHaveURL(/\/app\/astro-pop\/#astropop-flavors-title$/);
    await expect(page.locator("#astropop-flavors-title")).toBeInViewport();

    await page.goBack();
    await expect(page).toHaveURL(/\/app\/astro-pop\/our-story$/);

    await page.goto("/app/astro-pop/flavors/atomic-cherry-fizz");
    await page.getByRole("link", { name: "Shop Flavors" }).click();

    await expect(page).toHaveURL(/\/app\/astro-pop\/#astropop-flavors-title$/);
    await expect(page.locator("#astropop-flavors-title")).toBeInViewport();
  });

  test("takes the Our Story closing CTA to the homepage flavors section", async ({ page }) => {
    await page.goto("/app/astro-pop/our-story");

    await page.getByRole("link", { name: "Explore Our Flavors" }).click();

    await expect(page).toHaveURL(/\/app\/astro-pop\/#astropop-flavors-title$/);
    await expect(page.locator("#astropop-flavors-title")).toBeInViewport();
  });

  test("takes Our Story footer shortcuts to homepage sections and returns to the current page top", async ({ page }) => {
    await page.goto("/app/astro-pop/our-story");
    const footer = page.getByRole("contentinfo");

    await footer.getByRole("link", { name: "Our Marvelous Flavors" }).click();
    await expect(page).toHaveURL(/\/app\/astro-pop\/#astropop-flavors-title$/);
    await expect(page.locator("#astropop-flavors-title")).toBeInViewport();

    await page.goBack();
    await expect(page).toHaveURL(/\/app\/astro-pop\/our-story$/);
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight }));
    await footer.getByRole("link", { name: "Back to Top" }).click();
    await expect(page).toHaveURL(/\/app\/astro-pop\/our-story$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("supports direct flavor anchors, home links, reactive cart labels, and the mobile drawer", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("astropop-crate", JSON.stringify([
        { flavorId: "atomic-cherry-fizz", quantity: 2 },
      ]));
    });
    await page.goto("/app/astro-pop/#astropop-flavors-title");

    await expect(page.locator("#astropop-flavors-title")).toBeInViewport();

    await page.goto("/app/astro-pop/our-story");
    await expect(page.getByRole("link", { name: "Astro Pop home" })).toHaveAttribute("href", "/app/astro-pop");
    await expect(page.getByRole("link", { name: "Cart, 2 bottles" })).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page.getByRole("dialog", { name: "AstroPop navigation menu" }).getByRole("link", { name: "Shop Flavors" }).click();

    await expect(page).toHaveURL(/\/app\/astro-pop\/#astropop-flavors-title$/);
    await expect(page.getByRole("dialog", { name: "AstroPop navigation menu" })).toHaveCount(0);
  });
});

import { expect, test, type Page } from "@playwright/test";

const GRAND_CONCOURSE_CDN_URL = "https://media.cosmos-universe.com/grand-concourse/cosmoport-grand-concourse.png";
const GRAND_CONCOURSE_ALT = "Illustrated CosmoPort Grand Concourse terminal, with travelers, a central CosmoPort sign, and the AstroPop Soda Co. storefront.";
const ONE_PIXEL_PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL5SAAAAABJRU5ErkJggg==", "base64");

async function mockGrandConcourseImage(page: Page, status: 200 | 404) {
  await page.route(GRAND_CONCOURSE_CDN_URL, async (route) => {
    await route.fulfill(status === 200
      ? { status, contentType: "image/png", body: ONE_PIXEL_PNG }
      : { status });
  });
}

test("presents AstroPop as the only active Grand Concourse experience", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Explore the Concourse" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Enter AstroPop" })).toHaveAttribute("href", "/astro-pop");
  await expect(page.getByText("Under Construction", { exact: true })).toBeVisible();
  await expect(page.locator('a[href="/cosmoport-voyage"]')).toHaveCount(0);

  await page.getByRole("link", { name: "Enter AstroPop" }).click();
  await expect(page).toHaveURL(/\/astro-pop$/);
});

test("renders the Grand Concourse illustration when the CDN returns a valid PNG", async ({ page }) => {
  await mockGrandConcourseImage(page, 200);
  await page.goto("/");

  const image = page.locator(".grand-concourse__hero-art img");
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute("src", GRAND_CONCOURSE_CDN_URL);
  await expect(image).toHaveAttribute("alt", GRAND_CONCOURSE_ALT);
  expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
});

test("shows the designed fallback when the Grand Concourse image is unavailable", async ({ page }) => {
  await mockGrandConcourseImage(page, 404);
  await page.goto("/");

  await expect(page.locator(".grand-concourse__hero-fallback")).toBeVisible();
  await expect(page.locator(".grand-concourse__hero-art img")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Explore the Concourse" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Enter AstroPop" })).toHaveAttribute("href", "/astro-pop");
});

test("keeps the hero, auth navigation, and content free of horizontal overflow", async ({ page }) => {
  await mockGrandConcourseImage(page, 200);

  for (const width of [320, 375, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    await expect(page.locator(".grand-concourse__hero-art img")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "CosmoPort Universe" }).getByRole("link", { name: "Sign In" })).toHaveAttribute("href", "/passport-office?intent=sign-in");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

// Optional manual smoke check (never run in standard CI):
// RUN_GRAND_CONCOURSE_CDN_SMOKE=true npx playwright test e2e/universe-home.spec.ts --grep "real Grand Concourse CDN"
test("optional manual smoke check for the real Grand Concourse CDN", async ({ page }) => {
  test.skip(process.env.RUN_GRAND_CONCOURSE_CDN_SMOKE !== "true", "Set RUN_GRAND_CONCOURSE_CDN_SMOKE=true to exercise the live CDN.");
  await page.goto("/");

  const image = page.locator(".grand-concourse__hero-art img");
  await expect(image).toHaveAttribute("src", GRAND_CONCOURSE_CDN_URL);
  expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
});

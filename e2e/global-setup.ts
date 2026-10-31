import { chromium, expect } from "@playwright/test";

const cartItems = [{ flavorId: "atomic-cherry-fizz", quantity: 2 }];
const baseURL = `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT ?? "3000"}`;

export default async function warmAstroPopCart() {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage();

    await page.addInitScript((items) => {
      window.localStorage.setItem("astropop-crate", JSON.stringify(items));
    }, cartItems);

    const response = await page.goto(`${baseURL}/app/astro-pop/cart`);

    if (!response?.ok()) {
      throw new Error(`Astro Pop cart warmup returned HTTP ${response?.status()}`);
    }

    await expect(page.getByText("2 of 6 bottles")).toBeVisible({ timeout: 30_000 });
  } finally {
    await browser.close();
  }
}

import { expect, test, type Page } from "@playwright/test";

const cartItems = [{ flavorId: "atomic-cherry-fizz", quantity: 2 }];
const cartInitializationKey = "astropop-e2e-cart-initialized";
const diagnosticsByPage = new WeakMap<Page, {
  console: string[];
  pageErrors: string[];
  failedRequests: string[];
  responses: string[];
}>();

test.beforeEach(({ page }) => {
  const diagnostics = {
    console: [] as string[],
    pageErrors: [] as string[],
    failedRequests: [] as string[],
    responses: [] as string[],
  };

  diagnosticsByPage.set(page, diagnostics);
  page.on("console", (message) => {
    diagnostics.console.push(`${message.type()}: ${message.text()}`);
  });
  page.on("pageerror", (error) => {
    diagnostics.pageErrors.push(error.message);
  });
  page.on("requestfailed", (request) => {
    diagnostics.failedRequests.push(
      `${request.method()} ${request.url()} — ${request.failure()?.errorText ?? "unknown failure"}`,
    );
  });
  page.on("response", (response) => {
    if (response.url().includes("/astro-pop/cart")) {
      diagnostics.responses.push(`${response.status()} ${response.url()}`);
    }
  });
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === testInfo.expectedStatus) {
    return;
  }

  const state = await page.evaluate(() => {
    const entriesFor = (storage: Storage) => Object.fromEntries(
      Array.from({ length: storage.length }, (_, index) => storage.key(index))
        .filter((key): key is string => key?.startsWith("astropop-") ?? false)
        .map((key) => [key, storage.getItem(key)]),
    );

    return {
      url: window.location.href,
      localStorage: entriesFor(window.localStorage),
      sessionStorage: entriesFor(window.sessionStorage),
      bodyText: document.body.innerText,
      bodyHtml: document.body.innerHTML,
    };
  }).catch((error: unknown) => ({ evaluationError: String(error) }));

  await testInfo.attach("checkout-page-diagnostics.json", {
    body: JSON.stringify({
      ...state,
      ...(diagnosticsByPage.get(page) ?? {}),
    }, null, 2),
    contentType: "application/json",
  });
});

const configureCheckout = async (
  page: Page,
  sessionId: string,
  checkoutUrl = `/astro-pop/checkout/success?session_id=${sessionId}`,
) => {
  await page.route("**/api/astro-pop/checkout", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ url: checkoutUrl, sessionId }),
    });
  });
};

const seedCartAndOpenCart = async (page: Page) => {
  await page.addInitScript(`
    if (!window.sessionStorage.getItem(${JSON.stringify(cartInitializationKey)})) {
      window.localStorage.setItem("astropop-crate", ${JSON.stringify(JSON.stringify(cartItems))});
      window.sessionStorage.setItem(${JSON.stringify(cartInitializationKey)}, "true");
    }
  `);
  await page.goto("/astro-pop/cart");
  await expect(page.getByText("2 of 6 bottles")).toBeVisible();
};

const clickCheckout = async (page: Page) => {
  await page.getByRole("button", { name: "Proceed to Checkout" }).click();
};

test("clears the persisted cart only after a verified checkout return", async ({ page }) => {
  const sessionId = "cs_e2e_paid";
  await configureCheckout(page, sessionId);
  await page.route("**/api/astro-pop/checkout/verify?*", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ sessionId, verified: true }),
    });
  });

  await seedCartAndOpenCart(page);
  await clickCheckout(page);

  await expect(page.getByRole("heading", { name: "Thank you for your order" })).toBeVisible();
  await expect(page.getByText("Payment confirmed. Your rocket crate is on its way!")).toBeVisible();
  await expect(page.getByText("Your checkout cart has been cleared.")).toBeVisible();
  await expect(page.evaluate(() => window.localStorage.getItem("astropop-crate"))).resolves.toBeNull();
  await expect(page.evaluate(() => window.sessionStorage.getItem("astropop-pending-checkout"))).resolves.toBeNull();
  await expect(page.evaluate(() => window.sessionStorage.getItem("astropop-completed-checkout"))).resolves.toContain(sessionId);

  await page.goto("/astro-pop/cart");
  await expect(page.getByText("Your rocket crate is ready for liftoff.")).toBeVisible();
});

test("keeps the cart when checkout is cancelled and restores it after refresh", async ({ page }) => {
  await configureCheckout(
    page,
    "cs_e2e_cancelled",
    "/astro-pop/cart?checkout=cancelled",
  );
  await seedCartAndOpenCart(page);
  await clickCheckout(page);

  await expect(page).toHaveURL(/checkout=cancelled/);
  await expect(page.getByText("2 of 6 bottles")).toBeVisible();
  await expect(page.getByRole("button", { name: "Increase Atomic Cherry Fizz quantity" })).toBeEnabled();
  await expect(page.locator("#quantity-atomic-cherry-fizz")).toBeEnabled();
  await page.reload();
  await expect(page.getByText("2 of 6 bottles")).toBeVisible();
  await expect(page.evaluate(() => window.localStorage.getItem("astropop-crate"))).resolves.toBe(JSON.stringify(cartItems));
});

test("uses one immutable cart snapshot for the checkout request and pending session", async ({ page }) => {
  const sessionId = "cs_e2e_snapshot";
  let requestItems: unknown;
  let releaseCheckoutResponse: (() => void) | undefined;
  let resolveCheckoutRequest: (() => void) | undefined;
  const checkoutRequestStarted = new Promise<void>((resolve) => {
    resolveCheckoutRequest = resolve;
  });
  await page.route("**/api/astro-pop/checkout", async (route) => {
    requestItems = route.request().postDataJSON()?.items;
    resolveCheckoutRequest?.();
    await new Promise<void>((resolve) => {
      releaseCheckoutResponse = resolve;
    });
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        url: "/astro-pop/cart?checkout=external",
        sessionId,
      }),
    });
  });

  await seedCartAndOpenCart(page);
  await clickCheckout(page);
  await checkoutRequestStarted;

  await expect(page.getByRole("button", { name: "Preparing checkout..." })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Increase Atomic Cherry Fizz quantity" })).toBeDisabled();
  await expect(page.locator("#quantity-atomic-cherry-fizz")).toBeDisabled();
  await expect(page.getByRole("button", { name: "Remove bottle" })).toBeDisabled();
  releaseCheckoutResponse?.();

  await expect(page).toHaveURL(/checkout=external/);
  expect(requestItems).toEqual(cartItems);
  await expect(page.evaluate(() => window.sessionStorage.getItem("astropop-pending-checkout"))).resolves.toBe(
    JSON.stringify({ sessionId, cartItems }),
  );
});

test("releases the checkout lock and re-enables cart controls after initialization fails", async ({ page }) => {
  await page.route("**/api/astro-pop/checkout", async (route) => {
    await route.fulfill({ status: 500, contentType: "application/json", body: "{}" });
  });

  await seedCartAndOpenCart(page);
  await clickCheckout(page);

  await expect(page.getByText("Unable to start checkout. Please try again.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Increase Atomic Cherry Fizz quantity" })).toBeEnabled();
  await expect(page.locator("#quantity-atomic-cherry-fizz")).toBeEnabled();
  await expect(page.getByRole("button", { name: "Remove bottle" })).toBeEnabled();
});

test("preserves the cart when Stripe verification reports an unpaid session", async ({ page }) => {
  const sessionId = "cs_e2e_unpaid";
  await configureCheckout(page, sessionId);
  await page.route("**/api/astro-pop/checkout/verify?*", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ sessionId, verified: false }),
    });
  });

  await seedCartAndOpenCart(page);
  await clickCheckout(page);

  await expect(page.getByText("We could not verify your payment yet. Your cart is still saved.")).toBeVisible();
  await expect(page.evaluate(() => window.localStorage.getItem("astropop-crate"))).resolves.toBe(JSON.stringify(cartItems));
});

test("does not show success or clear the cart when verification is invalid", async ({ page }) => {
  const sessionId = "cs_e2e_invalid";
  await configureCheckout(page, sessionId);
  await page.route("**/api/astro-pop/checkout/verify?*", async (route) => {
    await route.fulfill({ status: 404, contentType: "application/json", body: "{}" });
  });

  await seedCartAndOpenCart(page);
  await clickCheckout(page);

  await expect(page.getByRole("heading", { name: "Checkout needs attention" })).toBeVisible();
  await expect(page.getByText("We could not verify your payment yet. Your cart is still saved.")).toBeVisible();
  await expect(page.evaluate(() => window.localStorage.getItem("astropop-crate"))).resolves.toBe(JSON.stringify(cartItems));
});

test("preserves the cart when the verified session does not match this browser", async ({ page }) => {
  const sessionId = "cs_e2e_expected";
  await configureCheckout(page, sessionId);
  await page.route("**/api/astro-pop/checkout/verify?*", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ sessionId: "cs_e2e_other", verified: true }),
    });
  });

  await seedCartAndOpenCart(page);
  await clickCheckout(page);

  await expect(page.getByText("We could not verify your payment yet. Your cart is still saved.")).toBeVisible();
  await expect(page.evaluate(() => window.localStorage.getItem("astropop-crate"))).resolves.toBe(JSON.stringify(cartItems));
});

test("confirms payment and preserves a cart changed after checkout started", async ({ page }) => {
  const sessionId = "cs_e2e_changed_cart";
  await configureCheckout(page, sessionId, "/astro-pop/cart?checkout=external");
  await page.route("**/api/astro-pop/checkout/verify?*", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ sessionId, verified: true }),
    });
  });

  await seedCartAndOpenCart(page);
  await clickCheckout(page);
  await page.getByRole("button", { name: "Increase Atomic Cherry Fizz quantity" }).click();
  await page.goto(`/astro-pop/checkout/success?session_id=${sessionId}`);

  await expect(page.getByRole("heading", { name: "Thank you for your order" })).toBeVisible();
  await expect(page.getByText("Payment confirmed. Your rocket crate is on its way!")).toBeVisible();
  await expect(page.getByText("Your cart changed while checkout was in progress, so the updated cart was preserved.")).toBeVisible();
  await expect(page.evaluate(() => window.localStorage.getItem("astropop-crate"))).resolves.toBe(
    JSON.stringify([{ flavorId: "atomic-cherry-fizz", quantity: 3 }]),
  );
});

test("revalidates a refreshed confirmation and preserves products added afterward", async ({ page }) => {
  const sessionId = "cs_e2e_refresh";
  await configureCheckout(page, sessionId);
  await page.route("**/api/astro-pop/checkout/verify?*", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ sessionId, verified: true }),
    });
  });

  await seedCartAndOpenCart(page);
  await clickCheckout(page);
  await expect(page.getByRole("heading", { name: "Thank you for your order" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Thank you for your order" })).toBeVisible();
  await expect(page.getByText("Your current cart was left untouched.")).toBeVisible();

  await page.goto("/astro-pop/cart");
  await page.evaluate(() => {
    window.localStorage.setItem(
      "astropop-crate",
      JSON.stringify([{ flavorId: "neptune-berry-fizz", quantity: 1 }]),
    );
  });
  await page.reload();
  await page.goto(`/astro-pop/checkout/success?session_id=${sessionId}`);

  await expect(page.getByRole("heading", { name: "Thank you for your order" })).toBeVisible();
  await expect(page.getByText("Your current cart was left untouched.")).toBeVisible();
  await expect(page.evaluate(() => window.localStorage.getItem("astropop-crate"))).resolves.toBe(
    JSON.stringify([{ flavorId: "neptune-berry-fizz", quantity: 1 }]),
  );
});

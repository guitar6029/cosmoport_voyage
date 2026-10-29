import { test as setup } from "@playwright/test";
import { clerkSetup } from "@clerk/testing/playwright";

setup.describe.configure({ mode: "serial" });
setup("obtain a Clerk Testing Token for the development instance", async () => {
  await clerkSetup();
});

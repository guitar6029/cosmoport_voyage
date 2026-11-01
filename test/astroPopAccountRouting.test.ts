import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { describe, expect, it } from "vitest";

const accountIndex = new URL("../app/pages/app/astro-pop/account/index.vue", import.meta.url);
const orderDetail = new URL("../app/pages/app/astro-pop/account/orders/[id].vue", import.meta.url);
const obsoleteParent = new URL("../app/pages/app/astro-pop/account.vue", import.meta.url);

describe("Astro Pop account file-based routes", () => {
  it("keeps order history and order details as sibling account routes", async () => {
    await expect(access(accountIndex, constants.R_OK)).resolves.toBeUndefined();
    await expect(access(orderDetail, constants.R_OK)).resolves.toBeUndefined();
    await expect(access(obsoleteParent, constants.F_OK)).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("protects both direct account route entries with the shared session middleware", async () => {
    const [historySource, detailSource] = await Promise.all([
      readFile(accountIndex, "utf8"),
      readFile(orderDetail, "utf8"),
    ]);

    expect(historySource).toContain('middleware: ["astro-pop-account-auth"]');
    expect(detailSource).toContain('middleware: ["astro-pop-account-auth"]');
  });
});

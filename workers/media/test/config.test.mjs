import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

function workerConfig() {
  const configPath = fileURLToPath(new URL("../wrangler.jsonc", import.meta.url));
  return JSON.parse(readFileSync(configPath, "utf8"));
}

describe("media Worker deployment safeguards", () => {
  it("explicitly enables approved production delivery while keeping Worker caching disabled", () => {
    const config = workerConfig();

    expect(config.vars?.MEDIA_DELIVERY_ENABLED).toBe("true");
    expect(config.cache).toEqual({ enabled: false });
  });

  it("does not publish a workers.dev, preview, route, or custom-domain endpoint", () => {
    const config = workerConfig();

    expect(config.workers_dev).toBe(false);
    expect(config.preview_urls).toBe(false);
    expect(config).not.toHaveProperty("route");
    expect(config).not.toHaveProperty("routes");
    expect(config).not.toHaveProperty("custom_domain");
    expect(config).not.toHaveProperty("custom_domains");
  });

  it("preserves the private media R2 binding", () => {
    expect(workerConfig().r2_buckets).toEqual([
      { binding: "MEDIA_BUCKET", bucket_name: "cosmos-universe-public-media" },
    ]);
  });
});

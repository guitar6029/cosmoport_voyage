import { describe, expect, it } from "vitest";

import worker from "../src/index";

function unusedEnv() {
  return new Proxy(
    {},
    {
      get(_target, property) {
        throw new Error(`Worker unexpectedly accessed binding: ${String(property)}`);
      },
    },
  ) as Parameters<typeof worker.fetch>[1];
}

async function dispatch(path: string, method = "GET") {
  return worker.fetch(new Request(`https://media.cosmos-universe.com${path}`, { method }), unusedEnv());
}

describe("media worker", () => {
  it("does not retrieve objects for GET requests", async () => {
    const response = await dispatch("/astro-pop/orange-cream.png");

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Not found");
  });

  it("returns a bodyless 404 for HEAD requests", async () => {
    const response = await dispatch("/astro-pop/orange-cream.png", "HEAD");

    expect(response.status).toBe(404);
    expect(response.body).toBeNull();
  });

  it.each(["POST", "PUT", "PATCH", "DELETE"])("rejects %s requests", async (method) => {
    const response = await dispatch("/astro-pop/orange-cream.png", method);

    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("GET, HEAD");
  });

  it("returns 404 for arbitrary paths without accessing R2", async () => {
    const response = await dispatch("/any/path?with=query");

    expect(response.status).toBe(404);
  });
});

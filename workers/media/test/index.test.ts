import { describe, expect, it, vi } from "vitest";

import worker from "../src/index";

const encoder = new TextEncoder();

function r2Object(key: string, value: string): R2ObjectBody {
  const bytes = encoder.encode(value);
  return {
    key, version: "v1", size: bytes.byteLength, etag: "etag", httpEtag: '"etag"',
    checksums: {} as R2Checksums, uploaded: new Date(), storageClass: "Standard",
    body: new ReadableStream({ start(controller) { controller.enqueue(bytes); controller.close(); } }),
    bodyUsed: false, arrayBuffer: async () => bytes.slice().buffer as ArrayBuffer, bytes: async () => bytes,
    text: async () => value, json: async <T>() => JSON.parse(value) as T,
    blob: async () => new Blob([bytes]), writeHttpMetadata: () => undefined,
  };
}

function enabledEnv(fixtures: Record<string, string> = {}) {
  const get = vi.fn(async (key: string, options?: R2GetOptions) => {
    const value = fixtures[key];
    if (value === undefined) return null;
    if (!options?.range || options.range instanceof Headers) return r2Object(key, value);
    const range = options.range as { offset: number; length: number };
    return r2Object(key, value.slice(range.offset, range.offset + range.length));
  });
  const head = vi.fn(async (key: string) => fixtures[key] === undefined ? null : r2Object(key, fixtures[key]));
  const bucket = { get, head, put: vi.fn(), delete: vi.fn(), list: vi.fn() } as unknown as R2Bucket;
  return { env: { MEDIA_BUCKET: bucket, MEDIA_DELIVERY_ENABLED: "true" }, get, head, bucket };
}

async function dispatch(path: string, env: Parameters<typeof worker.fetch>[1], init?: RequestInit) {
  return worker.fetch(new Request(`https://media.cosmos-universe.com${path}`, init), env);
}

describe("media worker", () => {
  it("keeps delivery disabled by default without accessing R2", async () => {
    const bucket = new Proxy({}, { get: () => { throw new Error("R2 should not be accessed"); } }) as R2Bucket;
    const response = await dispatch("/astro-pop/orange-cream.png", { MEDIA_BUCKET: bucket });

    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("gets allowed media with safe headers and ignores query parameters", async () => {
    const { env, get } = enabledEnv({ "astro-pop/testimonials/walter.mp4": "0123456789" });
    const response = await dispatch("/astro-pop/testimonials/walter.mp4?irrelevant=yes", env);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("0123456789");
    expect(get).toHaveBeenCalledWith("astro-pop/testimonials/walter.mp4");
    expect(response.headers.get("Content-Type")).toBe("video/mp4");
    expect(response.headers.get("Content-Length")).toBe("10");
    expect(response.headers.get("ETag")).toBe('"etag"');
    expect(response.headers.get("Accept-Ranges")).toBe("bytes");
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("uses metadata only for HEAD", async () => {
    const { env, get, head } = enabledEnv({ "astro-pop/sound.mp3": "audio" });
    const response = await dispatch("/astro-pop/sound.mp3", env, { method: "HEAD" });

    expect(response.status).toBe(200);
    expect(response.body).toBeNull();
    expect(response.headers.get("Content-Type")).toBe("audio/mpeg");
    expect(head).toHaveBeenCalledWith("astro-pop/sound.mp3");
    expect(get).not.toHaveBeenCalled();
  });

  it.each(["/", "/astro-pop/../secret.mp4", "/astro-pop/%2e%2e/secret.mp4", "/astro-pop/%2Fsecret.mp4", "/astro-pop/%00.mp4", "/astro-pop/bad%zz.mp4"])("rejects unsafe path %s before R2 access", async (path) => {
    const { env, get, head } = enabledEnv();
    const response = await dispatch(path, env);
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
    expect(get).not.toHaveBeenCalled();
    expect(head).not.toHaveBeenCalled();
  });

  it.each(["/outside/object.mp4", "/astro-pop/script.js", "/astro-pop/document.html"])("hides unsupported path %s without R2 access", async (path) => {
    const { env, get, head } = enabledEnv();
    expect((await dispatch(path, env)).status).toBe(404);
    expect(get).not.toHaveBeenCalled();
    expect(head).not.toHaveBeenCalled();
  });

  it.each(["POST", "PUT", "PATCH", "DELETE"])("rejects %s requests", async (method) => {
    const { env } = enabledEnv();
    const response = await dispatch("/astro-pop/orange-cream.png", env, { method });
    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("GET, HEAD");
  });

  it("serves a single byte range through R2 ranged reads", async () => {
    const { env, get, head } = enabledEnv({ "astro-pop/testimonials/walter.mp4": "0123456789" });
    const response = await dispatch("/astro-pop/testimonials/walter.mp4", env, { headers: { Range: "bytes=2-5" } });
    expect(response.status).toBe(206);
    expect(await response.text()).toBe("2345");
    expect(response.headers.get("Content-Range")).toBe("bytes 2-5/10");
    expect(response.headers.get("Content-Length")).toBe("4");
    expect(head).toHaveBeenCalledWith("astro-pop/testimonials/walter.mp4");
    expect(get).toHaveBeenCalledWith("astro-pop/testimonials/walter.mp4", { range: { offset: 2, length: 4 } });
  });

  it.each([["bytes=7-", "789"], ["bytes=-3", "789"]])("supports %s ranges", async (range, expected) => {
    const { env } = enabledEnv({ "astro-pop/testimonials/walter.mp4": "0123456789" });
    const response = await dispatch("/astro-pop/testimonials/walter.mp4", env, { headers: { Range: range } });
    expect(response.status).toBe(206);
    expect(await response.text()).toBe(expected);
  });

  it.each(["bytes=10-", "bytes=4-2", "bytes=0-1,4-5", "items=0-1"])("rejects unsupported range %s", async (range) => {
    const { env, get } = enabledEnv({ "astro-pop/testimonials/walter.mp4": "0123456789" });
    const response = await dispatch("/astro-pop/testimonials/walter.mp4", env, { headers: { Range: range } });
    expect(response.status).toBe(416);
    expect(response.headers.get("Content-Range")).toBe("bytes */10");
    expect(get).not.toHaveBeenCalled();
  });

  it("hides R2 failures and never writes, deletes, or lists", async () => {
    const { env, get, bucket } = enabledEnv({ "astro-pop/image.png": "image" });
    get.mockRejectedValueOnce(new Error("internal storage error"));
    const response = await dispatch("/astro-pop/image.png", env);

    expect(response.status).toBe(502);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.text()).toBe("Media delivery failed");
    expect((bucket.put as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(0);
    expect((bucket.delete as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(0);
    expect((bucket.list as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(0);
  });
});

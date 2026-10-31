import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  enabled: vi.fn(),
  routeParam: vi.fn(),
  header: vi.fn(),
}));
vi.mock("h3", () => ({
  defineEventHandler: <T>(fn: T) => fn,
  getRouterParam: (...args: unknown[]) => mocks.routeParam(...args),
  setResponseHeader: (...args: unknown[]) => mocks.header(...args),
  createError: (args: { statusCode: number; statusMessage: string }) =>
    Object.assign(new Error(args.statusMessage), args),
}));
vi.mock("../server/utils/cosmoportCoreDatabase", () => ({
  getCosmoportAppEnabled: (...args: unknown[]) => mocks.enabled(...args),
}));

describe("Public app availability endpoint", () => {
  let handler: (event: object) => Promise<{ enabled: boolean | null }>;
  beforeAll(async () => {
    handler = (await import("../server/api/apps/[id]/access.get")).default as typeof handler;
  });
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.routeParam.mockReturnValue("cosmoport-voyage");
  });

  it.each([true, false, null])("preserves the actual DB result %s", async (value) => {
    mocks.enabled.mockResolvedValue(value);
    await expect(handler({})).resolves.toEqual({ enabled: value });
    expect(mocks.enabled).toHaveBeenCalledWith("cosmoport-voyage");
    expect(mocks.header).toHaveBeenCalledWith(expect.anything(), "Cache-Control", "no-store");
  });

  it.each(["", "../admin", "INVALID", "bad_id", "a".repeat(65)])("rejects malformed app IDs", async (id) => {
    mocks.routeParam.mockReturnValue(id);
    await expect(handler({})).rejects.toMatchObject({ statusCode: 400 });
    expect(mocks.enabled).not.toHaveBeenCalled();
  });

  it("returns a safe 503 when Neon is unavailable", async () => {
    mocks.enabled.mockRejectedValue(new Error("Private database details"));
    await expect(handler({})).rejects.toMatchObject({ statusCode: 503 });
  });
});

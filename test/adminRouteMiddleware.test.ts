import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const checkAccess = vi.fn<(path: string) => Promise<{ authorized: boolean }>>();
const redirect = vi.fn((path: string) => ({ redirectTo: path }));

vi.stubGlobal("defineNuxtRouteMiddleware", (middleware: unknown) => middleware);
vi.stubGlobal("useRequestFetch", () => checkAccess);
vi.stubGlobal("navigateTo", redirect);

describe("Admin Dashboard route middleware", () => {
  let guard: () => Promise<unknown>;

  beforeAll(async () => {
    guard = (await import("../app/middleware/admin")).default as () => Promise<unknown>;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows a user authorized by the server", async () => {
    checkAccess.mockResolvedValue({ authorized: true });

    await expect(guard()).resolves.toBeUndefined();
    expect(checkAccess).toHaveBeenCalledExactlyOnceWith("/api/admin/access");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects when the server returns authorized: false", async () => {
    checkAccess.mockResolvedValue({ authorized: false });

    await expect(guard()).resolves.toEqual({ redirectTo: "/" });
    expect(redirect).toHaveBeenCalledExactlyOnceWith("/");
  });

  it.each([
    ["signed-out / 401", 401],
    ["ordinary user / 403", 403],
    ["Clerk unavailable / 503", 503],
  ])("redirects when access is denied: %s", async (_scenario, statusCode) => {
    checkAccess.mockRejectedValue({ statusCode });

    await expect(guard()).resolves.toEqual({ redirectTo: "/" });
    expect(checkAccess).toHaveBeenCalledExactlyOnceWith("/api/admin/access");
    expect(redirect).toHaveBeenCalledExactlyOnceWith("/");
  });

  it("redirects when the authorization request fails unexpectedly", async () => {
    checkAccess.mockRejectedValue(new Error("Network unavailable"));

    await expect(guard()).resolves.toEqual({ redirectTo: "/" });
    expect(redirect).toHaveBeenCalledExactlyOnceWith("/");
  });
});

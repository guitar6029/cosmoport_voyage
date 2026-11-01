import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  orders: vi.fn(),
}));

vi.mock("nuxt/server", () => ({
  defineEventHandler: <T>(handler: T) => handler,
  createError: ({ status, statusText }: { status: number; statusText: string }) =>
    Object.assign(new Error(statusText), { statusCode: status }),
}));
vi.mock("../server/utils/getClerkAuth", () => ({
  getClerkAuth: mocks.auth,
}));
vi.mock("../server/utils/astroPopDatabase", () => ({
  getAstroPopOrdersByUser: mocks.orders,
}));

type Event = { res: { headers: Headers }; context: Record<string, unknown> };
type Handler = (event: Event) => Promise<unknown>;

describe("Astro Pop account orders endpoint", () => {
  let handler: Handler;
  beforeAll(async () => {
    handler = (await import("../server/api/astro-pop/account/orders.get")).default as Handler;
  });
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.mockReturnValue({ isAuthenticated: false, userId: null });
    mocks.orders.mockResolvedValue([]);
  });
  const event = (): Event => ({ res: { headers: new Headers() }, context: {} });

  it("rejects unauthenticated requests without reading orders", async () => {
    const request = event();
    await expect(handler(request)).rejects.toMatchObject({ statusCode: 401 });
    expect(mocks.orders).not.toHaveBeenCalled();
    expect(request.res.headers.get("Cache-Control")).toBe("private, no-store");
  });
  it("does not accept an empty authenticated ID", async () => {
    mocks.auth.mockReturnValue({ isAuthenticated: true, userId: "  " });
    await expect(handler(event())).rejects.toMatchObject({ statusCode: 401 });
    expect(mocks.orders).not.toHaveBeenCalled();
  });
  it("passes only the server-verified Clerk ID to the database", async () => {
    const history = [{ id: "order-1", items: [] }];
    mocks.auth.mockReturnValue({ isAuthenticated: true, userId: "user_owner" });
    mocks.orders.mockResolvedValue(history);
    await expect(handler(event())).resolves.toEqual(history);
    expect(mocks.orders).toHaveBeenCalledExactlyOnceWith("user_owner");
  });
  it("returns an empty collection for authenticated users with no orders", async () => {
    mocks.auth.mockReturnValue({ isAuthenticated: true, userId: "user_empty" });
    await expect(handler(event())).resolves.toEqual([]);
  });
});

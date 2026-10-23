import { beforeEach, describe, expect, it, vi } from "vitest";

const neonMock = vi.hoisted(() => vi.fn());

vi.mock("@neondatabase/serverless", () => ({
  neon: neonMock,
}));

import {
  AstroPopDatabaseConfigurationError,
  getAstroPopDatabaseHealth,
} from "../server/utils/astroPopDatabase";

describe("Astro Pop database health", () => {
  beforeEach(() => {
    neonMock.mockReset();
    vi.unstubAllEnvs();
  });

  it("returns ok after a successful read-only connection query", async () => {
    const sql = vi.fn().mockResolvedValue([{ connected: 1 }]);
    neonMock.mockReturnValue(sql);
    vi.stubEnv("ASTROPOP_POOLED_URL", "postgresql://test.example/astro_pop");

    await expect(getAstroPopDatabaseHealth()).resolves.toEqual({ status: "ok" });
    expect(neonMock).toHaveBeenCalledWith("postgresql://test.example/astro_pop");
    expect(sql).toHaveBeenCalledOnce();
    expect(sql.mock.calls[0]?.[0].raw).toEqual(["SELECT 1 AS connected"]);
  });

  it("fails without a configured pooled connection string", async () => {
    vi.stubEnv("ASTROPOP_POOLED_URL", "");

    await expect(getAstroPopDatabaseHealth()).rejects.toBeInstanceOf(
      AstroPopDatabaseConfigurationError,
    );
    expect(neonMock).not.toHaveBeenCalled();
  });

  it("propagates database failures for the endpoint to sanitize", async () => {
    const databaseError = new Error("connection refused");
    neonMock.mockReturnValue(vi.fn().mockRejectedValue(databaseError));
    vi.stubEnv("ASTROPOP_POOLED_URL", "postgresql://test.example/astro_pop");

    await expect(getAstroPopDatabaseHealth()).rejects.toBe(databaseError);
  });
});

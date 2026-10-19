import { describe, expect, it } from "vitest";
import { SITE_DESCRIPTION, SITE_TITLE } from "../app/site";

describe("site metadata", () => {
  it("defines the public site identity", () => {
    expect(SITE_TITLE).toBe("CosmoPort Voyage");
    expect(SITE_DESCRIPTION).toContain("retrofuturistic space-travel");
  });
});

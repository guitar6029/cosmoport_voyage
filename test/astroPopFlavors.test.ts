import { describe, expect, it } from "vitest";
import { ASTROPOP_FLAVORS } from "../app/data/astroPopFlavors";

describe("AstroPop flavor lineup", () => {
  it("defines four complete, uniquely identified flavors", () => {
    expect(ASTROPOP_FLAVORS).toHaveLength(4);
    expect(new Set(ASTROPOP_FLAVORS.map((flavor) => flavor.id)).size).toBe(4);

    for (const flavor of ASTROPOP_FLAVORS) {
      expect(flavor.name).toBeTruthy();
      expect(flavor.description).toBeTruthy();
      expect(flavor.slogan).toBeTruthy();
      expect(flavor.theme).toBeTruthy();
      expect(flavor.artwork.label).toBeTruthy();
      expect(flavor.artwork.pose).toBeTruthy();
    }
  });
});

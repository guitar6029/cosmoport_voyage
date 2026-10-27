import { describe, expect, it } from "vitest";
import { ASTROPOP_FLAVORS } from "../app/data/astroPopFlavors";
import { ASTRO_POP_MEDIA, ASTRO_POP_MEDIA_BASE_URL } from "../app/data/astroPopMedia";

const flattenUrls = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (value && typeof value === "object") return Object.values(value).flatMap(flattenUrls);
  return [];
};

describe("Astro Pop CDN media mapping", () => {
  it("uses only well-formed CDN URLs for current Astro Pop media", () => {
    const urls = flattenUrls(ASTRO_POP_MEDIA);

    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      expect(url).toMatch(new RegExp(`^${ASTRO_POP_MEDIA_BASE_URL}/[a-z0-9_./-]+$`));
      expect(url).not.toContain("%");
      expect(url).not.toContain("//astro-pop");
    }
  });

  it("uses verified CDN flavor art in the catalog", () => {
    for (const flavor of ASTROPOP_FLAVORS) {
      expect(flavor.bottleImage).toMatch(new RegExp(`^${ASTRO_POP_MEDIA_BASE_URL}/drinks/`));
      expect(flavor.artwork.src).toMatch(new RegExp(`^${ASTRO_POP_MEDIA_BASE_URL}/drinks/`));
    }
  });

  it("maps the navigation, delivery, story, and testimonial media", () => {
    expect(ASTRO_POP_MEDIA.cartCrate).toContain("/cart/");
    expect(Object.values(ASTRO_POP_MEDIA.deliveryCrates)).toHaveLength(3);
    expect(Object.values(ASTRO_POP_MEDIA.story)).toHaveLength(4);
    expect(ASTRO_POP_MEDIA.testimonials.dorothy.video).toMatch(/dorothy-miller\.mp4$/);
    expect(ASTRO_POP_MEDIA.testimonials.walter.video).toMatch(/walter-peterson\.mp4$/);
    expect(ASTRO_POP_MEDIA.testimonials.grandpaHenry.video).toMatch(/grandpa-henry\.mp4$/);
  });
});

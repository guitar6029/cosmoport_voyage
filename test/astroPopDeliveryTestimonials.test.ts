import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { describe, expect, it } from "vitest";
import AstroPopDeliveryTestimonialsSection from "../app/components/AstroPopDeliveryTestimonialsSection.vue";

const renderSection = () =>
  renderToString(createSSRApp({ render: () => h(AstroPopDeliveryTestimonialsSection) }));

describe("AstroPop neighborhood testimonials", () => {
  it("renders a named section with its headline and supporting copy", async () => {
    const html = await renderSection();

    expect(html).toContain('aria-labelledby="astropop-testimonials-title"');
    expect(html).toMatch(/<h2[^>]*id="astropop-testimonials-title"[^>]*>The Neighborhood Is Talking!<\/h2>/);
    expect(html).toContain("GOOD NEWS TRAVELS FAST!");
    expect(html).toContain("Everybody&#39;s buzzing about AstroPop!");
    expect(html.match(/<figure\b/g)).toHaveLength(3);
    expect(html.match(/<blockquote\b/g)).toHaveLength(3);
    expect(html.match(/<figcaption\b/g)).toHaveLength(3);
  });

  it.each([
    [
      "Dorothy Miller",
      "/images/astro-pop/testimonials/AstroPop%20Soda%20Housewife%20Portrait.png",
      "Dorothy Miller holding a bottle of AstroPop soda",
    ],
    [
      "Walter Peterson",
      "/images/astro-pop/testimonials/Retro%20AstroPop%20Golf%20Advertisement.png",
      "Walter Peterson holding an AstroPop bottle with a golf club over his shoulder",
    ],
    [
      "Grandpa Henry",
      "/images/astro-pop/testimonials/Grandpa%E2%80%99s%20AstroPop%20Soda%20Endorsement.png",
      "Grandpa Henry pointing to his bottle of AstroPop soda",
    ],
  ])("places %s's accessible portrait above the quote", async (name, source, alt) => {
    const html = await renderSection();
    const figures = html.match(/<figure\b[\s\S]*?<\/figure>/g) ?? [];
    const figure = figures.find((markup) => markup.includes(name));

    expect(figure).toBeDefined();
    expect(figure).toContain(`src="${source}"`);
    expect(figure).toContain(`alt="${alt}"`);
    expect(figure).toContain('loading="lazy"');
    expect(figure).toContain('decoding="async"');
    expect(figure!.indexOf("<img")).toBeLessThan(figure!.indexOf("<blockquote"));
  });

  it.each([
    [
      "Dorothy Miller",
      "Mother of Three",
      "Three hungry youngsters, a busy household, and somehow Bobby Bubbles always arrives right on time!",
    ],
    [
      "Walter Peterson",
      "Weekend Golfer",
      "Eighteen holes on the course, twelve bottles on the porch. Now that's what I call a perfect Sunday!",
    ],
    [
      "Grandpa Henry",
      "Proud AstroPop Customer",
      "In my day, the milkman brought milk. Now a fellow brings fizzy drinks from the future. What a marvelous century!",
    ],
  ])("preserves %s's exact quote and attribution", async (name, role, quote) => {
    const html = await renderSection();
    const figures = html.match(/<figure\b[\s\S]*?<\/figure>/g) ?? [];
    const figure = figures.find((markup) => markup.includes(name));

    expect(figure).toBeDefined();
    const quoteText = figure?.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/)?.[1]
      .replace(/<[^>]*>/g, "")
      .replaceAll("&#39;", "'");
    const captionText = figure?.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/)?.[1]
      .replace(/<[^>]*>/g, "");

    expect(quoteText).toBe(`“${quote}”`);
    expect(captionText).toBe(`${name}${role}`);
  });
});

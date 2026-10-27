import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { describe, expect, it } from "vitest";
import AstroPopDeliveryPlansSection from "../app/components/astro-pop/AstroPopDeliveryPlansSection.vue";
import { ASTRO_POP_MEDIA } from "../app/data/astroPopMedia";

describe("AstroPop delivery plans section", () => {
  it("renders its heading and supporting copy", async () => {
    const html = await renderToString(
      createSSRApp({ render: () => h(AstroPopDeliveryPlansSection) }),
    );

    expect(html).toContain('id="astropop-delivery-plans"');
    expect(html).toContain("The Astro Delivery Plans");
    expect(html).toContain("As much AstroPop as your heart desires!");
  });

  it("renders all three delivery plans and features the neighborhood favorite", async () => {
    const html = await renderToString(
      createSSRApp({ render: () => h(AstroPopDeliveryPlansSection) }),
    );

    expect(html).toContain("Porch Pack");
    expect(html).toContain("6 bottles");
    expect(html).toContain("35¢ per delivery");
    expect(html).toContain("Family Fizz Crate");
    expect(html).toContain("12 bottles");
    expect(html).toContain("65¢ per delivery");
    expect(html).toContain("Neighborhood Favorite");
    expect(html).toContain("Rocket Reserve");
    expect(html).toContain("24 bottles");
    expect(html).toContain("$1.19 per delivery");
  });

  it("pairs each plan with accessible crate artwork before its plan details", async () => {
    const html = await renderToString(
      createSSRApp({ render: () => h(AstroPopDeliveryPlansSection) }),
    );
    const cards = html.match(/<article\b[\s\S]*?<\/article>/g) ?? [];
    const plans = [
      { name: "Porch Pack", bottles: "6 bottles", size: "small", width: 585 },
      { name: "Family Fizz Crate", bottles: "12 bottles", size: "medium", width: 655 },
      { name: "Rocket Reserve", bottles: "24 bottles", size: "large", width: 808 },
    ];

    expect(cards).toHaveLength(3);
    expect(html).not.toMatch(/artwork arriving from tomorrow/i);

    for (const [index, plan] of plans.entries()) {
      const card = cards[index]!;
      const src = ASTRO_POP_MEDIA.deliveryCrates[plan.size];
      expect(card.match(/<img\b/g)).toHaveLength(1);
      expect(card).toContain(`src="${src}"`);
      expect(card).toContain(`alt="${plan.name} wooden AstroPop soda crate with ${plan.bottles}"`);
      expect(card).not.toContain('aria-hidden="true"');
      expect(card.indexOf("<img")).toBeLessThan(card.indexOf("<h3"));
      expect(card.indexOf("<h3")).toBeLessThan(card.indexOf('__bottles"'));
      expect(card.indexOf('__bottles"')).toBeLessThan(card.indexOf('__price"'));
      expect(card.indexOf('__price"')).toBeLessThan(card.indexOf('__description"'));
      expect(card.includes("Neighborhood Favorite")).toBe(index === 1);

      expect(card).toContain(`width="${plan.width}" height="768"`);
    }
  });
});

import { existsSync } from "node:fs";
import { createPinia } from "pinia";
import { createSSRApp, defineComponent, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { describe, expect, it } from "vitest";
import AstroPopFooter from "../app/components/astro-pop/AstroPopFooter.vue";
import AstroPopPage from "../app/pages/astro-pop.vue";

const NuxtLink = defineComponent({
  props: { to: { type: String, required: true } },
  setup: (props, { slots }) => () => h("a", { href: props.to }, slots.default?.()),
});

const renderFooter = () => {
  const app = createSSRApp(AstroPopFooter);
  app.component("NuxtLink", NuxtLink);
  return renderToString(app);
};

const renderPage = () => {
  const app = createSSRApp(AstroPopPage);
  app.use(createPinia());
  app.component("NuxtLink", NuxtLink);
  return renderToString(app);
};

describe("AstroPop footer", () => {
  it("renders a named footer with the requested closing copy", async () => {
    const html = await renderFooter();

    expect(html).toMatch(/<footer\b[^>]*aria-labelledby="astropop-footer-title"/);
    expect(html).toMatch(/<h2[^>]*id="astropop-footer-title"[^>]*>Stay Fizzy, Folks!<\/h2>/);
    expect(html).toContain("A LITTLE SPARKLE IN EVERY BOTTLE");
    expect(html).toContain("AstroPop Soda Co. — Bringing Tomorrow to Your Doorstep!");
    expect(html).toContain("AstroPop Soda Co. · A proud member of the Cosmoport Universe");
  });

  it("organizes all seven native links into two named navigation landmarks", async () => {
    const html = await renderFooter();
    const groups = html.match(/<nav\b[\s\S]*?<\/nav>/g) ?? [];

    expect(groups).toHaveLength(2);
    const expectedGroups = [
      {
        id: "astropop-footer-explore-title",
        title: "Explore AstroPop",
        links: [
          ["#astropop-flavors-title", "Our Marvelous Flavors"],
          ["#pack-your-pop-title", "Pack Your Pop"],
          ["#astropop-delivery-plans", "Delivery Plans"],
          ["#astropop-delivery-testimonials", "Happy Neighbors"],
        ],
      },
      {
        id: "astropop-footer-universe-title",
        title: "The Cosmoport Universe",
        links: [
          ["/", "Universe Directory"],
          ["/cosmoport-voyage", "Cosmoport Voyage"],
          ["#astropop-title", "Back to Top"],
        ],
      },
    ];

    expectedGroups.forEach(({ id, title, links }, index) => {
      expect(groups[index]).toContain(`aria-labelledby="${id}"`);
      expect(groups[index]).toMatch(new RegExp(`<h3[^>]*id="${id}"[^>]*>${title}</h3>`));
      const renderedLinks = [...groups[index]!.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g)]
        .map(([, href, label]) => [href, label]);
      expect(renderedLinks).toEqual(links);
    });
    expect(html).not.toMatch(/tabindex|aria-disabled/);
  });

  it("follows the testimonials outside main and resolves every fragment to a unique page target", async () => {
    const html = await renderPage();
    const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0];

    expect(main).toBeDefined();
    expect(main).toContain('id="astropop-delivery-testimonials"');
    expect(main).not.toContain("<footer");
    expect(html.match(/<footer\b/g)).toHaveLength(1);
    expect(html).toMatch(/<\/main>\s*<footer\b/);

    const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)![0];
    const fragments = [...footer.matchAll(/href="#([^"]+)"/g)].map(([, id]) => id);
    expect(fragments).toHaveLength(5);
    for (const id of fragments) {
      expect([...html.matchAll(new RegExp(`\\bid="${id}"`, "g"))]).toHaveLength(1);
      expect(main).toContain(`id="${id}"`);
    }
    for (const page of ["index", "cosmoport-voyage"]) {
      expect(existsSync(new URL(`../app/pages/${page}.vue`, import.meta.url))).toBe(true);
    }
  });
});

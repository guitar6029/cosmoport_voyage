import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ASTROPOP_FLAVORS } from "../app/data/astroPopFlavors";
import AstroPopFlavorDetailPage from "../app/pages/astro-pop/flavors/[slug].vue";

const route = { params: { slug: "" } };
const useHead = vi.fn();

vi.stubGlobal("useRoute", () => route);
vi.stubGlobal("useHead", useHead);
vi.stubGlobal("createError", (options: { statusCode: number; statusMessage: string }) => options);

const renderPage = () =>
  renderToString(
    createSSRApp({
      render: () => h(AstroPopFlavorDetailPage),
    }).component("NuxtLink", {
      props: { to: { type: String, required: true } },
      template: '<a :href="to"><slot /></a>',
    }),
  );

describe("AstroPop flavor detail page", () => {
  beforeEach(() => {
    useHead.mockClear();
  });

  it.each(ASTROPOP_FLAVORS)("resolves $name and displays its flavor name", async (flavor) => {
    route.params.slug = flavor.id;

    const html = await renderPage();

    expect(html).toContain(`<h1>${flavor.name}</h1>`);
    expect(useHead).toHaveBeenCalledWith({ title: `${flavor.name} | AstroPop Soda Co.` });
  });

  it("returns a 404 error for an unknown flavor slug", async () => {
    route.params.slug = "unknown-flavor";

    await expect(renderPage()).rejects.toMatchObject({
      statusCode: 404,
      statusMessage: "AstroPop flavor not found",
    });
  });
});

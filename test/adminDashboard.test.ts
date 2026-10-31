import { createSSRApp, defineComponent, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminLayout from "../app/layouts/admin.vue";
import AdminDashboardPage from "../app/pages/admin.vue";

const pageMeta = vi.fn();
vi.stubGlobal("definePageMeta", pageMeta);

const NuxtLink = defineComponent({
  props: { to: { type: String, required: true } },
  setup: (props, { slots }) => () => h("a", { href: props.to }, slots.default?.()),
});

async function renderDashboard() {
  const app = createSSRApp({
    render: () => h(AdminLayout, null, { default: () => h(AdminDashboardPage) }),
  });
  app.component("NuxtLink", NuxtLink);
  return renderToString(app);
}

describe("Admin Dashboard page and layout", () => {
  beforeEach(() => {
    pageMeta.mockClear();
  });

  it("registers the protected admin layout and middleware", async () => {
    await renderDashboard();

    expect(pageMeta).toHaveBeenCalledWith({
      layout: "admin",
      middleware: "admin",
    });
  });

  it("renders the sidebar navigation and page content in the layout slot", async () => {
    const html = await renderDashboard();

    expect(html).toContain('class="admin-layout"');
    expect(html).toContain('aria-label="Admin navigation"');
    expect(html).toContain('href="/admin"');
    expect(html).toContain('href="/"');
    expect(html).toContain("Back to Universe");
    expect(html).toContain('id="admin-dashboard-title"');
    expect(html).toContain("App management is coming next.");
  });

  it("keeps the navigation in a centered column and handles narrow viewports", async () => {
    const source = await readFile(resolve(process.cwd(), "app/layouts/admin.vue"), "utf8");

    expect(source).toMatch(/\.admin-sidebar__nav\s*\{[^}]*flex-direction:\s*column;[^}]*align-items:\s*center;[^}]*justify-content:\s*center;/s);
    expect(source).toContain("@media (max-width: 640px)");
    expect(source).toContain(":focus-visible");
  });

  it("wraps pages with NuxtLayout so named layouts actually render", async () => {
    const appShell = await readFile(resolve(process.cwd(), "app/app.vue"), "utf8");

    expect(appShell).toMatch(/<NuxtLayout>[\s\S]*<NuxtPage\s*\/>[\s\S]*<\/NuxtLayout>/);
  });
});

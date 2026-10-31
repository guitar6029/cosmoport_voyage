// @vitest-environment jsdom
import { createApp, h, nextTick, ref } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Toggle from "../app/components/admin/CosmoportAppToggleActive.vue";

const fetchMock = vi.fn();
vi.stubGlobal("$fetch", fetchMock);

const updated = {
  id: "astro-pop",
  title: "Astro Pop Soda Co.",
  description: "Soda",
  enabled: false,
};

function mount() {
  const enabled = ref(true);
  const onUpdated = vi.fn((app: typeof updated) => { enabled.value = app.enabled; });
  const element = document.createElement("div");
  const app = createApp({
    render: () => h(Toggle, {
      appId: "astro-pop",
      appTitle: "Astro Pop Soda Co.",
      enabled: enabled.value,
      onUpdated,
    }),
  });
  document.body.appendChild(element);
  app.mount(element);
  return { element, app, enabled, onUpdated, checkbox: element.querySelector<HTMLInputElement>("input")! };
}

async function flush() {
  await Promise.resolve();
  await Promise.resolve();
  await nextTick();
}

describe("Admin app toggle", () => {
  beforeEach(() => fetchMock.mockReset());
  afterEach(() => document.body.replaceChildren());

  it("PATCHes the inverse status, emits the saved row, and updates checked state", async () => {
    fetchMock.mockResolvedValue({ app: updated });
    const view = mount();
    expect(view.checkbox.checked).toBe(true);
    expect(view.checkbox.getAttribute("aria-label")).toBe("Enable Astro Pop Soda Co.");
    view.checkbox.click();
    await flush();
    expect(fetchMock).toHaveBeenCalledWith("/api/admin/apps/astro-pop", {
      method: "PATCH", body: { enabled: false },
    });
    expect(view.onUpdated).toHaveBeenCalledWith(updated);
    expect(view.checkbox.checked).toBe(false);
    view.app.unmount();
  });

  it("blocks concurrent writes while the request is pending", async () => {
    let resolve!: (value: unknown) => void;
    fetchMock.mockReturnValue(new Promise((done) => { resolve = done; }));
    const view = mount();
    view.checkbox.click();
    await nextTick();
    expect(view.checkbox.disabled).toBe(true);
    expect(view.element.textContent).toContain("Saving");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    resolve({ app: updated });
    await flush();
    expect(view.checkbox.disabled).toBe(false);
    view.app.unmount();
  });

  it("rolls back the native checkbox and reports a safe error when PATCH fails", async () => {
    fetchMock.mockRejectedValue(new Error("Sensitive upstream details"));
    const view = mount();
    view.checkbox.click();
    await flush();
    expect(view.checkbox.checked).toBe(true);
    expect(view.onUpdated).not.toHaveBeenCalled();
    expect(view.element.querySelector('[role="alert"]')?.textContent).toContain("Unable to update");
    expect(view.element.textContent).not.toContain("Sensitive upstream details");
    view.app.unmount();
  });
});

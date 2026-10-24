// @vitest-environment jsdom
import { createApp, nextTick, ref, type Ref } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AstroPopNotification } from "../app/composables/astro-pop/useAstroPopNotifications";

let notificationState: Ref<AstroPopNotification[]>;
let nextId = 0;

beforeEach(() => {
  vi.useFakeTimers();
  vi.resetModules();
  notificationState = ref([]);
  nextId = 0;
  vi.stubGlobal("useState", <T>() => notificationState as Ref<T>);
  vi.stubGlobal("crypto", {
    randomUUID: () => `notification-${++nextId}`,
  });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("AstroPop notifications", () => {
  it("renders each notification asset and stacks multiple notifications", async () => {
    const { useAstroPopNotifications } = await import("../app/composables/astro-pop/useAstroPopNotifications");
    const AstroPopNotificationContainer = (await import("../app/components/astro-pop/AstroPopNotificationContainer.vue")).default;
    const notifications = useAstroPopNotifications();
    const container = document.createElement("div");
    const app = createApp(AstroPopNotificationContainer);

    document.body.appendChild(container);
    app.mount(container);
    notifications.show("success", 0);
    notifications.show("error", 0);
    notifications.show("info", 0);
    await nextTick();

    expect(container.querySelectorAll(".astro-pop-notification")).toHaveLength(3);
    expect(container.innerHTML).toContain("astro-pop-toast-success.png");
    expect(container.innerHTML).toContain("astro-pop-toast-error.png");
    expect(container.innerHTML).toContain("astro-pop-toast-info.png");
    expect(container.firstElementChild?.className).toContain("pointer-events-none");

    app.unmount();
    container.remove();
  });

  it("auto-dismisses each notification independently and clears dismissed timers", async () => {
    const { useAstroPopNotifications } = await import("../app/composables/astro-pop/useAstroPopNotifications");
    const notifications = useAstroPopNotifications();
    const successId = notifications.show("success", 800);
    const errorId = notifications.show("error", 1200);

    expect(notifications.notifications.value).toEqual([
      { id: successId, type: "success" },
      { id: errorId, type: "error" },
    ]);

    vi.advanceTimersByTime(800);
    expect(notifications.notifications.value).toEqual([
      { id: errorId, type: "error" },
    ]);

    notifications.dismiss(errorId!);
    vi.advanceTimersByTime(1200);
    expect(notifications.notifications.value).toEqual([]);
  });
});

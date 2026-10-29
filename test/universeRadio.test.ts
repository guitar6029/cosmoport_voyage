// @vitest-environment jsdom
import { createApp, nextTick } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import UniverseRadioControl from "../app/components/universe/UniverseRadioControl.vue";
import { UNIVERSE_MEDIA } from "../app/data/universeMedia";

class FakeAudio {
  loop = false;
  preload = "";
  volume = 1;
  muted = false;
  currentTime = 0;
  pause = vi.fn();
  play = vi.fn().mockResolvedValue(undefined);
  addEventListener = vi.fn();
  constructor(readonly src: string) {}
}

describe("CosmoPort Radio", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.resetModules();
    document.body.replaceChildren();
  });

  it("uses the verified, centralized Grand Concourse MP3 URL", () => {
    expect(UNIVERSE_MEDIA.interplanetaryLounge).toBe("https://media.cosmos-universe.com/sounds/grand-concourse/interplanetary-lounge.mp3");
  });

  it("does not construct or play audio until a visitor presses Play", async () => {
    const audioConstructor = vi.fn((src: string) => new FakeAudio(src));
    vi.stubGlobal("Audio", audioConstructor);
    const { useUniverseRadio } = await import("../app/composables/useUniverseRadio");
    const radio = useUniverseRadio();

    expect(audioConstructor).not.toHaveBeenCalled();
    await radio.play();

    const player = audioConstructor.mock.results[0]?.value as FakeAudio;
    expect(player.src).toBe(UNIVERSE_MEDIA.interplanetaryLounge);
    expect(player.loop).toBe(true);
    expect(player.play).toHaveBeenCalledOnce();
  });

  it("updates volume immediately, preserves it through mute, and stops for a mini-app", async () => {
    const audioConstructor = vi.fn((src: string) => new FakeAudio(src));
    vi.stubGlobal("Audio", audioConstructor);
    const { useUniverseRadio } = await import("../app/composables/useUniverseRadio");
    const radio = useUniverseRadio();
    await radio.play();
    const player = audioConstructor.mock.results[0]?.value as FakeAudio;

    radio.setVolume(.24);
    radio.toggleMute();
    expect(player.volume).toBe(.24);
    expect(player.muted).toBe(true);
    radio.toggleMute();
    expect(player.muted).toBe(false);
    expect(player.volume).toBe(.24);
    radio.stopForMiniApp();
    expect(player.pause).toHaveBeenCalled();
    expect(player.currentTime).toBe(0);
  });

  it("offers keyboard-accessible play, mute, and volume controls in a compact popover", async () => {
    const container = document.createElement("div");
    const app = createApp(UniverseRadioControl);
    document.body.append(container);
    app.mount(container);

    container.querySelector<HTMLButtonElement>(".universe-radio__toggle")?.click();
    await nextTick();
    expect(container.querySelector('[role="group"]')?.textContent).toContain("CosmoPort Radio");
    expect(container.querySelector<HTMLInputElement>('input[type="range"]')?.getAttribute("aria-label")).toBe("Radio volume");
    container.querySelector<HTMLInputElement>('input[type="range"]')?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();
    expect(container.querySelector('[role="group"]')).toBeNull();
    app.unmount();
  });
});

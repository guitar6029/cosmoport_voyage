export const ABOUT_MEDIA_BASE_URL = "https://media.cosmos-universe.com/about";

const cdnMedia = (key: string) => `${ABOUT_MEDIA_BASE_URL}/${key}`;

/** Reviewed concept artwork used exclusively by the Cosmo Universe About collage. */
export const ABOUT_MEDIA = {
  midcenturyCartoon: cdnMedia("01-midcentury-cartoon.webp"),
  cinematicVoyage: cdnMedia("02-cinematic-voyage.webp"),
  atomicWasteland: cdnMedia("03-atomic-wasteland.webp"),
  pencilAndInk: cdnMedia("04-pencil-and-ink.webp"),
  watercolorFantasy: cdnMedia("05-watercolor-fantasy.webp"),
  neonPixelInspired: cdnMedia("06-neon-pixel-inspired.webp"),
} as const;

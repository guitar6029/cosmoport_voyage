export const PASSPORT_OFFICE_MEDIA_BASE_URL = "https://media.cosmos-universe.com/passport-office";

const cdnMedia = (key: string) => `${PASSPORT_OFFICE_MEDIA_BASE_URL}/${key}`;

/** Reviewed public R2 object keys used by the Passport Office scene. */
export const PASSPORT_OFFICE_MEDIA = {
  background: cdnMedia("retro-spaceport-passport-bureau.png"),
  stella: {
    idle: cdnMedia("stella/v0/stella-idle-blink.webp"),
    talking: cdnMedia("stella/v0/stella-talking-test.webp"),
    happy: cdnMedia("stella/v0/stella-happy.webp"),
    welcome: cdnMedia("stella/v0/stella-welcome.webp"),
    fallback: cdnMedia("stella/v0/stella-blink.webp"),
  },
} as const;

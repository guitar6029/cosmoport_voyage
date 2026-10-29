export const PASSPORT_OFFICE_MEDIA_BASE_URL = "https://media.cosmos-universe.com/passport-office";

const cdnMedia = (key: string) => `${PASSPORT_OFFICE_MEDIA_BASE_URL}/${key}`;

/** Reviewed public R2 object keys used by the Passport Office interface. */
export const PASSPORT_OFFICE_MEDIA = {
  background: cdnMedia("retro-spaceport-passport-bureau.png"),
  passportCover: cdnMedia("cosmoport-passport-cover.png"),
  passportInterior: cdnMedia("cosmoport-passport-inside.png"),
} as const;

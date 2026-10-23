import { createError, defineEventHandler } from "h3";
import { getAstroPopDatabaseHealth } from "../utils/astroPopDatabase";

export default defineEventHandler(async () => {
  try {
    return await getAstroPopDatabaseHealth();
  } catch {
    throw createError({
      status: 503,
      statusText: "Database health check unavailable",
    });
  }
});

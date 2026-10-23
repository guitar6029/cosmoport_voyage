import { createError, defineEventHandler } from "h3";
import {
  AstroPopDatabaseConfigurationError,
  getAstroPopDatabaseHealth,
} from "../utils/astroPopDatabase";

export default defineEventHandler(async () => {
  try {
    return await getAstroPopDatabaseHealth();
  } catch (error) {
    if (error instanceof AstroPopDatabaseConfigurationError) {
      throw createError({
        status: 503,
        statusText: "Database health check unavailable",
      });
    }

    throw createError({
      status: 503,
      statusText: "Database health check unavailable",
    });
  }
});

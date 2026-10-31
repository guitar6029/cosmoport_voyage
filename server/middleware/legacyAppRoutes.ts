import { defineEventHandler, getMethod, getRequestURL, sendRedirect } from "h3";

/** Existing bookmarks and Stripe redirects now point to /app/:id/*.
 * Never serve legacy pages: they must go through the availability guard.
 */
export default defineEventHandler((event) => {
  if (getMethod(event) !== "GET" && getMethod(event) !== "HEAD") return;
  const url = getRequestURL(event);
  if (!/^\/(astro-pop|cosmoport-voyage)(\/|$)/.test(url.pathname)) return;

  return sendRedirect(event, `/app${url.pathname}${url.search}`, 307);
});

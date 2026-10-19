import tailwindcss from "@tailwindcss/vite";
import { SITE_DESCRIPTION, SITE_TITLE } from "./app/site";

export default defineNuxtConfig({
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: SITE_TITLE,
      meta: [
        { name: "description", content: SITE_DESCRIPTION },
        { property: "og:title", content: SITE_TITLE },
        { property: "og:description", content: SITE_DESCRIPTION },
        { property: "og:type", content: "website" },
      ],
    },
  },
});

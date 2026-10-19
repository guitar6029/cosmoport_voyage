import tailwindcss from "@tailwindcss/vite";
import { SITE_DESCRIPTION, SITE_TITLE } from "./app/site";

export default defineNuxtConfig({
  modules: ["@nuxtjs/sanity", "@nuxt/fonts"],
  fonts: {
    families: [
      {
        name: "Fontdiner Swanky",
        provider: "google",
      },
      {
        name: "Cherry Cream Soda",
        provider: "google"
      }
    ],
  },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  sanity: {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    apiVersion: "2025-02-19",
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

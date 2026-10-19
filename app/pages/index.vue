<script setup lang="ts">
import { SITE_DESCRIPTION, SITE_TITLE } from "../site";

useSeoMeta({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  ogTitle: SITE_TITLE,
  ogDescription: SITE_DESCRIPTION,
  ogType: "website",
});
</script>

<template>
  <main class="min-h-screen p-8">
    <section aria-labelledby="page-title" class="mx-auto max-w-3xl">
      <h1 id="page-title" class="text-4xl font-bold">CosmoPort Voyage</h1>
      <p class="mt-4 text-lg">
        A fictional retrofuturistic space-travel experience.
      </p>
    </section>
  </main>
</template>

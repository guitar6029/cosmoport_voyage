<script setup lang="ts">
import { ASTROPOP_FLAVORS } from "../../../data/astroPopFlavors";

const route = useRoute();
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug;
const flavor = ASTROPOP_FLAVORS.find((candidate) => candidate.id === slug);

if (!flavor) {
  throw createError({
    statusCode: 404,
    statusMessage: "AstroPop flavor not found",
  });
}

useHead({
  title: `${flavor.name} | AstroPop Soda Co.`,
});
</script>

<template>
  <main>
    <h1>{{ flavor.name }}</h1>
    <NuxtLink to="/astro-pop">Return to AstroPop</NuxtLink>
  </main>
</template>

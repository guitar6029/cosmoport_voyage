<script setup lang="ts">

import CosmoportAppToggleActive from '~/components/admin/CosmoportAppToggleActive.vue';
import type { CosmoportApp } from '~~/server/utils/cosmoportCoreDatabase';

definePageMeta({
  layout: "admin",
  middleware: "admin",
});


const { data, status, error } = await useFetch("/api/admin/apps")

const handleAppUpdated = (updatedApp: CosmoportApp) => {
  const app = data.value?.apps.find(
    app => app.id === updatedApp.id
  );

  if (app) {
    app.enabled = updatedApp.enabled;
  }
};


const noApps = computed(() => {
  return status.value === "success" && data.value?.apps.length === 0;
})

</script>

<template>
  <section class="flex flex-col gap-2">
    <div v-if="noApps">
      <span>No Apps to Display.</span>
    </div>
    <section v-else-if="data">
      <div v-for="app in data?.apps" :key="app.id" class="flex gap-2 border-2 p-2">
        <h2>{{ app.title }}</h2>
        <span>{{ app.description }}</span>
        <CosmoportAppToggleActive :app-id="app.id" :enabled="app.enabled" @updated="handleAppUpdated" />
      </div>

    </section>

  </section>
</template>

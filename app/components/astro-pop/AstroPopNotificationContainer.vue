<script setup lang="ts">
import { useAstroPopNotifications } from "../../composables/astro-pop/useAstroPopNotifications";
import AstroPopNotification from "./AstroPopNotification.vue";

const { notifications } = useAstroPopNotifications();
</script>

<template>
  <div
    class="
      pointer-events-none
      fixed bottom-4 right-4 z-50
      flex w-[calc(100vw-2rem)] max-w-sm
      flex-col gap-3
      sm:bottom-6 sm:right-6
    "
  >
    <AstroPopNotification
      v-for="notification in notifications"
      :key="notification.id"
      :type="notification.type"
    />
  </div>
</template>


<script setup lang="ts">
import { ASTRO_POP_MEDIA } from "../../data/astroPopMedia";
type NotificationType = "success" | "error" | "info";

const props = defineProps<{
  type: NotificationType;
}>();

const notificationImages: Record<NotificationType, string> = {
  success: ASTRO_POP_MEDIA.notifications.success,
  error: ASTRO_POP_MEDIA.notifications.error,
  info: ASTRO_POP_MEDIA.notifications.info,
};

const notificationDescriptions: Record<NotificationType, string> = {
  success: "Added to cart! Your Astro Pop is in the cart.",
  error: "Oh no! Something fizzled out. Please try again.",
  info: "Heads up! You can add up to 6 bottles per flavor.",
};
</script>

<template>
  <div
    class="astro-pop-notification"
    :role="props.type === 'error' ? 'alert' : 'status'"
  >
    <img
      :src="notificationImages[props.type]"
      :alt="notificationDescriptions[props.type]"
      class="w-full h-auto"
    />
  </div>
</template>

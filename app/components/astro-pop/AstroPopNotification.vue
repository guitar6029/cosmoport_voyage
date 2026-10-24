
<script setup lang="ts">
type NotificationType = "success" | "error" | "info";

const props = defineProps<{
  type: NotificationType;
}>();

const notificationImages: Record<NotificationType, string> = {
  success: "/images/astro-pop/notification/astro-pop-toast-success.png",
  error: "/images/astro-pop/notification/astro-pop-toast-error.png",
  info: "/images/astro-pop/notification/astro-pop-toast-info.png",
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

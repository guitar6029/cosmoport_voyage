<script setup lang="ts">
import type { CosmoportApp } from "../../../shared/types/cosmoportApp";

const props = defineProps<{
  appId: string;
  appTitle: string;
  enabled: boolean;
}>();

const emit = defineEmits<{
  updated: [app: CosmoportApp];
}>();

const saving = ref(false);
const error = ref<string | null>(null);

async function handleChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  if (saving.value) return;

  const requestedEnabled = checkbox.checked;
  saving.value = true;
  error.value = null;

  try {
    const { app } = await $fetch<{ app: CosmoportApp }>(
      `/api/admin/apps/${encodeURIComponent(props.appId)}`,
      {
        method: "PATCH",
        body: { enabled: requestedEnabled },
      },
    );

    checkbox.checked = app.enabled;
    emit("updated", app);
  } catch {
    // A native checkbox flips before the server confirms the write.
    // Reset it to the last known, server-confirmed value on failure.
    checkbox.checked = props.enabled;
    error.value = "Unable to update app status. Please try again.";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col items-start gap-1">
    <label class="flex cursor-pointer items-center gap-3">
      <span class="text-sm font-semibold">{{ enabled ? "Enabled" : "Disabled" }}</span>
      <input
        type="checkbox"
        class="toggle"
        :checked="enabled"
        :disabled="saving"
        :aria-label="`Enable ${appTitle}`"
        @change="handleChange"
      />
    </label>
    <span v-if="saving" role="status" class="text-xs">Saving…</span>
    <p v-if="error" role="alert" class="text-sm text-red-800">{{ error }}</p>
  </div>
</template>

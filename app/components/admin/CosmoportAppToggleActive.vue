<script setup lang="ts">
import { updateCosmoportAppStatus, type CosmoportApp } from '../../../server/utils/cosmoportCoreDatabase';

const props = defineProps<{
    appId: string;
    enabled: boolean;
}>();


const emit = defineEmits<{
    updated: [app: CosmoportApp];

}>();

const loading = ref(false);
const error = ref<string | null>(null);

const handleCosmoportAppEnableStatus = async () => {
    if (loading.value) return;

    loading.value = true;
    error.value = null;

    try {
        const response = await $fetch(`/api/admin/apps/${props.appId}`, {
            method: "PATCH",
            body: {
                enabled: !props.enabled,
            },
        });

        emit('updated', response.app);
    } catch {
        error.value = "Unable to update app status.";
    } finally {
        loading.value = false;
    }
};

</script>

<template>
    <label for="enabled" class="label">Enable App</label>
    <input type="checkbox" :checked="enabled" :disabled="loading" @change="handleCosmoportAppEnableStatus"
        class="toggle" />
</template>

<script setup lang="ts">
import { DollarSign } from 'lucide-vue-next';
import UiIcon from '../../ui/UiIcon.vue';

const props = withDefaults(defineProps<{
    value: number | null | undefined
}>(), {
    value: null,
});
</script>

<template>
    <span class="font-bold badge badge-xl badge-outline">
        <UiIcon :icon="DollarSign" size="lg" customClass="text-primary" /> {{
            props.value ?? '?'
        }}
    </span>

</template>
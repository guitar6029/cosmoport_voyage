<script setup lang="ts">
import { Timer } from 'lucide-vue-next';
import { computed } from 'vue';

const props = defineProps<{
    duration?: number | null
    indicator?: "MINUTES" | "HOURS"
    abbreviate?: boolean
}>()


const abbreviateHelper = computed(() => props.abbreviate && props.indicator === "MINUTES" ? "min" : "hr")


</script>

<template>
    <div
        class="border-2 border-primary rounded-xl p-2 w-fit bg-accent h-fit flex items-center gap-2">
        <UiIcon :icon="Timer" size="lg" customClass="text-primary" />
        <span class="font-bold text-2xl">{{ duration ?? "?" }} {{ abbreviateHelper }}</span>
    </div>
</template>
<script lang="ts" setup>

defineProps<{
    text: string
}>();

defineEmits<{
    (e: 'click'): void
}>()
</script>

<template>
    <div class="flex flex-col items-center justify-center mt-12 relative">
        <button @click="$emit('click')" class="btn w-full text-4xl">{{ text }}</button>
        <div class="absolute top-12 right-0 w-full h-4 flex items-center gap-2">
            <div class="flex-1 h-4 bg-primary/45"></div>
            <div class="flex-3 h-4 bg-secondary/45 rounded-br-4xl"></div>
        </div>
    </div>
</template>
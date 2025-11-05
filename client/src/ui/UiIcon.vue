<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { Component } from 'vue'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number

const props = withDefaults(defineProps<{
    icon: Component
    size?: Size          // 'md' by default
    stroke?: number      // Lucide stroke-width (default 2)
    title?: string       // optional <title> for a11y/tooltips
    extraClass?: string       // extra classes
}>(), {
    size: 'md',
    stroke: 2,
})

const SIZE_CLASSES: Record<Exclude<Size, number>, string> = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
}

const sizeClass = computed(() => {
    if (typeof props.size === 'number') {
        // Tailwind arbitrary values
        return `w-[${props.size}px] h-[${props.size}px]`
    }
    return SIZE_CLASSES[props.size]
})

const attrs = useAttrs() // forward any extra attrs (e.g. @click, data-*, etc.)
</script>

<template>
    <component :is="icon" :class="[sizeClass, 'shrink-0', extraClass]" :stroke-width="stroke" role="img"
        :aria-label="title" v-bind="attrs">
        <title v-if="title">{{ title }}</title>
    </component>
</template>

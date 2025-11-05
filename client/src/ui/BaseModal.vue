<!-- BaseModal.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ show: boolean; title?: string, uppercase?: boolean, titleClass?: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()
const dialogRef = ref<HTMLDialogElement | null>(null)

watch(() => props.show, v => v ? dialogRef.value?.showModal() : dialogRef.value?.close())
</script>

<template>
    <dialog ref="dialogRef" class="modal" @close="emit('close')">
        <div class="modal-box flex flex-col gap-4 max-w-4xl">
            <h3 :class="['font-bold text-2xl', { 'uppercase': uppercase }, titleClass]">{{ title }}</h3>
            <slot />

            <div class="modal-action">
                <button type="button" class="btn" @click="dialogRef?.close()">Close</button>
            </div>
        </div>

        <!-- optional backdrop click to close -->
        <div class="modal-backdrop" @click="dialogRef?.close()"></div>
    </dialog>
</template>

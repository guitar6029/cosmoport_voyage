<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null

function fitToDisplaySize(canvas: HTMLCanvasElement) {
    const dpr = Math.max(1, window.devicePixelRatio || 1)

    // Choose a logical CSS size for your canvas “game area”
    // You can keep your Tailwind classes for layout, but
    // define a *logical* drawing size here (e.g., 560x820).
    const cssWidth = 560
    const cssHeight = 820

    // Set backing store to DPR-scaled pixels
    canvas.width = Math.floor(cssWidth * dpr)
    canvas.height = Math.floor(cssHeight * dpr)

    // Make 1 unit in API = 1 CSS pixel
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Optional: also size the element with CSS inline styles
    canvas.style.width = cssWidth + 'px'
    canvas.style.height = cssHeight + 'px'
}

function init() {
    const canvas = canvasRef.value
    if (!canvas) return

    ctx = canvas.getContext('2d')
    if (!ctx) return

    fitToDisplaySize(canvas)

    // Clear + simple test draw
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#04121a'
    // Use CSS-space units (because we setTransform above)
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)

    ctx.fillStyle = '#e9d6b0'
    ctx.font = '20px monospace'
    ctx.fillText('Canvas Ready', 120, 36)
}

onMounted(() => {
    init()
    // Later you can also add: window.addEventListener('resize', () => fitToDisplaySize(canvasRef.value!))
})
</script>

<template>
    <!-- Keep your Tailwind layout classes; we’ll override the inner size in JS for crispness -->
    <canvas ref="canvasRef" class="bg-black rounded-xl shadow-2xl"></canvas>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
export type Direction = 'up' | 'right' | 'down' | 'left'
import spaceshipUp from '../../assets/img/cosmoport/spaceship-up.png'
import crimsonriftbgimg from '../../assets/img/cosmoport/bg/crimson-rift-bg.jpg'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
const size = 100

//bg image
let bgImage: HTMLImageElement

//spaceship
let spaceshipImg = new Image()
spaceshipImg.src = spaceshipUp
//initialize the posX and posY
let posX = 0
let posY = 0

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

    // canvas.width = canvas.clientWidth
    // canvas.height = canvas.clientHeight
    ctx = canvas.getContext('2d')
    if (!ctx) return

    //initialize the posX and posY
    posX = canvas.clientWidth / 2
    posY = canvas.clientHeight / 2

    fitToDisplaySize(canvas)

    // remove this after we have used the spaceship image
    // small square example
    // ctx.fillStyle = 'green'
    // ctx.fillRect((canvas.clientWidth - size) / 2, (canvas.clientHeight - size) / 2, size, size)

    bgImage = new Image()
    bgImage.src = crimsonriftbgimg
    bgImage.onload = () => {
        drawBackground()
    }


    spaceshipImg.onload = () => {
        ctx!.drawImage(spaceshipImg, posX, posY, size, size)
    }


}


function movementControl(direction: Direction) {
    switch (direction) {
        case "up":
            if (posY > 0) {
                //alow movement
                posY -= 10
            } else {
                //then do nothing
            }
            break;


        case "right":
            if (posX >= canvasRef.value!.clientWidth - size) {
                //then do nothing
            } else {
                //alow movement
                posX += 10
            }
            break;

        case "down":
            if (posY <= canvasRef.value!.clientHeight - size) {
                //alow movement
                posY += 10
            } else {
                //then do nothing
            }
            break;

        case "left":
            if (posX <= 0) {
                //then do nothing
            } else {
                //alow movement
                posX -= 10
            }
            break;
        default:
            //do nothing
            break

    }

}

function onKeyDown(e: KeyboardEvent) {

    switch (e.key) {
        case "ArrowUp":
            movementControl('up')
            break;
        case "ArrowRight":
            movementControl('right')
            break;
        case "ArrowDown":
            movementControl('down')
            break;
        case "ArrowLeft":
            movementControl('left')
            break;
        default:
            //do nothing
            break
    }

    //then rerender by using draw()
    draw()
}

function drawBackground() {
    ctx?.drawImage(bgImage, 0, 0, canvasRef.value!.width, canvasRef.value!.height)
}

function drawSpaceship() {
    ctx?.drawImage(spaceshipImg, posX, posY, size, size)
}

function draw() {
    ctx?.clearRect(0, 0, canvasRef.value!.width, canvasRef.value!.height)
    drawBackground()
    drawSpaceship()
}

onMounted(() => {
    init()
    window.addEventListener('keydown', onKeyDown)
    // Later you can also add: window.addEventListener('resize', () => fitToDisplaySize(canvasRef.value!))
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeyDown)
})


</script>

<template>
    <!-- Keep your Tailwind layout classes; we’ll override the inner size in JS for crispness -->
    <canvas ref="canvasRef" class="bg-black rounded-xl shadow-2xl"></canvas>
</template>

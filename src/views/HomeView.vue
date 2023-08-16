<script setup>
import { io } from "socket.io-client";
import { onMounted, ref } from "vue";
import progressBar from "../components/progressbar.vue";
import { ColorPicker } from 'vue-color-kit'
import 'vue-color-kit/dist/vue-color-kit.css'

const socket = io(`ws://127.0.0.1:5000/`)
const color = ref("#000000")
const q = ref(0)
const w = ref(0)
const connected = ref(false)

onMounted(async () => {
    socket.on("connect", () => {
        console.log("Successfully connected to server");
    });

    socket.on("session_id", (data) => {
        console.log(data)
    })

    socket.on("message", async (data) => {
        console.log(data)
    })
    socket.on("keys", async (data) => {
        q.value = Math.round((data.q/100) * 100)
        w.value = Math.round((data.w/100) * 100)
    })
    socket.on("connected", async () => {
        connected.value = true
    })
    socket.on("disconnected", async () => {
        connected.value = false
    })
})

function handleColor(e) {
    color.value = e.hex
    socket.emit("on", {color: e.hex})
}

function ledOn() {
    socket.emit("on", {color: color.value})
}

function ledOff() {
    socket.emit("off")
}

function cb() {
    socket.emit("cb")
}

function ct() {
    socket.emit("ct")
}
function d() {
    socket.emit("d")
}
</script>

<template>
    <div v-if="connected">
        <div class=" text-white w-[50vw] flex justify-around">
            <button @click="ledOn">on</button>
            <button @click="ledOff">off</button>
            <button @click="ct">Calibrate Top</button>
            <button @click="cb">Calibrate Bottom</button>
            <button @click="d">Activate</button>
        </div>
        <ColorPicker :sucker-canvas="null" @changeColor="handleColor" class=" box-content"/>
        <img src="../assets/pad.png" class="w-[240px] h-auto mx-auto">
        <div class="flex justify-around w-[50vh] mx-auto mt-10">
            <progressBar :progress="q" class="relative"/>
            <progressBar :progress="w" class="relative"/>
        </div>
    </div>
</template>

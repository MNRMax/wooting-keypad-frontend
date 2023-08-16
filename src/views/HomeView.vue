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
const activationWooting = ref(null)
const reactivationWooting = ref(null)
const picker = ref(null)

onMounted(async () => {
    socket.on("connect", () => {
        console.log("Successfully connected to server");
    });

    socket.on("session_id", (data) => {
        console.log(data)
    })

    socket.on("data", async (res) => {
        const data = res.data
        color.value = data.color
        activationWooting.value = data.activationWooting
        reactivationWooting.value = data.reactivationWooting
        console.log(activationWooting.value)
        setTimeout(() => {
            picker.value.setAttribute = ("color", '#00FFff')
        }, 100)
    })
    socket.on("keys", async (data) => {
        q.value = Math.round((data.q / 100) * 100)
        w.value = Math.round((data.w / 100) * 100)
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
    socket.emit("on", { color: e.hex })
}

function ledOn() {
    socket.emit("on", { color: color.value })
}

function emitSerial(message) {
    socket.emit("serial", {message: message})
}
</script>

<template>
    <div v-if="connected">
        <div class="absolute flex gap-4 mt-4">
            <div class=" text-white w-fit flex mx-auto justify-around flex-col gap-4 bg-[#323336] shadow-black shadow-md rounded-lg p-4">
                <button @click="ledOn">On</button>
                <button @click="emitSerial('o')">Off</button>
                <button @click="emitSerial('ct')">Calibrate Top</button>
                <button @click="emitSerial('cb')">Calibrate Bottom</button>
                <button @click="emitSerial('d')">Activate</button>
            </div>
            <ColorPicker ref="picker" :sucker-canvas="null" @changeColor="handleColor" class=" box-content" />
        </div>
        <div class="h-[30vh]"></div>
        <img src="../assets/pad.png" class="w-[240px] h-auto mx-auto ">
        <div class="flex justify-around w-[50vh] mx-auto mt-10">
            <progressBar :progress="q" class="relative" />
            <progressBar :progress="w" class="relative" />
        </div>
        <div class="text-white w-[30vw] h-fit absolute right-[3rem] top-[10vh] z-20 bg-[#323336] p-4 text-center shadow-black shadow-md rounded-lg">
            <h2 class="text-[2rem]">Wooting Settings</h2>
            <form class="">
                <div class="mt-[1rem]">
                    <label class="mr-[1rem]">Activation:</label>
                    <input v-model="activationWooting" step="0.01" type="number" max="4" min="0" class="w-[4rem] text-black" required>
                    <label>mm</label>
                </div>
                <div class="mt-[1rem]">
                    <label class="mr-[1rem]">Reactivation:</label>
                    <input v-model="reactivationWooting" step="0.01" type="number" max="4" min="0" class="w-[4rem] text-black" required>
                    <label>mm</label>
                </div>
                <button  class="mt-[1rem]">Update</button>
            </form>
        </div>
    </div>
</template>

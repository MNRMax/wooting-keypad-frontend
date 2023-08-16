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
const picker = ref(null)


const activationWooting = ref(null)
const reactivationWooting = ref(null)
const defaultColor = ref("#00ffff")
const activationNormal = ref(2.3)
const mode = ref("w")


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
        defaultColor.value = data.color
        activationNormal.value = data.activationNormal
        mode.value = data.mode

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
function ledOff() {
    socket.emit("on", { color: "#000000"})
}

function emitSerial(message) {
    socket.emit("serial", {message: message})
}
function submitNormal() {
    socket.emit("settings", {data: {
        activationNormal: activationNormal.value
    }})
}
function submitWooting() {
    socket.emit("settings", {data: {
        activationWooting: activationWooting.value,
        reactivationWooting: reactivationWooting.value
    }})
}
function submitMode() {
    if (mode.value == 'w') {
        mode.value = 'n'
    }
    else {
        mode.value = 'w'
    }
    socket.emit("settings", {data: {
        mode: mode.value
    }})
}
</script>

<template>
    <div v-if="connected">
        <div class="absolute flex gap-4 mt-4">
            <div class=" text-white w-fit flex mx-auto justify-around flex-col gap-4 bg-[#323336] shadow-black shadow-md rounded-lg p-4">
                <button @click="ledOn">On</button>
                <button @click="ledOff">Off</button>
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
        <div id="settings">
            <div v-if="mode == 'w'" class="text-white w-[30vw] h-fit absolute right-[3rem] top-[10vh] z-20 bg-[#323336] p-4 text-center shadow-black shadow-md rounded-lg">
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
                    <button @click.prevent="submitWooting" class="mt-[1rem]">Update</button>
                </form>
            </div>
            <div v-if="mode == 'n'" class="text-white w-[30vw] h-fit absolute right-[3rem] top-[10vh] z-20 bg-[#323336] p-4 text-center shadow-black shadow-md rounded-lg">
                <h2 class="text-[2rem]">Normal Settings</h2>
                <form class="">
                    <div class="mt-[1rem]">
                        <label class="mr-[1rem]">Activation:</label>
                        <input v-model="activationNormal" step="0.01" type="number" max="4" min="0" class="w-[4rem] text-black" required>
                        <label>mm</label>
                    </div>
                    <button @click.prevent="submitNormal" class="mt-[1rem]">Update</button>
                </form>
            </div>
            <div class="text-white w-fit h-fit right-[3rem] bottom-[5vh] z-20 bg-[#323336] p-4 text-center shadow-black shadow-md rounded-lg absolute cursor-pointer" @click="submitMode">
                <h2 class="text-[1.2rem]">Change Mode To {{ mode == 'w' ? "Normal" : "Wooting" }}</h2>
            </div>
        </div>
    </div>
</template>

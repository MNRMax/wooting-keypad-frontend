<script setup>
import { io } from "socket.io-client";
import { onMounted, ref } from "vue";
import progressBar from "../components/progressbar.vue"

const socket = io(`ws://127.0.0.1:5000/`)
const color = ref("#000000")
const q = ref(0)

onMounted(async () => {
    socket.on("connect", () => {
        console.log("Successfully connected to server");
        socket.emit("message", { message: "dsaudgay" })
    });

    socket.on("session_id", (data) => {
        console.log(data)
    })

    socket.on("message", async (data) => {
        console.log(data)
    })
    socket.on("keys", async (data) => {
        q.value = Math.round((data.q/1023) * 100)
    })
})

function ledOn() {
    socket.emit("on", {color: color.value})
}

function ledOff() {
    socket.emit("off")
}
</script>

<template>
    <div class=" text-white w-[50vw] flex justify-around">
        <button @click="ledOn">on</button>
        <button @click="ledOff">off</button>
    </div>
    <input type="color" v-model="color">
    <div class="">
        <progressBar :progress="q"/>
    </div>
</template>

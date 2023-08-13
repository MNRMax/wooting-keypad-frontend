<script setup>
import { io } from "socket.io-client";
import { onMounted } from "vue";

const socket = io(`ws://127.0.0.1:5000/`)

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

})

function ledOn() {
    socket.emit("on")
}

function ledOff() {
    socket.emit("off")
}
</script>

<template>
    <button @click="ledOn">on</button>
    <button @click="ledOff">off</button>
</template>

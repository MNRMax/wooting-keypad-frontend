<script setup>
const props = defineProps({
    progress: Number
})
function getStyle() {
    return `height: ${(props.progress/100) * 15}vh;`
}
</script>

<template>
    <div id="loading mx-auto">
        <div class="min-w-[5vw] h-[15vh] bg-yellow-400 absolute left-[25vw]"></div>
        <div class="w-[5vw] bg-slate-700 absolute left-[25vw] z-10 origin-bottom-left" :style="getStyle()"></div>
    </div>
</template>

<style scoped>

@media (max-width: 1200px) {
    .block-width{
        width: 90vw;
    }
}

</style>
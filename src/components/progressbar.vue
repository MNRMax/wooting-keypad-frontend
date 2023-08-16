<script setup>
const props = defineProps({
    progress: Number
})
function getStyle() {
    return `height: ${(props.progress/100) * 15}vh;`
}
</script>

<template>
    <div>
        <div class="translate-x-[50%]">
            <div class="w-[80px] h-[15vh] bg-yellow-400 absolute left-0 translate-x-[-50%]"></div>
            <div class="w-[80px] bg-slate-700 absolute left-0 z-10 origin-bottom-left translate-x-[-50%]" :style="getStyle()"></div>
        </div>
        <p class="text-white mt-[15vh] text-center w-[80px]">{{ props.progress/25 }} mm</p>
    </div>
</template>

<style scoped>

</style>
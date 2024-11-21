<template>
    <router-view />
</template>

<!-- 在 setup 函数内部声明的变量、函数等会自动暴露给模板使用，使得代码更加简洁直观。 -->
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
    console.log('onMounted');
});

onUnmounted(() => {
    console.log('onUnmounted');
});
</script>

<style lang="scss">
#app {
    color: $font-color;
    height: 100%;
    overflow: hidden;
    background-color: $layout-background;
}
</style>

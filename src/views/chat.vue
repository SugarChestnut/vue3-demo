<template> </template>

<script setup lang="ts">
// ref 引用空间
import { ref, onUnmounted } from 'vue';

onUnmounted(() => {
    // 当组件卸载的时候，关闭 webSocket
    closeWebSocket();
});

const closeWebSocket = function () {
    ws.value.close();
};

// 获取用户信息

// 创建一个 ref
const ws = ref();

const initWs = function() {
    ws.value = new WebSocket(`ws://127.0.0.1:9999/socket/userId`);
    ws.value.onopen = (): void => {
        // 连接成功
    }
    ws.value.onmessage = (msg: any): void => {
        console.log(msg);
        // 定时器通过心跳校验连接是否失效
    }
    ws.value.onerror = () => {
        // 连接错误
        setTimeout(() => {
            initWs();
        }, 5000);
    }
};
initWs();

</script>

<style lang="scss" scoped></style>

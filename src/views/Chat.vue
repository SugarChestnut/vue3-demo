<template>
    Chat: <el-input v-model="input" style="width: 240px" placeholder="Please input" /><el-button @click="send"
        >Default</el-button
    >
</template>

<script lang="ts" setup>
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { onMounted, onUnmounted } from 'vue';
import { ref } from 'vue';
import { ElNotification } from 'element-plus';

const input = ref('');
const wsUri = import.meta.env.VITE_APP_SOCKET_URL;
const sock = new SockJS(wsUri);
const stomp = Stomp.over(sock);

onMounted(() => {
    stomp.connect(
        {
            // 头参数
        },
        () => {
            // 连接成功回调
            console.log('连接成功');
        },
        (error) => {
            // 连接失败
            console.log(error);
        },
    );
});

sock.onmessage = (e: MessageEvent) => {
    ElNotification({
        title: '系统消息',
        message: e.data,
        duration: 0,
    });
};

onUnmounted(() => {
    if (stomp && stomp.connected) {
        stomp.disconnect(() => {
            console.log('断开连接');
        });
    }
});

function sendToUser() {

}

function sendToAll() {
    
}
</script>

<style lang="sass" scoped></style>

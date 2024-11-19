<template>
    <div class="app-container">
        <el-row :gutter="10">
            <el-col :span="12">
                <el-card class="mt-5">
                    <el-form label-width="90px">
                        <el-form-item label="消息内容">
                            <el-input v-model="queneMessage" type="textarea" />
                        </el-form-item>
                        <el-form-item label="消息接收人">
                            <el-input v-model="receiver" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="send">发送消息</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <!-- 消息接收显示部分 -->
            <el-col :span="12">
                <el-card>
                    <div class="message-container">
                        <div
                            v-for="(message, index) in messages"
                            :key="index"
                            :class="{
                                'message--sent': message.sender === name,
                                'message--received': message.sender !== name,
                            }"
                        >
                            <div class="message-content">
                                <div
                                    :class="{
                                        'message-sender': message.sender === name,
                                        'message-receiver': message.sender !== name,
                                    }"
                                >
                                    {{ message.sender }}
                                </div>
                                <div class="color-#333">{{ message.message }}</div>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { Client } from '@stomp/stompjs';
import { onMounted, onUnmounted } from 'vue';
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const name = uuidv4().substring(6);

interface MessageType {
    timestamp?: number;
    sender?: string;
    message: string;
}
Client.

const messages = ref<MessageType[]>([]);
const topicMessage = ref('');
const queneMessage = ref('');
const receiver = ref('');

console.log('chat');

const stompClient = new Client({
    brokerURL: 'ws://127.0.0.1:13148/ws',
    connectHeaders: {},
    onConnect: () => {
        messages.value.push({
            timestamp: new Date().getTime(),
            sender: 'Server',
            message: '服务器连接成功',
        });

        // 订阅广播消息
        stompClient.subscribe('/topic/notice', (res: any) => {
            messages.value.push({
                sender: 'Server',
                message: res.body,
            });
        });

        // 定向消息
        stompClient.subscribe('users/queue/msg', (res: any) => {
            const messageData = JSON.parse(res.body) as MessageType;
            messages.value.push({
                timestamp: new Date().getTime(),
                sender: messageData.sender,
                message: messageData.message,
            });
        });
    },
    onStompError: (frame: any) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    },
    onDisconnect: () => {
        messages.value.push({
            sender: 'Server',
            message: 'Websocket 已断开',
        });
    },
});
onMounted(() => {
    if (stompClient && !stompClient.connected) {
        stompClient.activate();
    }
});

onUnmounted(() => {
    if (stompClient && stompClient.connected) {
        stompClient.deactivate();
    }
});

function send() {
    if (stompClient.connected) {
        if (receiver.value === 'Server') {
            stompClient.publish({
                destination: '/app/receive',
                body: topicMessage.value,
            });
            messages.value.push({
                sender: name,
                message: topicMessage.value,
            });
        } else if (receiver.value === 'All' || receiver.value === '') {
            // 广播消息
            stompClient.publish({
                destination: '/topic/notice',
                body: topicMessage.value,
            });
            messages.value.push({
                sender: name,
                message: topicMessage.value,
            });
        } else {
            stompClient.publish({
                destination: '/app/sendToUser/' + receiver.value,
                body: queneMessage.value,
            });
            messages.value.push({
                sender: name,
                message: queneMessage.value,
            });
        }
    }
}
</script>

<style lang="scss" scoped>

.message-container {
    display: flex;
    flex-direction: column;
}

.message {
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
}

.message--sent {
    align-self: flex-end;
    background-color: #dcf8c6;
}

.message--received {
    align-self: flex-start;
    background-color: #e8e8e8;
}

.message-content {
    display: flex;
    flex-direction: column;
}

.message-sender {
    margin-bottom: 5px;
    font-weight: bold;
    text-align: right;
}

.message-receiver {
    margin-bottom: 5px;
    font-weight: bold;
    text-align: left;
}

.tip-message {
    align-self: center;
    padding: 5px 10px;
    margin-bottom: 5px;
    font-style: italic;
    text-align: center;
    background-color: #f0f0f0;
    border-radius: 5px;
}
</style>

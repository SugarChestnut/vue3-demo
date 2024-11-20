<template>
    <div class="app-container">
        <el-row :gutter="10">
            <el-col :span="12">
                <el-card class="mt-5">
                    <el-form label-width="90px">
                        <el-form-item label="消息内容">
                            <el-input v-model="message" type="textarea" />
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
                                'message--received': message.sender !== name
                            }"
                        >
                            <div class="message-content">
                                <div
                                    :class="{
                                        'message-sender': message.sender === name,
                                        'message-receiver': message.sender !== name
                                    }"
                                >
                                    {{ message.sender }}: {{ message.message }}
                                </div>
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

const name = uuidv4().replaceAll('-', '').substring(0, 6);
console.log('name: ' + name);

interface MessageType {
    timestamp?: number;
    sender?: string;
    message: string;
}

const messages = ref<MessageType[]>([]);
const message = ref('');
const receiver = ref('');

console.log('chat');

const stompClient = new Client({
    brokerURL: 'ws://127.0.0.1:13148/ws',
    heartbeatIncoming: 0,
    heartbeatOutgoing: 20000,
    reconnectDelay: 5000,
    connectHeaders: {
        username: name
    },
    debug: (str) => {
        console.log(str);
    },
    onConnect: () => {
        // 获取一次服务器数据
        stompClient.subscribe('/app/communicate', (res: any) => {
            console.log(res.body);
        });
        
        messages.value.push({
            timestamp: new Date().getTime(),
            sender: 'Server',
            message: '服务器连接成功'
        });

        // 订阅广播消息
        stompClient.subscribe('/topic/notice', (res: any) => {
            const messageData = JSON.parse(res.body) as MessageType;
            if (messageData.sender !== name) {
                messages.value.push({
                    timestamp: messageData.timestamp,
                    sender: messageData.sender,
                    message: messageData.message
                });
            }
        });

        // 订阅自身的消息
        stompClient.subscribe('/user/queue/shouts', (res: any) => {
            console.log("self");
            const messageData = JSON.parse(res.body) as MessageType;
            messages.value.push({
                timestamp: messageData.timestamp,
                sender: messageData.sender,
                message: messageData.message
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
            message: 'Websocket 已断开'
        });
    }
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
        let msgStr: string = JSON.stringify({ sender: name, message: message.value, timestamp: Date.now() });
        if (receiver.value === 'Server') {
            // 向服务器发送消息
            console.log('发送给服务器: ' + message.value);
            stompClient.publish({
                destination: '/app/receive',
                body: msgStr
            });
            messages.value.push({
                timestamp: Date.now(),
                sender: name,
                message: message.value
            });
        } else if (receiver.value === 'All' || receiver.value === '') {
            console.log('广播消息: ' + message.value);
            // 广播消息
            stompClient.publish({
                destination: '/topic/notice',
                body: msgStr
            });
            messages.value.push({
                timestamp: Date.now(),
                sender: name,
                message: message.value
            });
        } else {
            console.log(`发送给${receiver.value}: ${message.value}`);
            stompClient.publish({
                destination: '/app/sendToUser/' + receiver.value,
                body: msgStr
            });
            messages.value.push({
                timestamp: Date.now(),
                sender: name,
                message: message.value
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

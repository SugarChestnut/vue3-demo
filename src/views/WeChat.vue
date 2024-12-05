<template>
    <div class="wechat-container">
        <div class="chat-layout" ref="chatLayoutRef">
            <!-- 左侧联系人面板 -->
            <div class="contact-panel unselectable-text" :style="{ width: leftWidth + 'px' }">
                <div class="contact-header">
                    <el-input v-model="searchText" placeholder="搜索" prefix-icon="Search" clearable size="small" />
                    <el-button :icon="Plus" title="1" size="small" />
                </div>
                <div class="contact-list custom-scrollbar">
                    <div
                        v-for="contact in contacts"
                        :key="contact.id"
                        class="contact-item"
                        :class="{ active: currentContact?.id === contact.id }"
                        @click="selectContact(contact)"
                    >
                        <el-avatar :size="40" :src="contact.avatar" shape="square" />
                        <div class="contact-info">
                            <div class="contact-name">{{ contact.name }}</div>
                            <div class="contact-preview">{{ contact.lastMessage }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 拖动分隔线 -->
            <div class="resize-line" @mousedown="startResize('horizontal')"></div>

            <!-- 右侧聊天面板 -->
            <div class="chat-panel">
                <!-- 聊天头部 -->
                <div class="chat-header" v-if="currentContact">
                    <span>{{ currentContact.name }}</span>
                </div>

                <!-- 聊天记录区域 -->
                <div class="chat-messages custom-scrollbar" ref="messageContainer" @scroll="handleScroll">
                    <div v-if="loading" class="loading-more">
                        <el-icon class="loading"><Loading /></el-icon>
                    </div>
                    <div v-for="msg in messages" :key="msg.id" class="message-item" :class="msg.type">
                        <el-avatar :size="36" :src="msg.avatar" shape="square" />
                        <div class="triangle" />
                        <div class="message-content">
                            <div class="message-text">{{ msg.content }}</div>
                        </div>
                    </div>
                </div>

                <!-- 输入区域分隔线 -->
                <div class="resize-line horizontal" @mousedown="startResize('vertical')"></div>

                <!-- 输入区域 -->
                <div class="chat-input" :style="{ height: inputHeight + 'px' }">
                    <el-input
                        v-model="inputMessage"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入消息"
                        resize="none"
                        maxlength="140"
                        show-word-limit
                        class="none-border"
                    />
                    <el-button type="primary" @click="sendMessage">发送</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';

// 状态变量
const leftWidth = ref(275);
const inputHeight = ref(150);
const searchText = ref('');
const inputMessage = ref('');
const currentContact = ref(null);
const loading = ref(false);
const messageContainer = ref(null);
const chatLayoutRef = ref(null);

// 生成示例联系人数据
const contacts = ref(
    Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `联系人 ${i + 1}`,
        avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
        lastMessage: `这是最后一条消息 ${i + 1}`
    }))
);

// 聊天记录
const messages = ref([]);

// 生成示例消息
const generateMessages = (count = 20) => {
    const newMessages = [];
    for (let i = 0; i < count; i++) {
        newMessages.push({
            id: Date.now() + i,
            type: Math.random() > 0.5 ? 'sent' : 'received',
            content: `这是第 ${i + 1} 条消息内容`,
            avatar: Math.random() > 0.5 ? 'https://placekitten.com/36/36?image=1' : currentContact.value?.avatar
        });
    }
    return newMessages;
};

// 选择联系人
const selectContact = (contact) => {
    currentContact.value = contact;
    messages.value = generateMessages();
};

// 发送消息
const sendMessage = () => {
    if (!inputMessage.value.trim()) {
        ElMessage.warning('请输入消息内容');
        return;
    }

    messages.value.push({
        id: Date.now(),
        type: 'sent',
        content: inputMessage.value,
        time: new Date().toLocaleTimeString(),
        avatar: 'https://placekitten.com/36/36?image=1'
    });

    inputMessage.value = '';

    // 滚动到底部
    setTimeout(() => {
        const container = messageContainer.value;
        container.scrollTop = container.scrollHeight;
    }, 0);
};

// 处理滚动加载
const handleScroll = async () => {
    const container = messageContainer.value;
    if (container.scrollTop === 0 && !loading.value) {
        loading.value = true;
        // 模拟加载更多消息
        setTimeout(() => {
            messages.value.unshift(...generateMessages(10));
            loading.value = false;
            // 保持滚动位置
            container.scrollTop = 50;
        }, 1000);
    }
};

// 处理拖动调整大小
const startResize = (direction) => {
    const minWidth = 200;
    const maxWidth = 500;
    const minHeight = 100;
    const maxHeight = 300;

    const handleMouseMove = (e) => {
        if (direction === 'horizontal') {
            const newWidth = e.clientX - chatLayoutRef.value.getBoundingClientRect().left;
            if (newWidth >= minWidth && newWidth <= maxWidth) {
                leftWidth.value = newWidth;
            }
        } else {
            const chatPanel = e.target.parentElement;
            const rect = chatPanel.getBoundingClientRect();
            const newHeight = rect.bottom - e.clientY;
            if (newHeight >= minHeight && newHeight <= maxHeight) {
                inputHeight.value = newHeight;
            }
        }
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
};

// 初始化
onMounted(() => {
    selectContact(contacts.value[0]);
});
</script>

<style lang="scss" scoped>
.wechat-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
}

.chat-layout {
    width: 1200px;
    height: 720px;
    display: flex;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

// 左边
.contact-panel {
    min-width: 200px;
    max-width: 500px;
    border-right: 1px solid #eee;
    display: flex;
    flex-direction: column;
}

// 搜索联系人
.contact-header {
    padding: 25px 12px 12px 12px;
    display: flex;
    gap: 10px; // 子元素间隙，配合 flex
    border-bottom: 1px solid #eee;
    :deep(.el-input__wrapper) {
        background-color: #f5f5f5;
    }
    :deep(.el-button--small) {
        padding: 5px;
        background-color: #f5f5f5;
    }
}

// 添加联系人
.add-contact {
    padding-top: 4px;
}

.contact-list {
    flex: 1;
    overflow-y: auto;
    background-color: #f5f5f5;
}

/* 联系人条目 */
.contact-item {
    padding: 11px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: background-color 0.3s;
}

.contact-item:hover {
    background-color: #e8e8e8;
}

.contact-item.active {
    background-color: #e0e0e0;
}

.contact-info {
    flex: 1;
    min-width: 0;
}

.contact-name {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 4px;
}

.contact-preview {
    font-size: 11px;
    color: #999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.resize-line {
    width: 4px;
    cursor: col-resize;
    background-color: transparent;
    transition: background-color 0.2s;
}

.resize-line:hover {
    background-color: #e6e6e6;
}

.resize-line.horizontal {
    width: 100%;
    height: 4px;
    cursor: row-resize;
}

.chat-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.chat-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    font-weight: 500;
}

.chat-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
}

.loading-more {
    text-align: center;
    color: #999;
    padding: 10px 0;
}

.loading {
    animation: rotate 1s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.message-item {
    display: flex;
    // gap: 12px;
    margin-bottom: 16px;
}

.message-item.received {
    flex-direction: row;
}

.message-item.sent {
    flex-direction: row-reverse;
}

.received .triangle {
    margin-top: 12px;
    width: 0;
    height: 0;
    border: 6px;
    border-style: solid;
    border-color: transparent #f4f4f4 transparent transparent;
}

.sent .triangle {
    margin-top: 12px;
    width: 0;
    height: 0;
    border: 6px;
    border-style: solid;
    border-color: transparent transparent transparent #95ec69;
}

.message-content {
    max-width: 60%;
}

.message-text {
    font-size: 14px;
    padding: 10px 16px;
    border-radius: 4px;
}

.received .message-text {
    background-color: #f4f4f4;
}

.sent .message-text {
    background-color: #95ec69;
}

.chat-input {
    padding: 16px;
    border-top: 1px solid #eee;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.chat-input .el-button {
    align-self: flex-end;
}

.none-border {
    // 样式穿透，在父组件中改变深层次子组件的样式
    :deep(.el-textarea__inner) {
        box-shadow: 0 0 0 0px var(--el-input-border-color, var(--bel-border-color)) inset;
    }
}

/* 文字无法选中 */
.unselectable-text {
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard syntax */
}

/* 滚动条样式 */
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
}

.custom-scrollbar:hover {
    scrollbar-color: #c1c1c1 transparent;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 3px;
}

.custom-scrollbar:hover::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
}

::-webkit-scrollbar-button {
    display: none;
}

.custom-scrollbar::-webkit-scrollbar-button {
    display: none;
    background-color: #95ec69;
    width: 0px;
}
</style>


<template>
  <div class="wechat-container">
    <div class="chat-layout" ref="chatLayoutRef">
      <!-- 左侧联系人列表 -->
      <div class="contact-section" :style="{ width: leftWidth + 'px' }">
        <div class="search-box">
          <el-input
            v-model="searchText"
            placeholder="搜索"
            prefix-icon="Search"
            clearable
          />
        </div>
        <div class="contact-list custom-scrollbar">
          <div
            v-for="contact in filteredContacts"
            :key="contact.id"
            class="contact-item"
            :class="{ active: currentContact?.id === contact.id }"
            @click="selectContact(contact)"
          >
            <el-avatar :size="40" :src="contact.avatar" />
            <div class="contact-info">
              <div class="contact-name">{{ contact.name }}</div>
              <div class="last-message">{{ contact.lastMessage }}</div>
            </div>
            <div class="message-time">{{ contact.lastTime }}</div>
          </div>
        </div>
      </div>

      <!-- 拖动分隔线 -->
      <div class="resize-line" @mousedown="startResize('horizontal')"></div>

      <!-- 右侧聊天区域 -->
      <div class="chat-section">
        <!-- 联系人信息 -->
        <div class="chat-header">
          <span>{{ currentContact?.name }}</span>
        </div>

        <!-- 聊天记录 -->
        <div 
          class="chat-messages custom-scrollbar" 
          ref="messageContainer"
          :style="{ height: messageHeight + 'px' }"
          @scroll="handleScroll"
        >
          <div v-for="message in currentMessages" :key="message.id" class="message-item">
            <div :class="['message-content', message.isSelf ? 'self' : 'other']">
              <el-avatar :size="30" :src="message.avatar" />
              <div class="message-bubble">{{ message.content }}</div>
            </div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>

        <!-- 拖动分隔线 -->
        <div class="resize-line horizontal" @mousedown="startResize('vertical')"></div>

        <!-- 输入区域 -->
        <div class="input-section">
          <el-input
            v-model="messageText"
            type="textarea"
            :rows="4"
            placeholder="请输入消息"
            resize="none"
          />
          <el-button type="primary" @click="sendMessage">发送</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 示例数据
const contacts = ref([
  { id: 1, name: '张三', avatar: 'https://placekitten.com/40/40', lastMessage: '今天天气真好', lastTime: '12:30' },
  { id: 2, name: '李四', avatar: 'https://placekitten.com/41/41', lastMessage: '周末要出去玩吗？', lastTime: '11:20' },
  // ... 添加更多联系人
])

// 示例消息数据
const messages = ref({
  1: [
    { id: 1, content: '你好啊', time: '12:20', isSelf: false, avatar: 'https://placekitten.com/40/40' },
    { id: 2, content: '今天天气真好', time: '12:30', isSelf: true, avatar: 'https://placekitten.com/42/42' },
    // ... 添加更多消息
  ],
  2: [
    { id: 1, content: '周末有空吗？', time: '11:10', isSelf: false, avatar: 'https://placekitten.com/41/41' },
    { id: 2, content: '周末要出去玩吗？', time: '11:20', isSelf: true, avatar: 'https://placekitten.com/42/42' },
    // ... 添加更多消息
  ]
})

const searchText = ref('')
const messageText = ref('')
const currentContact = ref(null)
const leftWidth = ref(300)
const messageHeight = ref(400)
const chatLayoutRef = ref(null)
const messageContainer = ref(null)

// 搜索过滤
const filteredContacts = computed(() => {
  return contacts.value.filter(contact =>
    contact.name.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

// 当前联系人的消息
const currentMessages = computed(() => {
  return currentContact.value ? messages.value[currentContact.value.id] : []
})

// 选择联系人
const selectContact = (contact) => {
  currentContact.value = contact
}

// 发送消息
const sendMessage = () => {
  if (!messageText.value.trim() || !currentContact.value) return

  const newMessage = {
    id: Date.now(),
    content: messageText.value,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    isSelf: true,
    avatar: 'https://placekitten.com/42/42'
  }

  messages.value[currentContact.value.id].push(newMessage)
  contacts.value.find(c => c.id === currentContact.value.id).lastMessage = messageText.value
  contacts.value.find(c => c.id === currentContact.value.id).lastTime = newMessage.time
  messageText.value = ''

  // 滚动到底部
  setTimeout(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  }, 0)
}

// 处理滚动加载
const handleScroll = () => {
  if (messageContainer.value.scrollTop === 0) {
    // 这里可以实现加载更多历史消息的逻辑
    console.log('加载更多消息')
  }
}

// 处理拖动调整大小
let isResizing = false
let resizeType = ''

const startResize = (type) => {
  isResizing = true
  resizeType = type
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

const handleResize = (e) => {
  if (!isResizing) return

  if (resizeType === 'horizontal') {
    const newWidth = e.clientX - chatLayoutRef.value.getBoundingClientRect().left
    if (newWidth >= 200 && newWidth <= 400) {
      leftWidth.value = newWidth
    }
  } else {
    const containerRect = messageContainer.value.getBoundingClientRect()
    const newHeight = containerRect.bottom - e.clientY
    if (newHeight >= 200 && newHeight <= 500) {
      messageHeight.value = newHeight
    }
  }
}

const stopResize = () => {
  isResizing = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

// 初始化
onMounted(() => {
  if (contacts.value.length > 0) {
    currentContact.value = contacts.value[0]
  }
})
</script>

<style scoped>
.wechat-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.chat-layout {
  width: 1200px;
  height: 720px;
  display: flex;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.contact-section {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e0e0e0;
}

.search-box {
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.contact-list {
  flex: 1;
  overflow-y: auto;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.contact-item:hover {
  background-color: #f5f5f5;
}

.contact-item.active {
  background-color: #e1e1e1;
}

.contact-info {
  flex: 1;
  margin-left: 10px;
  overflow: hidden;
}

.contact-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.last-message {
  color: #999;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.chat-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 15px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  font-weight: bold;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f5f5;
}

.message-item {
  margin-bottom: 20px;
}

.message-content {
  display: flex;
  align-items: flex-start;
  margin-bottom: 5px;
}

.message-content.self {
  flex-direction: row-reverse;
}

.message-bubble {
  max-width: 60%;
  padding: 10px 15px;
  border-radius: 4px;
  margin: 0 10px;
  background-color: #fff;
  word-break: break-word;
}

.message-content.self .message-bubble {
  background-color: #95ec69;
}

.input-section {
  padding: 15px;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  position: relative;
}

.input-section .el-button {
  position: absolute;
  right: 15px;
  bottom: 15px;
}

.resize-line {
  width: 4px;
  background-color: #e0e0e0;
  cursor: col-resize;
  transition: background-color 0.3s;
}

.resize-line:hover {
  background-color: #1989fa;
}

.resize-line.horizontal {
  width: 100%;
  height: 4px;
  cursor: row-resize;
}

/* 自定义滚动条样式 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

/* 默认隐藏滚动条，hover时显示 */
.contact-list:not(:hover)::-webkit-scrollbar-thumb,
.chat-messages:not(:hover)::-webkit-scrollbar-thumb {
  background-color: transparent;
}
</style>



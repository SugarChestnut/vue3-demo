
<template>
  <div class="wechat-container">
    <div class="chat-layout" ref="chatLayoutRef">
      <!-- 左侧联系人面板 -->
      <div class="contact-panel" :style="{ width: leftPanelWidth + 'px' }">
        <!-- 搜索框 -->
        <div class="search-box">
          <el-input
            v-model="searchText"
            placeholder="搜索"
            prefix-icon="Search"
            clearable
          />
        </div>
        <!-- 联系人列表 -->
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
          </div>
        </div>
      </div>

      <!-- 拖动分隔线 -->
      <div class="resize-line" @mousedown="startResizeLeft"></div>

      <!-- 右侧聊天面板 -->
      <div class="chat-panel">
        <!-- 联系人信息 -->
        <div class="chat-header">
          <span>{{ currentContact?.name }}</span>
        </div>

        <!-- 聊天记录区域 -->
        <div 
          class="chat-messages custom-scrollbar" 
          ref="messageContainer"
          :style="{ height: messageAreaHeight + 'px' }"
          @scroll="handleScroll"
        >
          <div v-if="loading" class="loading-more">加载更多...</div>
          <div v-for="msg in currentMessages" :key="msg.id" class="message-item" :class="msg.type">
            <el-avatar :size="36" :src="msg.avatar" />
            <div class="message-content">{{ msg.content }}</div>
          </div>
        </div>

        <!-- 拖动分隔线 -->
        <div class="resize-line horizontal" @mousedown="startResizeMessage"></div>

        <!-- 输入区域 -->
        <div class="input-area">
          <el-input
            v-model="inputMessage"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 状态变量
const searchText = ref('')
const inputMessage = ref('')
const leftPanelWidth = ref(300)
const messageAreaHeight = ref(400)
const currentContact = ref(null)
const loading = ref(false)
const chatLayoutRef = ref(null)
const messageContainer = ref(null)

// 示例数据
const contacts = ref([
  { id: 1, name: '张三', avatar: 'https://placeholder.com/40', lastMessage: '晚上一起吃饭？' },
  { id: 2, name: '李四', avatar: 'https://placeholder.com/40', lastMessage: '好的，明天见！' },
  { id: 3, name: '王五', avatar: 'https://placeholder.com/40', lastMessage: '收到文件了' },
])

const messages = ref({
  1: [
    { id: 1, type: 'received', content: '你好啊', avatar: 'https://placeholder.com/36' },
    { id: 2, type: 'sent', content: '你好！最近怎么样？', avatar: 'https://placeholder.com/36' },
    { id: 3, type: 'received', content: '还不错，晚上一起吃饭？', avatar: 'https://placeholder.com/36' },
  ],
  2: [
    { id: 1, type: 'sent', content: '明天开会记得带文件', avatar: 'https://placeholder.com/36' },
    { id: 2, type: 'received', content: '好的，明天见！', avatar: 'https://placeholder.com/36' },
  ],
})

// 计算属性
const filteredContacts = computed(() => {
  return contacts.value.filter(contact =>
    contact.name.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

const currentMessages = computed(() => {
  return messages.value[currentContact.value?.id] || []
})

// 方法
const selectContact = (contact) => {
  currentContact.value = contact
}

const sendMessage = () => {
  if (!inputMessage.value.trim() || !currentContact.value) return

  const newMessage = {
    id: Date.now(),
    type: 'sent',
    content: inputMessage.value,
    avatar: 'https://placeholder.com/36'
  }

  if (!messages.value[currentContact.value.id]) {
    messages.value[currentContact.value.id] = []
  }
  messages.value[currentContact.value.id].push(newMessage)
  inputMessage.value = ''
}

// 处理面板拖动调整大小
let isResizingLeft = false
let isResizingMessage = false

const startResizeLeft = (e) => {
  isResizingLeft = true
  document.addEventListener('mousemove', handleMouseMoveLeft)
  document.addEventListener('mouseup', stopResize)
}

const startResizeMessage = (e) => {
  isResizingMessage = true
  document.addEventListener('mousemove', handleMouseMoveMessage)
  document.addEventListener('mouseup', stopResize)
}

const handleMouseMoveLeft = (e) => {
  if (!isResizingLeft) return
  const containerRect = chatLayoutRef.value.getBoundingClientRect()
  const newWidth = e.clientX - containerRect.left
  leftPanelWidth.value = Math.max(200, Math.min(500, newWidth))
}

const handleMouseMoveMessage = (e) => {
  if (!isResizingMessage) return
  const containerRect = chatLayoutRef.value.getBoundingClientRect()
  const newHeight = e.clientY - containerRect.top - 60 // 减去头部高度
  messageAreaHeight.value = Math.max(200, Math.min(500, newHeight))
}

const stopResize = () => {
  isResizingLeft = false
  isResizingMessage = false
  document.removeEventListener('mousemove', handleMouseMoveLeft)
  document.removeEventListener('mousemove', handleMouseMoveMessage)
  document.removeEventListener('mouseup', stopResize)
}

// 懒加载
const handleScroll = () => {
  const container = messageContainer.value
  if (container.scrollTop === 0 && !loading.value) {
    loading.value = true
    // 模拟加载更多消息
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
}

// 生命周期钩子
onMounted(() => {
  currentContact.value = contacts.value[0]
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMoveLeft)
  document.removeEventListener('mousemove', handleMouseMoveMessage)
  document.removeEventListener('mouseup', stopResize)
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
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.contact-panel {
  background: #f5f5f5;
  border-right: 1px solid #dcdfe6;
  display: flex;
  flex-direction: column;
}

.search-box {
  padding: 10px;
  border-bottom: 1px solid #dcdfe6;
}

.contact-list {
  flex: 1;
  overflow-y: auto;
}

.contact-item {
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.contact-item:hover {
  background: #e6e6e6;
}

.contact-item.active {
  background: #e6e6e6;
}

.contact-info {
  margin-left: 10px;
  flex: 1;
}

.contact-name {
  font-weight: bold;
}

.last-message {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  height: 60px;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-weight: bold;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
}

.message-item.sent {
  flex-direction: row-reverse;
}

.message-content {
  margin: 0 10px;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
  max-width: 60%;
}

.message-item.sent .message-content {
  background: #95ec69;
}

.input-area {
  padding: 20px;
  border-top: 1px solid #dcdfe6;
  display: flex;
  align-items: flex-end;
}

.input-area .el-button {
  margin-left: 10px;
}

.resize-line {
  width: 4px;
  background: transparent;
  cursor: col-resize;
}

.resize-line:hover {
  background: #dcdfe6;
}

.resize-line.horizontal {
  height: 4px;
  width: 100%;
  cursor: row-resize;
}

.loading-more {
  text-align: center;
  color: #999;
  padding: 10px 0;
}

/* 自定义滚动条样式 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #c0c4cc transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #c0c4cc;
  border-radius: 3px;
  border: 2px solid transparent;
}

.custom-scrollbar:not(:hover)::-webkit-scrollbar-thumb {
  background-color: transparent;
}
</style>







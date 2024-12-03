
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
        <div class="contact-list">
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
        <!-- 聊天头部 -->
        <div class="chat-header">
          <span>{{ currentContact?.name }}</span>
        </div>

        <!-- 聊天记录区域 -->
        <div 
          class="chat-messages" 
          ref="messageContainer"
          :style="{ height: messageAreaHeight + 'px' }"
          @scroll="handleScroll"
        >
          <div v-for="msg in currentMessages" :key="msg.id" class="message-item">
            <div :class="['message', msg.isSelf ? 'self' : 'other']">
              <el-avatar :size="30" :src="msg.isSelf ? userAvatar : currentContact?.avatar" />
              <div class="message-content">{{ msg.content }}</div>
            </div>
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
            @keyup.enter.native="sendMessage"
          />
          <el-button type="primary" @click="sendMessage">发送</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 数据
const leftPanelWidth = ref(300)
const messageAreaHeight = ref(400)
const searchText = ref('')
const inputMessage = ref('')
const currentContact = ref(null)
const userAvatar = 'https://avatars.githubusercontent.com/u/1?v=4'

// 示例数据
const contacts = ref([
  {
    id: 1,
    name: '张三',
    avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
    lastMessage: '晚上一起吃饭吗？'
  },
  {
    id: 2,
    name: '李四',
    avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
    lastMessage: '项目进展如何？'
  },
  // 添加更多联系人...
])

const messages = ref({
  1: [
    { id: 1, content: '你好啊！', isSelf: false },
    { id: 2, content: '最近怎么样？', isSelf: true },
    { id: 3, content: '还不错，你呢？', isSelf: false },
    // 添加更多消息...
  ],
  2: [
    { id: 1, content: '项目deadline是什么时候？', isSelf: true },
    { id: 2, content: '下周五', isSelf: false },
    // 添加更多消息...
  ]
})

// 计算属性
const filteredContacts = computed(() => {
  return contacts.value.filter(contact =>
    contact.name.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

const currentMessages = computed(() => {
  return currentContact.value ? messages.value[currentContact.value.id] : []
})

// 方法
const selectContact = (contact) => {
  currentContact.value = contact
}

const sendMessage = () => {
  if (!inputMessage.value.trim() || !currentContact.value) return

  const newMessage = {
    id: Date.now(),
    content: inputMessage.value,
    isSelf: true
  }
  messages.value[currentContact.value.id].push(newMessage)
  inputMessage.value = ''
}

// 拖动调整大小
const startResizeLeft = (e) => {
  e.preventDefault()
  const startX = e.clientX
  const startWidth = leftPanelWidth.value

  const handleMouseMove = (e) => {
    const delta = e.clientX - startX
    leftPanelWidth.value = Math.max(200, Math.min(500, startWidth + delta))
  }

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const startResizeMessage = (e) => {
  e.preventDefault()
  const startY = e.clientY
  const startHeight = messageAreaHeight.value

  const handleMouseMove = (e) => {
    const delta = startY - e.clientY
    messageAreaHeight.value = Math.max(200, Math.min(500, startHeight + delta))
  }

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// 懒加载更多消息
const handleScroll = (e) => {
  if (e.target.scrollTop === 0) {
    // 这里可以实现加载更多历史消息的逻辑
    console.log('Load more messages')
  }
}
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
  display: flex;
  flex-direction: column;
  border-right: 1px solid #dcdfe6;
  background-color: #f5f5f5;
}

.search-box {
  padding: 10px;
  border-bottom: 1px solid #dcdfe6;
}

.contact-list {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
}

.contact-list::-webkit-scrollbar {
  width: 4px;
}

.contact-list:hover::-webkit-scrollbar-thumb {
  background: #909399;
  border-radius: 2px;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.contact-item:hover {
  background-color: #e6e6e6;
}

.contact-item.active {
  background-color: #e6e6e6;
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
  color: #909399;
}

.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 15px;
  border-bottom: 1px solid #dcdfe6;
  font-weight: bold;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  scrollbar-width: thin;
}

.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages:hover::-webkit-scrollbar-thumb {
  background: #909399;
  border-radius: 2px;
}

.message-item {
  margin-bottom: 20px;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.message.self {
  flex-direction: row-reverse;
}

.message-content {
  max-width: 60%;
  padding: 10px;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.message.self .message-content {
  background-color: #95ec69;
}

.input-area {
  padding: 20px;
  border-top: 1px solid #dcdfe6;
}

.input-area .el-button {
  margin-top: 10px;
  float: right;
}

.resize-line {
  width: 4px;
  background-color: #dcdfe6;
  cursor: col-resize;
}

.resize-line:hover {
  background-color: #409eff;
}

.resize-line.horizontal {
  height: 4px;
  width: 100%;
  cursor: row-resize;
}
</style>











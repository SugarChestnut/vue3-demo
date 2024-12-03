
<template>
  <div class="wechat-container">
    <div class="chat-layout" ref="chatLayoutRef">
      <!-- 左侧联系人面板 -->
      <div class="left-panel" :style="{ width: leftPanelWidth + 'px' }">
        <div class="search-header">
          <el-input
            v-model="searchText"
            placeholder="搜索"
            prefix-icon="Search"
            clearable
          />
          <el-button circle class="add-contact-btn">
            <el-icon><Plus /></el-icon>
          </el-button>
        </div>
        <div class="contact-list" @mouseenter="showLeftScroll = true" @mouseleave="showLeftScroll = false">
          <div
            v-for="contact in contacts"
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
      <div class="right-panel">
        <div class="chat-header">
          <span>{{ currentContact?.name }}</span>
        </div>
        
        <div class="chat-content" :style="{ height: chatContentHeight + 'px' }" 
             @mouseenter="showRightScroll = true" 
             @mouseleave="showRightScroll = false"
             ref="chatContentRef"
             @scroll="handleScroll">
          <div v-for="message in currentMessages" :key="message.id" 
               class="message-item" :class="{ 'message-self': message.isSelf }">
            <el-avatar :size="36" :src="message.isSelf ? userAvatar : currentContact?.avatar" />
            <div class="message-bubble">{{ message.content }}</div>
          </div>
        </div>

        <!-- 拖动分隔线 -->
        <div class="resize-line horizontal" @mousedown="startResizeChat"></div>

        <div class="input-area" :style="{ height: inputAreaHeight + 'px' }">
          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="4"
            placeholder="请输入消息"
          />
          <el-button type="primary" @click="sendMessage">发送</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'

// 基础数据
const leftPanelWidth = ref(300)
const chatContentHeight = ref(400)
const inputAreaHeight = ref(150)
const searchText = ref('')
const inputMessage = ref('')
const showLeftScroll = ref(false)
const showRightScroll = ref(false)
const currentContact = ref(null)
const chatLayoutRef = ref(null)
const chatContentRef = ref(null)
const userAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'

// 生成示例联系人数据
const contacts = ref(Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `联系人 ${index + 1}`,
  avatar: `https://cube.elemecdn.com/${index % 3}/88/03b0d39583f48206768a7534e55bcpng.png`,
  lastMessage: `最后一条消息 ${index + 1}`
})))

// 生成示例聊天记录
const generateMessages = (contactId, page = 1) => {
  return Array.from({ length: 20 }, (_, index) => ({
    id: `${contactId}-${page}-${index}`,
    content: `这是第 ${page} 页的第 ${index + 1} 条消息`,
    isSelf: Math.random() > 0.5,
    timestamp: Date.now() - (index * 60000)
  }))
}

const messagesMap = ref(new Map())
const currentMessages = computed(() => {
  if (!currentContact.value) return []
  return messagesMap.value.get(currentContact.value.id) || []
})

// 选择联系人
const selectContact = (contact) => {
  currentContact.value = contact
  if (!messagesMap.value.has(contact.id)) {
    messagesMap.value.set(contact.id, generateMessages(contact.id))
  }
}

// 发送消息
const sendMessage = () => {
  if (!inputMessage.value.trim() || !currentContact.value) return
  
  const newMessage = {
    id: Date.now(),
    content: inputMessage.value,
    isSelf: true,
    timestamp: Date.now()
  }
  
  const messages = messagesMap.value.get(currentContact.value.id) || []
  messagesMap.value.set(currentContact.value.id, [...messages, newMessage])
  inputMessage.value = ''
  
  // 滚动到底部
  setTimeout(() => {
    if (chatContentRef.value) {
      chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight
    }
  }, 0)
}

// 处理滚动加载
const handleScroll = () => {
  if (!chatContentRef.value || !currentContact.value) return
  
  if (chatContentRef.value.scrollTop === 0) {
    const currentMessages = messagesMap.value.get(currentContact.value.id)
    const newMessages = generateMessages(currentContact.value.id, Math.floor(currentMessages.length / 20) + 1)
    messagesMap.value.set(currentContact.value.id, [...newMessages, ...currentMessages])
    
    // 保持滚动位置
    setTimeout(() => {
      if (chatContentRef.value) {
        chatContentRef.value.scrollTop = 100
      }
    }, 0)
  }
}

// 处理拖动调整大小
const startResizeLeft = (e) => {
  e.preventDefault()
  const startX = e.clientX
  const startWidth = leftPanelWidth.value
  
  const handleMouseMove = (e) => {
    const delta = e.clientX - startX
    leftPanelWidth.value = Math.max(200, Math.min(400, startWidth + delta))
  }
  
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const startResizeChat = (e) => {
  e.preventDefault()
  const startY = e.clientY
  const startContentHeight = chatContentHeight.value
  const startInputHeight = inputAreaHeight.value
  
  const handleMouseMove = (e) => {
    const delta = e.clientY - startY
    const totalHeight = startContentHeight + startInputHeight
    chatContentHeight.value = Math.max(200, Math.min(totalHeight - 100, startContentHeight + delta))
    inputAreaHeight.value = totalHeight - chatContentHeight.value
  }
  
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

onMounted(() => {
  // 默认选中第一个联系人
  if (contacts.value.length > 0) {
    selectContact(contacts.value[0])
  }
})
</script>

<style scoped>
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
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.left-panel {
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.search-header {
  padding: 16px;
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.contact-list {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
}

.contact-list::-webkit-scrollbar {
  width: 6px;
}

.contact-list::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}

.contact-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.contact-item:hover {
  background-color: #f5f5f5;
}

.contact-item.active {
  background-color: #e6f3ff;
}

.contact-info {
  flex: 1;
  overflow: hidden;
}

.contact-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.last-message {
  color: #999;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 500;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  scrollbar-width: thin;
}

.chat-content::-webkit-scrollbar {
  width: 6px;
}

.chat-content::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}

.message-item {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.message-self {
  flex-direction: row-reverse;
}

.message-bubble {
  background-color: #f0f0f0;
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 60%;
}

.message-self .message-bubble {
  background-color: #95ec69;
}

.input-area {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.resize-line {
  width: 4px;
  background-color: transparent;
  cursor: col-resize;
  transition: background-color 0.2s;
}

.resize-line:hover {
  background-color: #e0e0e0;
}

.resize-line.horizontal {
  height: 4px;
  width: auto;
  cursor: row-resize;
}

.contact-list {
  scrollbar-width: none;
}

.contact-list::-webkit-scrollbar {
  display: none;
}

.contact-list:hover::-webkit-scrollbar {
  display: block;
}

.chat-content {
  scrollbar-width: none;
}

.chat-content::-webkit-scrollbar {
  display: none;
}

.chat-content:hover::-webkit-scrollbar {
  display: block;
}
</style>















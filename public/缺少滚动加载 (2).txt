
<template>
  <div class="wechat-container">
    <div class="left-panel" :style="{ width: leftPanelWidth + 'px' }">
      <div class="search-header">
        <el-input
          v-model="searchText"
          placeholder="搜索"
          prefix-icon="el-icon-search"
          clearable
        />
        <el-button class="add-contact" circle>
          <el-icon><Plus /></el-icon>
        </el-button>
      </div>
      <div class="contact-list custom-scrollbar">
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
    
    <div class="resize-line" @mousedown="startResize('horizontal')"></div>
    
    <div class="right-panel" :style="{ width: `calc(100% - ${leftPanelWidth}px)` }">
      <div class="chat-header" v-if="currentContact">
        <span>{{ currentContact.name }}</span>
      </div>
      
      <div class="chat-content custom-scrollbar" ref="chatContent" @scroll="handleScroll">
        <div v-if="currentContact">
          <div
            v-for="message in currentMessages"
            :key="message.id"
            class="message"
            :class="{ 'message-self': message.isSelf }"
          >
            <el-avatar :size="36" :src="message.isSelf ? userAvatar : currentContact.avatar" />
            <div class="message-content">{{ message.content }}</div>
          </div>
        </div>
      </div>
      
      <div class="resize-line horizontal" @mousedown="startResize('vertical')"></div>
      
      <div class="input-area" :style="{ height: inputAreaHeight + 'px' }">
        <el-input
          v-model="messageText"
          type="textarea"
          :rows="4"
          placeholder="输入消息..."
        />
        <el-button type="primary" @click="sendMessage">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const leftPanelWidth = ref(300)
const inputAreaHeight = ref(150)
const searchText = ref('')
const messageText = ref('')
const currentContact = ref(null)
const userAvatar = 'https://placeholder.com/150'
const chatContent = ref(null)

// 生成示例联系人数据
const contacts = ref(Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `联系人 ${index + 1}`,
  avatar: `https://placeholder.com/150`,
  lastMessage: `最后一条消息 ${index + 1}`
})))

// 生成示例聊天记录
const messages = ref(new Map())
contacts.value.forEach(contact => {
  messages.value.set(contact.id, Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    content: `这是一条示例消息 ${index + 1}`,
    isSelf: Math.random() > 0.5,
    timestamp: new Date().getTime() - (1000 * 60 * index)
  })))
})

const currentMessages = computed(() => 
  currentContact.value ? messages.value.get(currentContact.value.id) : []
)

const selectContact = (contact) => {
  currentContact.value = contact
  setTimeout(() => {
    if (chatContent.value) {
      chatContent.value.scrollTop = chatContent.value.scrollHeight
    }
  }, 0)
}

const sendMessage = () => {
  if (!messageText.value.trim() || !currentContact.value) return
  
  const newMessage = {
    id: currentMessages.value.length + 1,
    content: messageText.value,
    isSelf: true,
    timestamp: new Date().getTime()
  }
  
  messages.value.get(currentContact.value.id).push(newMessage)
  messageText.value = ''
  
  setTimeout(() => {
    if (chatContent.value) {
      chatContent.value.scrollTop = chatContent.value.scrollHeight
    }
  }, 0)
}

const startResize = (direction) => {
  const handleMouseMove = (e) => {
    if (direction === 'horizontal') {
      const newWidth = e.clientX
      if (newWidth >= 200 && newWidth <= 400) {
        leftPanelWidth.value = newWidth
      }
    } else {
      const container = document.querySelector('.right-panel')
      const containerRect = container.getBoundingClientRect()
      const newHeight = containerRect.bottom - e.clientY
      if (newHeight >= 100 && newHeight <= 300) {
        inputAreaHeight.value = newHeight
      }
    }
  }

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleScroll = () => {
  if (chatContent.value.scrollTop === 0) {
    // 这里可以实现加载更多历史消息的逻辑
    console.log('加载更多消息')
  }
}

onMounted(() => {
  selectContact(contacts.value[0])
})
</script>

<style scoped>
.wechat-container {
  width: 1200px;
  height: 720px;
  margin: 0 auto;
  display: flex;
  border: 1px solid #dcdfe6;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}

.left-panel {
  border-right: 1px solid #dcdfe6;
  display: flex;
  flex-direction: column;
}

.search-header {
  padding: 10px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
}

.add-contact {
  margin-left: 10px;
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
  background-color: #f5f7fa;
}

.contact-item.active {
  background-color: #e6f1fc;
}

.contact-info {
  margin-left: 10px;
  flex: 1;
}

.contact-name {
  font-weight: bold;
}

.last-message {
  color: #909399;
  font-size: 12px;
  margin-top: 4px;
}

.resize-line {
  width: 4px;
  cursor: col-resize;
  background-color: #f0f0f0;
}

.resize-line.horizontal {
  height: 4px;
  cursor: row-resize;
  width: 100%;
}

.right-panel {
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 15px;
  border-bottom: 1px solid #dcdfe6;
  font-weight: bold;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.message-self {
  flex-direction: row-reverse;
}

.message-content {
  margin: 0 10px;
  padding: 10px;
  background-color: #f4f4f5;
  border-radius: 4px;
  max-width: 60%;
}

.message-self .message-content {
  background-color: #95ec69;
}

.input-area {
  padding: 10px;
  border-top: 1px solid #dcdfe6;
  display: flex;
  flex-direction: column;
}

.input-area .el-button {
  align-self: flex-end;
  margin-top: 10px;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #909399 transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #909399;
  border-radius: 3px;
}

.custom-scrollbar:not(:hover)::-webkit-scrollbar-thumb {
  background-color: transparent;
}
</style>














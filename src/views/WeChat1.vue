
<template>
    <div class="wechat-container">
      <div class="chat-layout" ref="chatLayoutRef">
        <!-- 左侧联系人面板 -->
        <div class="contact-panel" :style="{ width: leftWidth + 'px' }">
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
            </div>
          </div>
        </div>
  
        <!-- 分隔线 -->
        <div
          class="resize-line vertical"
          @mousedown="startResizing('horizontal', $event)"
        ></div>
  
        <!-- 右侧聊天面板 -->
        <div class="chat-panel">
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
            <div v-for="msg in currentMessages" :key="msg.id" class="message-item">
              <div
                class="message-content"
                :class="{ 'message-self': msg.isSelf }"
              >
                <el-avatar
                  :size="30"
                  :src="msg.isSelf ? userAvatar : currentContact?.avatar"
                />
                <div class="message-bubble">{{ msg.content }}</div>
              </div>
            </div>
          </div>
  
          <!-- 分隔线 -->
          <div
            class="resize-line horizontal"
            @mousedown="startResizing('vertical', $event)"
          ></div>
  
          <!-- 输入区域 -->
          <div class="input-area">
            <el-input
              v-model="inputMessage"
              type="textarea"
              :rows="4"
              placeholder="请输入消息"
              @keyup.enter.exact="sendMessage"
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
  const leftWidth = ref(300)
  const messageHeight = ref(400)
  const searchText = ref('')
  const inputMessage = ref('')
  const currentContact = ref(null)
  const currentMessages = ref([])
  const isResizing = ref(false)
  const resizeType = ref(null)
  const chatLayoutRef = ref(null)
  const messageContainer = ref(null)
  const userAvatar = 'https://avatars.githubusercontent.com/u/1?v=4'
  
  // 模拟数据
  const contacts = ref([
    {
      id: 1,
      name: '张三',
      avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
      lastMessage: '今天天气真不错！'
    },
    {
      id: 2,
      name: '李四',
      avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
      lastMessage: '下班一起吃饭吗？'
    },
    // 添加更多联系人...
  ])
  
  // 模拟消息数据
  const messagesList = ref(new Map())
  
  // 初始化一些示例消息
  const initializeMessages = () => {
    contacts.value.forEach(contact => {
      const messages = []
      for (let i = 1; i <= 50; i++) {
        messages.push({
          id: `${contact.id}-${i}`,
          content: `这是第 ${i} 条消息`,
          isSelf: i % 3 === 0,
          timestamp: new Date().getTime() - i * 1000000
        })
      }
      messagesList.value.set(contact.id, messages)
    })
  }
  
  // 过滤联系人
  const filteredContacts = computed(() => {
    if (!searchText.value) return contacts.value
    return contacts.value.filter(contact =>
      contact.name.toLowerCase().includes(searchText.value.toLowerCase())
    )
  })
  
  // 选择联系人
  const selectContact = (contact) => {
    currentContact.value = contact
    currentMessages.value = messagesList.value.get(contact.id) || []
    setTimeout(() => {
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight
      }
    }, 0)
  }
  
  // 发送消息
  const sendMessage = () => {
    if (!inputMessage.value.trim() || !currentContact.value) return
    
    const newMessage = {
      id: Date.now(),
      content: inputMessage.value,
      isSelf: true,
      timestamp: new Date().getTime()
    }
    
    currentMessages.value.push(newMessage)
    const contactMessages = messagesList.value.get(currentContact.value.id)
    contactMessages.push(newMessage)
    
    inputMessage.value = ''
    
    setTimeout(() => {
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight
      }
    }, 0)
  }
  
  // 处理面板拖拽调整大小
  const startResizing = (type, event) => {
    isResizing.value = true
    resizeType.value = type
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', stopResizing)
  }
  
  const handleMouseMove = (event) => {
    if (!isResizing.value) return
  
    if (resizeType.value === 'horizontal') {
      const newWidth = event.clientX - chatLayoutRef.value.getBoundingClientRect().left
      if (newWidth >= 200 && newWidth <= 400) {
        leftWidth.value = newWidth
      }
    } else {
      const containerHeight = chatLayoutRef.value.getBoundingClientRect().height
      const inputAreaHeight = 120
      const headerHeight = 60
      const newHeight = containerHeight - event.clientY + chatLayoutRef.value.getBoundingClientRect().top - headerHeight
      if (newHeight >= 200 && newHeight <= containerHeight - inputAreaHeight - headerHeight) {
        messageHeight.value = newHeight
      }
    }
  }
  
  const stopResizing = () => {
    isResizing.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', stopResizing)
  }
  
  // 处理消息滚动加载
  const handleScroll = () => {
    if (messageContainer.value.scrollTop === 0) {
      // 模拟加载更多消息
      const oldMessages = []
      for (let i = 1; i <= 10; i++) {
        oldMessages.push({
          id: `old-${Date.now()}-${i}`,
          content: `这是更早的消息 ${i}`,
          isSelf: i % 2 === 0,
          timestamp: new Date().getTime() - 1000000 * i
        })
      }
      currentMessages.value.unshift(...oldMessages)
      messageContainer.value.scrollTop = 50
    }
  }
  
  // 生命周期钩子
  onMounted(() => {
    initializeMessages()
    if (contacts.value.length > 0) {
      selectContact(contacts.value[0])
    }
  })
  
  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', stopResizing)
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
    display: flex;
    width: 1200px;
    height: 720px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .contact-panel {
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e0e0e0;
    background-color: #f5f5f5;
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
    background-color: #e8e8e8;
  }
  
  .contact-item.active {
    background-color: #e0e0e0;
  }
  
  .contact-info {
    margin-left: 10px;
    flex: 1;
  }
  
  .contact-name {
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .last-message {
    font-size: 12px;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .chat-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .chat-header {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid #e0e0e0;
    font-weight: bold;
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }
  
  .message-item {
    margin-bottom: 20px;
  }
  
  .message-content {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  
  .message-content.message-self {
    flex-direction: row-reverse;
  }
  
  .message-bubble {
    max-width: 60%;
    padding: 10px 15px;
    border-radius: 4px;
    background-color: #f0f0f0;
    word-break: break-word;
  }
  
  .message-self .message-bubble {
    background-color: #95ec69;
  }
  
  .input-area {
    padding: 20px;
    border-top: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .resize-line {
    background-color: #e0e0e0;
    transition: background-color 0.3s;
  }
  
  .resize-line:hover {
    background-color: #1890ff;
  }
  
  .resize-line.vertical {
    width: 4px;
    cursor: col-resize;
  }
  
  .resize-line.horizontal {
    height: 4px;
    cursor: row-resize;
  }
  
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
  </style>
  
  
  
  
  
  
  
  
  
  
  
  
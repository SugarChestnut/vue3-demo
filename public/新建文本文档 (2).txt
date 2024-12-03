
template
  div class=wechat-container
    div class=chat-layout ref=splitPane
      !-- 左侧联系人列表 --
      div class=contact-panel style={ width leftWidth + 'px' }
        div class=search-box
          el-input
            v-model=searchText
            placeholder=搜索
            prefix-icon=Search
            clearable
          
        div
        div class=contact-list custom-scrollbar
          div
            v-for=contact in filteredContacts
            key=contact.id
            class=contact-item
            class={ active currentContact.id === contact.id }
            @click=selectContact(contact)
          
            el-avatar size=40 src=contact.avatar 
            div class=contact-info
              div class=contact-name{{ contact.name }}div
              div class=last-message{{ contact.lastMessage }}div
            div
          div
        div
      div

      !-- 拖动分隔线 --
      div class=resize-line @mousedown=startResize('horizontal')div

      !-- 右侧聊天区域 --
      div class=chat-panel
        !-- 联系人信息 --
        div class=chat-header
          span{{ currentContact.name }}span
        div

        !-- 聊天记录 --
        div 
          class=chat-messages custom-scrollbar 
          ref=messageContainer
          style={ height messageHeight + 'px' }
          @scroll=handleScroll
        
          div v-for=msg in currentMessages key=msg.id class=message-item
            div class=['message', msg.isSelf  'self'  'other']
              el-avatar size=30 src=msg.isSelf  userAvatar  currentContact.avatar 
              div class=message-content{{ msg.content }}div
            div
          div
        div

        !-- 拖动分隔线 --
        div class=resize-line horizontal @mousedown=startResize('vertical')div

        !-- 输入区域 --
        div class=input-area style={ height inputHeight + 'px' }
          el-input
            v-model=messageText
            type=textarea
            rows=4
            placeholder=请输入消息
            resize=none
          
          el-button type=primary @click=sendMessage发送el-button
        div
      div
    div
  div
template

script setup
import { ref, computed, onMounted, onUnmounted } from 'vue'

 示例数据
const contacts = ref([
  { id 1, name '张三', avatar 'httpsplacekitten.com4040', lastMessage '晚上一起吃饭吗？' },
  { id 2, name '李四', avatar 'httpsplacekitten.com4141', lastMessage '项目进展如何？' },
  { id 3, name '王五', avatar 'httpsplacekitten.com4242', lastMessage '周末去打球' },
  { id 4, name '赵六', avatar 'httpsplacekitten.com4343', lastMessage '文件我已经发送了' },
  { id 5, name '小明', avatar 'httpsplacekitten.com4444', lastMessage '好的，明天见' },
  { id 6, name '小红', avatar 'httpsplacekitten.com4545', lastMessage '收到了吗？' },
  { id 7, name '小华', avatar 'httpsplacekitten.com4646', lastMessage '准时到哦' },
  { id 8, name '小李', avatar 'httpsplacekitten.com4747', lastMessage '这个周末有空吗' },
  { id 9, name '小张', avatar 'httpsplacekitten.com4848', lastMessage '记得带伞' },
  { id 10, name '小王', avatar 'httpsplacekitten.com4949', lastMessage '路上小心' },
  { id 11, name '小赵', avatar 'httpsplacekitten.com5050', lastMessage '晚安' },
  { id 12, name '小孙', avatar 'httpsplacekitten.com5151', lastMessage '早上好' },
  { id 13, name '小周', avatar 'httpsplacekitten.com5252', lastMessage '下班了吗' },
  { id 14, name '小吴', avatar 'httpsplacekitten.com5353', lastMessage '辛苦了' },
  { id 15, name '小郑', avatar 'httpsplacekitten.com5454', lastMessage '新年快乐' },
])

 状态变量
const searchText = ref('')
const currentContact = ref(null)
const messageText = ref('')
const leftWidth = ref(300)
const messageHeight = ref(400)
const inputHeight = ref(150)
const userAvatar = 'httpsplacekitten.com3939'
const messages = ref({})
const isResizing = ref(false)
const resizeType = ref(null)

 计算属性
const filteredContacts = computed(() = {
  return contacts.value.filter(contact =
    contact.name.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

const currentMessages = computed(() = {
  if (!currentContact.value) return []
  if (!messages.value[currentContact.value.id]) {
     生成示例消息
    messages.value[currentContact.value.id] = Array.from({ length 20 }, (_, i) = ({
      id i,
      content `这是第 ${i + 1} 条消息`,
      isSelf Math.random()  0.5,
      timestamp new Date().getTime() - (20 - i)  1000000
    }))
  }
  return messages.value[currentContact.value.id]
})

 方法
const selectContact = (contact) = {
  currentContact.value = contact
}

const sendMessage = () = {
  if (!messageText.value.trim()  !currentContact.value) return
  
  const newMessage = {
    id Date.now(),
    content messageText.value,
    isSelf true,
    timestamp Date.now()
  }
  
  if (!messages.value[currentContact.value.id]) {
    messages.value[currentContact.value.id] = []
  }
  messages.value[currentContact.value.id].push(newMessage)
  messageText.value = ''
}

const startResize = (type) = {
  isResizing.value = true
  resizeType.value = type
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

const handleResize = (e) = {
  if (!isResizing.value) return
  
  if (resizeType.value === 'horizontal') {
    const newWidth = e.clientX - document.querySelector('.wechat-container').getBoundingClientRect().left
    leftWidth.value = Math.max(200, Math.min(400, newWidth))
  } else {
    const containerHeight = 720 - 60  总高度减去头部高度
    const mouseY = e.clientY - document.querySelector('.chat-messages').getBoundingClientRect().top
    messageHeight.value = Math.max(200, Math.min(containerHeight - 100, mouseY))
    inputHeight.value = containerHeight - messageHeight.value
  }
}

const stopResize = () = {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

const handleScroll = () = {
   这里实现懒加载逻辑
  const container = this.$refs.messageContainer
  if (container.scrollTop === 0) {
     加载更多历史消息
  }
}

 生命周期钩子
onMounted(() = {
  selectContact(contacts.value[0])
})

onUnmounted(() = {
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
})
script

style scoped
.wechat-container {
  width 1200px;
  height 720px;
  margin 0 auto;
  position fixed;
  top 50%;
  left 50%;
  transform translate(-50%, -50%);
  background #f5f5f5;
  border-radius 4px;
  box-shadow 0 2px 12px rgba(0, 0, 0, 0.1);
}

.chat-layout {
  display flex;
  height 100%;
}

.contact-panel {
  background #fff;
  border-right 1px solid #e6e6e6;
  display flex;
  flex-direction column;
}

.search-box {
  padding 10px;
  border-bottom 1px solid #e6e6e6;
}

.contact-list {
  flex 1;
  overflow-y auto;
}

.contact-item {
  display flex;
  align-items center;
  padding 10px;
  cursor pointer;
  transition background-color 0.3s;
}

.contact-itemhover {
  background-color #f5f5f5;
}

.contact-item.active {
  background-color #e6e6e6;
}

.contact-info {
  margin-left 10px;
  flex 1;
}

.contact-name {
  font-weight bold;
}

.last-message {
  color #999;
  font-size 12px;
  margin-top 4px;
}

.chat-panel {
  flex 1;
  display flex;
  flex-direction column;
}

.chat-header {
  height 60px;
  background #fff;
  border-bottom 1px solid #e6e6e6;
  display flex;
  align-items center;
  padding 0 20px;
  font-weight bold;
}

.chat-messages {
  flex 1;
  overflow-y auto;
  padding 20px;
  background #f5f5f5;
}

.message-item {
  margin-bottom 20px;
}

.message {
  display flex;
  align-items flex-start;
}

.message.self {
  flex-direction row-reverse;
}

.message-content {
  max-width 60%;
  margin 0 10px;
  padding 10px;
  border-radius 4px;
  word-break break-all;
}

.message.self .message-content {
  background #95ec69;
}

.message.other .message-content {
  background #fff;
}

.input-area {
  background #fff;
  padding 10px;
  display flex;
  flex-direction column;
}

.input-area .el-button {
  align-self flex-end;
  margin-top 10px;
}

.resize-line {
  width 4px;
  background transparent;
  cursor col-resize;
  transition background-color 0.3s;
}

.resize-linehover {
  background #e6e6e6;
}

.resize-line.horizontal {
  height 4px;
  width 100%;
  cursor row-resize;
}

.custom-scrollbar {
  scrollbar-width thin;
  scrollbar-color rgba(0, 0, 0, 0.3) transparent;
}

.custom-scrollbar-webkit-scrollbar {
  width 6px;
}

.custom-scrollbar-webkit-scrollbar-track {
  background transparent;
}

.custom-scrollbar-webkit-scrollbar-thumb {
  background-color rgba(0, 0, 0, 0.3);
  border-radius 3px;
  border none;
}

.custom-scrollbar-webkit-scrollbar-thumbhover {
  background-color rgba(0, 0, 0, 0.5);
}

 只在hover时显示滚动条 
.contact-listnot(hover)-webkit-scrollbar-thumb,
.chat-messagesnot(hover)-webkit-scrollbar-thumb {
  background transparent;
}
style






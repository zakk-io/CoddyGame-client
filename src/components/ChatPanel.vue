<template>
  <div
    class="fixed top-0 right-0 h-full w-80 bg-gray-900 text-gray-100 shadow-lg flex flex-col z-50"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-700">
      <h3 class="font-semibold">Team Chat</h3>
      <button @click="$emit('close')" class="text-gray-400 hover:text-gray-200">
        &times;
      </button>
    </div>

    <!-- Messages -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-auto p-4 space-y-4 bg-gray-800"
    >

      <!-- Actual chat messages -->
      <div v-for="msg in messages" :key="msg.id">
        <div
          :class="[
            'flex items-start space-x-2',
            msg.userId === currentUserId ? 'justify-end' : 'justify-start'
          ]"
        >
          <!-- Other user: avatar on left -->
          <template v-if="msg.userId !== currentUserId">
            <img
              :src="msg.avatar"
              class="h-8 w-8 rounded-full"
              alt="avatar"
            />
            <div>
              <div class="text-xs font-medium text-gray-400">
                {{ msg.userName }}
              </div>
              <div class="mt-1 px-3 py-2 bg-gray-700 rounded-lg text-gray-100">
                {{ msg.text }}
              </div>
            </div>
          </template>

          <!-- You: avatar on right -->
          <template v-else>
            <div>
              <div class="text-xs font-medium text-gray-400 text-right">
                {{ msg.userName }}
              </div>
              <div class="mt-1 px-3 py-2 bg-indigo-600 rounded-lg text-white">
                {{ msg.text }}
              </div>
            </div>
            <img
              :src="msg.avatar"
              class="h-8 w-8 rounded-full"
              alt="avatar"
            />
          </template>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="p-4 border-t border-gray-700 flex items-center space-x-2 bg-gray-900">
      <textarea
        v-model="newMessage"
        @keyup.enter.ctrl.prevent="send"
        rows="1"
        placeholder="Type a message…"
        class="flex-1 px-3 py-2 bg-gray-800 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none overflow-auto max-h-24"
      ></textarea>
      <button
        @click="send"
        class="p-2 bg-indigo-500 hover:bg-indigo-600 rounded"
        title="Send"
      >
        <i class="fa-solid fa-paper-plane text-white"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { io } from 'socket.io-client'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()

let   currentUserId = null

const emit = defineEmits(['close'])

const API_BASE_URI = import.meta.env.VITE_API_BASE_URI
const socket = io(API_BASE_URI)


const codebaseId        = route.params.codebase_id


socket.emit('join_chat', codebaseId)

const messages = ref([])
const newMessage = ref('')
const messagesContainer = ref(null)



socket.on('brodcast_chat_message', (msg) => {
    messages.value.push(msg)
    nextTick(() => {
      const c = messagesContainer.value
      c.scrollTop = c.scrollHeight
    })
})




async function send() {
  try {
      const text = newMessage.value.trim()
      if (!text) return


      const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/resources/${codebaseId}/messages` , {
        method: 'POST',
        body: JSON.stringify({text}),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'     
      })

    if (!response.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`)
    }


      const data = await response.json()
      if(data.code === "201"){
        const msg = {
          id: data.message._id,
          userId: data.message.sender_id,
          userName: data.message.sender_username,
          avatar:  data.message.sender_avatar,
          text
        }

        //currentUserId = data.message.sender_id

        messages.value.push(msg)
        socket.emit('emit_chat_message', codebaseId,msg)
        newMessage.value = ''
      }

  } catch (error) {
    console.error('Error creating message:', error)
  }
}



async function fetchMessages() {
  try {
    const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/resources/${codebaseId}/messages` , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'     
    })

    if (!response.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`)
    }

    const data = await response.json()
    if (data.code === "200") {
      messages.value = data.messages.map(msg => ({
        id: msg._id,
        userId: msg.sender._id,
        userName: msg.sender.username,
        avatar: msg.sender.avatar,
        text: msg.text
      }))

      nextTick(() => {
        const c = messagesContainer.value
        c.scrollTop = c.scrollHeight
      })
    }
  } catch (error) {
    console.error('Error creating message:', error)
  }
}



async function getSenderId () {
  try {
    const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/resources/${codebaseId}/messages/sender-id/me` , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'     
    })

    const data = await response.json()
    if (data.code === "200") {
      currentUserId = data.sender_id
   }
  } catch (error) {
    console.error('Error creating message:', error)
  }
}



onMounted(async () => {
  try {
    await Promise.all([ getSenderId(), fetchMessages() ])
  } catch (error) {
    console.error('Error during component mount:', error)
  }
})
</script>

<style scoped>
.messagesContainer::-webkit-scrollbar {
  width: 6px;
}
.messagesContainer::-webkit-scrollbar-thumb {
  background-color: #4b5563;
  border-radius: 3px;
}
</style>
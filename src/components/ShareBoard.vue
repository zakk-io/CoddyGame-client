<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div class="bg-gray-800 rounded-lg w-96 p-6">
        <h2 class="text-xl font-semibold text-gray-100 mb-4">Share Board</h2>
        <!-- Rename Field -->
        <div class="mb-4">
          <label class="block text-gray-300 mb-1">Board Name</label>
          <input
            v-model="boardName"
            type="text"
            class="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <!-- Invite Emails -->
        <div class="mb-4">
          <label class="block text-gray-300 mb-1">Share by Email</label>
          <input
            v-model="inviteEmail"
            type="email"
            placeholder="user@example.com"
            class="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <!-- Copy Link -->
        <div class="flex items-center mb-6">
          <div class="flex-1 bg-gray-700 px-3 py-2 rounded-l-lg text-gray-300 text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
            {{ inviteLink }}
          </div>
          <button
            @click="copyLink"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-r-lg"
          >
            <i class="fa-solid fa-copy"></i>
          </button>
        </div>
        <!-- Actions -->
        <div class="flex justify-end space-x-2">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            @click="sendInvites"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const props = defineProps({ boardTitle: String })
  const emit = defineEmits(['close', 'shared'])
  
  const boardName = ref(props.boardTitle || '')
  const inviteEmail = ref('')
  const inviteLink = ref('https://app.example.com/board/12345')
  
  function copyLink() {
    navigator.clipboard.writeText(inviteLink.value)
  }
  
  function sendInvites() {
    console.log('Inviting:', inviteEmail.value, 'to board', boardName.value)
    emit('shared', { boardName: boardName.value, email: inviteEmail.value })
    emit('close')
  }



  </script>
  
  <style scoped>
  /* No additional styles needed */
  </style>
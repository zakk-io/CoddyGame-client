<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div class="bg-gray-800 rounded-lg w-96 p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-100">Board Details</h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-200">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <!-- Content -->
        <div class="flex space-x-4 mb-6">
          <!-- Thumbnail -->
          <div class="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
            <i :class="['fa-solid',BoardsIcon[board.language || board.type]?.icon,'text-2xl']"></i>

          </div>
          <!-- Info -->
          <div class="flex-1 text-gray-300">
            <p><span class="font-medium text-gray-100">{{ board.name }}</span></p>
            <p><span class="font-medium">Type:</span> {{ board.language || board.type }}</p>
            <p><span class="font-medium">Owner:</span> {{ board.creator.username }}</p>
            <p><span class="font-medium">Created:</span> {{ formatDate(board.createdAt) }}</p>
            <p><span class="font-medium">Last modified:</span> {{ timeAgo(board.updatedAt) }}</p>
          </div>
        </div>
        <!-- Actions -->
        <div class="flex justify-end space-x-2">
          <button @click="$emit('open', board.id)" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg">Open Board</button>
          <button @click="$emit('close')" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({ board: Object })
  const emit = defineEmits(['close','open'])



  const BoardsIcon = {
  python:    { icon: 'fa-brands fa-python mr-2 text-[#FFD43B]'},
  cpp:    { icon: 'fa-solid fa-c mr-2 text-[#ff0000]'},
  java:    { icon: 'fa-brands fa-java mr-2 text-[#74C0FC]'},
  javascript:    { icon: 'fa-brands fa-js mr-2 text-[#FFD43B]'},
  php:    { icon: 'fa-brands fa-php mr-2 text-[#B197FC]'},

  document:    { icon: 'fa-file-lines text-blue-500'},
  whiteboard:     { icon: 'fa-project-diagram text-yellow-500'},
}




import { formatDistanceToNow } from 'date-fns'

// helper you can call from the template:
const timeAgo = isoString =>
  formatDistanceToNow(new Date(isoString), { addSuffix: true })

const formatDate = iso =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',   // "May" or "5" if you prefer numeric
    day: 'numeric'
  })
  </script>
  
  <style scoped>
  /* No extra styles */
  </style>
  
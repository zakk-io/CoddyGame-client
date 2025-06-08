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
            <i class="fa-solid fa-th-large text-gray-400 text-2xl"></i>
          </div>
          <!-- Info -->
          <div class="flex-1 text-gray-300">
            <p><span class="font-medium text-gray-100">{{ board.title }}</span></p>
            <p class="text-sm text-gray-400 mb-2">{{ board.description }}</p>
            <p><span class="font-medium">Owner:</span> {{ board.owner }}</p>
            <p><span class="font-medium">Created:</span> {{ board.created }}</p>
            <p><span class="font-medium">Last modified:</span> {{ board.modified }}</p>
            <p><span class="font-medium">Team:</span> {{ board.location }}</p>
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
  </script>
  
  <style scoped>
  /* No extra styles */
  </style>
  
<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div class="bg-gray-800 rounded-lg w-96 p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-100">Delete board?</h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-200">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <!-- Body -->
        <div class="mb-4">
          <p class="text-gray-300">
            This will delete <span class="font-medium text-white">{{ boardName }}</span>.
          </p>
        </div>
        <div class="mb-6 p-4 bg-gray-700 rounded-lg">
          <p class="text-gray-400 text-sm">
            Deleted boards are not able to be restored.
          </p>
        </div>
        <!-- Actions -->
        <div class="flex justify-end space-x-2">
          <button @click="$emit('close')" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg">Cancel</button>
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg">Delete</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({ boardName: String })
  const emit = defineEmits(['close', 'deleted'])
  
  function confirmDelete() {
    emit('deleted', props.boardName)
    emit('close')
  }
  </script>
  
  <style scoped>
  /* No additional styles */
  </style>
  
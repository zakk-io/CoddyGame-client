<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div class="bg-gray-800 rounded-lg w-96 p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-100">Rename board</h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-200">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <!-- Body -->
        <div class="mb-6">
          <label class="block text-gray-300 mb-2">Enter a new board name:</label>
          <input
            v-model="newName"
            type="text"
            class="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <!-- Actions -->
        <div class="flex justify-end space-x-2">
          <button
            @click="confirmRename"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
          >
            Ok
          </button>
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    boardName: String,
    boardId:   String,
  })

  const emit = defineEmits(['close', 'renamed'])
  
  const newName = ref(props.boardName || '')
  const boardId = ref(props.boardId)
  

  
  // Keep local state in sync if prop changes
  watch(() => props.boardName, (val) => {
    newName.value = val
  })
  
  import {useRoute } from 'vue-router'
  const route = useRoute()


  const API_BASE_URI = import.meta.env.VITE_API_BASE_URI


import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();

  //rename board
  const renameBoard = async () => {
    try {
      const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/resources/${boardId.value}`,{
      method: 'PATCH',
      body: JSON.stringify({"name":newName.value}),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'     
    }) 

    const result = await response.json()
    if (result.code === 200){
      emit('renamed', { 
      id:     props.boardId, 
      name:   newName.value 
    })
    emit('close')
    }
    else if (result.code === 403) {
        $toast.error("you are allowed to rename only your own boards");
    }
    } catch (error) {
      $toast.error("Server error. Please try again.");
      console.error("Rename error:", error);
      return;
      
    }

    //handle 404,400,403,500 errors
  }

  function confirmRename() {
    renameBoard()
  }
  </script>
  
  <style scoped>
  /* Scoped styles if needed */
  </style>
  
<!-- components/AiAssistant.vue -->
<template>
    <div class="relative">
      <!-- Trigger Button -->
      <button
        @click="toggle()"
        class="p-2 hover:bg-gray-700 rounded-full text-gray-100 transition"
        title="AI Assistant"
      >
        <i class="fa-solid fa-robot"></i>
      </button>
  
      <!-- Backdrop -->
      <div
        v-if="show"
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        @click="hide()"
      />
  
      <!-- Pop-over -->
      <div
        v-if="show"
        class="absolute top-full right-0 mt-2 w-64 bg-gray-800 text-gray-100 rounded-lg shadow-lg z-50 overflow-hidden"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-2 border-b border-gray-700">
          <h3 class="font-semibold">CoddyAi</h3>
          <button @click="hide()" class="text-gray-400 hover:text-gray-200">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
  
        <!-- Body -->
        <div class="p-4">
          <textarea
            v-model="idea"
            rows="4"
            placeholder="what is your idea?"
            class="w-full bg-gray-700 text-gray-100 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
  
          <button
            @click="apply()"
            class="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded transition"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { GoogleGenAI } from "@google/genai";


  const props = defineProps({
    codebaseCode: {
      type: String,
      default: ''
    }
  })

  // show/hide state
  const show = ref(false)
  const idea = ref('')
  
  // expose a custom event
  const emit = defineEmits(['AiResponse'])
  
  // toggle pop-over
  function toggle() {
    show.value = !show.value
  }
  
  // hide & reset
  function hide() {
    show.value = false
    idea.value = ''
  }
  


  const groundingTool = {
    googleSearch: {},
  };
  
  const CoddyAi = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API });

  async function apply() {
    const contents = [];
    
    //user idea
    contents.push({
      role: 'user',
      parts: [{
        text: idea.value.trim(),
      }]
    });

    //codebase content
    contents.push({
      role: 'user',
      parts: [{
        text: props.codebaseCode.trim(),
      }]
    });


    const response = await CoddyAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        tools: [groundingTool],
      },
    });

    const text = response.text

    emit('AiResponse', text)
    hide()
  }
  </script>
  
  <style scoped>
  /* Tailwind handles styling */
  </style>
  
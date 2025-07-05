<template>
  <nav class="bg-gray-900 text-gray-100 px-6 py-3 flex items-center border-b border-t border-gray-700">
    <!-- Left: Board Avatar + Name + Info -->
    <div class="flex items-center space-x-3">
      <i
        :class="[
          'h-10 w-10  flex items-center justify-center text-xl',
          boardIcon
        ]"
      ></i>

      <input
        type="text"
        :value="boardName"
        class="bg-gray-900 border-blue-600  px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <!-- Spacer -->
    <div class="flex-1"></div>

    <!-- Right: Icon Buttons -->
    <div class="flex items-center space-x-4">
      <button  @click="executeCode" class="p-2 hover:bg-indigo-500 rounded text-sm" title="Run">
        <i class="fa-solid fa-play"></i>
      </button>
      <CoddyAi @AiResponse="handleAi"
               :codebaseCode="codebaseCode"
      />

      <button class="p-2 hover:bg-gray-600 rounded text-sm" title="Share">
        <i class="fa-solid fa-share-alt"></i>
      </button>
      <button class="p-2 hover:bg-gray-600 rounded text-sm" title="Export">
        <i class="fa-solid fa-download"></i>
      </button>
      <button class="p-2 hover:bg-gray-600 rounded text-sm" title="chatting">
        <i class="fa-solid fa-message"></i>
      </button>
    </div>
  </nav>
</template>

<script setup>

  import { watch,ref } from 'vue'
  import CoddyAi from '@/components/CoddyAi.vue'

  

  const emit = defineEmits(['output','CoddyAiresponse'])

  const props = defineProps({
    boardId: {
      type: String,
      required: true
    },

    boardName: {
      type: String,
      default: 'Untitled'
    },

    boardIcon: {
      type: String,
      default: 'https://via.placeholder.com/32'
    },

    code: {
      type: String,
      default: ''
    },

    language: {
      type: Object,
    },

    userInput: {
      type: String,
      default: ''
    }

  })


  const version = ref('')  
  const codebaseCode = ref('') // This will hold the code for AI assistant

  watch(
  () => props.language,         // watch the inner value
  async (lang) => {
    if (!lang) return                // ignore null at first render
    const runtimes = await fetch('https://emkc.org/api/v2/piston/runtimes')
                         .then(r => r.json())
    version.value = runtimes.find(r => r.language === lang.name)?.version
  },
  { immediate: true }
)

watch(
  () => props.code,               // watch the inner value
  (code) => {
    if (!code) return                // ignore null at first render
    codebaseCode.value = code        // update the codebaseCode ref
  },
  { immediate: true }
)


  async function executeCode() {
  try {

  const payload = {
    language: props.language.name,
    version: version.value,
    stdin: props.userInput || '',
    files: [{ name: `${props.boardName}`, content: props.code }],
  };

  const res = await fetch(`https://emkc.org/api/v2/piston/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  console.log(data.run.output);
  emit('output', data.run.output) 
  } catch (error) {
    console.error("Error executing code:", error);
    emit('output', String(err)) 
  }
  }



  // Handle AI Assistant apply event
function handleAi(text) {
  console.log("AI Response - BoardNavbar:", text);

  emit('CoddyAiresponse',text)
}

</script>

<style scoped>
/* Navbar shadow for SaaS feel */
nav {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}
</style>

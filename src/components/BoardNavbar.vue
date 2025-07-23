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
      <button v-if="boardType === 'codebase'"  @click="executeCode" class="p-2 hover:bg-indigo-500 rounded text-sm" title="Run">
        <i class="fa-solid fa-play"></i>
      </button>
      <CoddyAi @AiResponse="handleAi"
               :content="content"
      />

      <button @click="openShare" class="p-2 hover:bg-gray-600 rounded" title="Share">
        <i class="fa-solid fa-share-alt"></i>
      </button>
      <button @click="handelExport" class="p-2 hover:bg-gray-600 rounded text-sm" title="Export">
        <i class="fa-solid fa-download"></i>
      </button>
      <button
           v-if="boardType === 'codebase'"
           class="p-2 hover:bg-gray-600 rounded text-sm"
           title="Chat"
           @click="$emit('toggleChat')"
         >
           <i class="fa-solid fa-message"></i>
      </button>
    </div>
  </nav>

  <!-- Share Modal -->
  <ShareBoard
    v-if="showShare"
    :boardTitle="localBoardName"
    :boardId="boardId"
    :boardType="boardType"
    @close="closeShare"
    @shared="onShared"
  />
</template>

<script setup>

  import { watch,ref,computed } from 'vue'
  import { useRoute } from 'vue-router'
  import CoddyAi from '@/components/CoddyAi.vue'
  import ShareBoard from '@/components/ShareBoard.vue'



  

  const emit = defineEmits(['output','CoddyAiresponse','toggleChat'])

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

    docContent: {
      type: String,
      default: ''
    },

    language: {
      type: Object,
    },

    languageExt: {
      type: String,
      default: 'doc'
    },

    userInput: {
      type: String,
      default: ''
    }

  })

  const route       = useRoute()

  const boardType = computed(() => {
  const parts = route.path.split('/')
  const idx    = parts.indexOf('boards')
  return idx >= 0 && parts.length > idx+1
    ? parts[idx+1]
    : 'unknown'
})


/** Local copy of boardName so the input is editable **/
const localBoardName = ref(props.boardName)
watch(() => props.boardName, v => localBoardName.value = v)

// share modal state
const showShare = ref(false)
function openShare() { showShare.value = true }
function closeShare(){ showShare.value = false }

/** re-emit from ShareBoard up to parent */
function onShared(payload) {
  emit('shared', payload)
  closeShare()
}



  const version = ref('')  
  const content = ref('') // This will hold the code for AI assistant

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
    content.value = code || props.docContent       // update the content ref
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
  emit('CoddyAiresponse',text)
}


import {saveAs} from "file-saver"
function handelExport() {
  try {
    const blob = new Blob([props.code || props.docContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${props.boardName}.${props.languageExt}`);
  } catch (error) {
    console.error("Error exporting code:", error);
  }
}

</script>

<style scoped>
/* Navbar shadow for SaaS feel */
nav {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}
</style>

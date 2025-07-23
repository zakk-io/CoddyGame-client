<script setup>
import BoardNavbar from '@/components/BoardNavbar.vue'
import ChatPanel from '@/components/ChatPanel.vue'
import { RouterView, useRoute } from 'vue-router'
import { ref,onMounted,computed } from 'vue'
import { io } from 'socket.io-client'



const route = useRoute()

const view = ref(null)


const boardId = ref('')
const boardName = ref('')
const boardIcon = ref('')
const languageExt = ref('')



let language = ref(null)
const userInput = ref('')

const code = ref('')   



import { basicSetup } from "codemirror"
import { EditorView } from "@codemirror/view"
import { python } from "@codemirror/lang-python"
import { javascript } from "@codemirror/lang-javascript"
import { java } from "@codemirror/lang-java"
import { cpp } from "@codemirror/lang-cpp"
import { php } from "@codemirror/lang-php"


const Lnaguages = [
    {
        name: 'javascript',
        lang: javascript(),
        doc : "// JavaScript code goes here\nconsole.log('Hello, World!');",
        extension: 'js',
        icon:      'fa-brands fa-js    text-[#FFD43B]'
    },
    {
        name: 'python',
        lang: python(),
        doc : "# Python code goes here\nprint('Hello, World!')",
        extension: 'py',
        icon:      'fa-brands fa-python    text-[#FFD43B]'
    },
    {
        name: 'java',
        lang: java(),
        doc : "// Java code goes here\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}"
        , extension: 'java',
        icon:      'fa-brands fa-java    text-[#74C0FC]'
    },
    {
        name: 'c',
        lang: cpp(),
        doc : "// C++ code goes here\n#include <iostream>\nusing namespace std;\nint main() {\n    cout << \"Hello, World!\" << endl;\n    return 0;\n}",
        extension: 'c',
        icon:      'fa-solid fa-c    text-[#ff0000]'
    },
    {
        name: 'php',
        lang: php(),
        doc : "<?php\n// PHP code goes here\necho 'Hello, World!';\n?>",
        extension: 'php',
        icon:      'fa-brands fa-php    text-[#B197FC]'
    }
]



const API_BASE_URI = import.meta.env.VITE_API_BASE_URI
const codebaseId        = route.params.codebase_id
const socket = io(API_BASE_URI)

socket.on('connect', () => socket.emit('join_codebase', codebaseId))


let remoteEdit = false  

function createEditor (language,initialCode) {
  try {
    code.value = initialCode   
    view.value = new EditorView({
        doc: initialCode,
        parent: document.getElementById('editor'),
        extensions: [
            basicSetup,
            EditorView.lineWrapping,
            language.lang,
            EditorView.theme({
                '&': { fontSize: '16px', height: '100%' },
                '.cm-content': { padding: '12px' }
            }, {dark: true}),
            EditorView.updateListener.of((update) => {
                if (update.docChanged  && !remoteEdit) {
                    code.value = update.state.doc.toString()
                    /* ① broadcast live text */
                    const data = code.value
                    socket.emit('emit_codebase_data',
                      data,
                      codebaseId
                    )

                  saveCodeBase(code.value)
                }
            })
        ]
    });
  } catch (error) {
    console.log(error)
  }
}



socket.on('brodcast_codebase_data', (data) => {
  if (!view.value) return
  
  if (data !== view.value.state.doc.toString()) {
    remoteEdit = true         // suppress echo
    view.value.dispatch({
      changes: {
        from: 0,
        to: view.value.state.doc.length,
        insert: data
      }
    })
    remoteEdit = false
  }
})





async function getCodeBase() {
  try {

    const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/resources/${route.params.codebase_id}` , {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'     
    }) 

    const data = await response.json()

    if(data.code === 200){
      const codebase = data.data

      language.value = Lnaguages.find((lang) => lang.name === codebase.language)
      const initialCode = codebase.content || language.value.doc;
      
      boardId.value = codebase.id
      boardName.value = codebase.name || 'Untitled'
      boardIcon.value = language.value.icon 
      languageExt.value = language.value.extension


      createEditor(language.value,initialCode)
    }

  } catch (error) {
    console.error("Error fetching codebase:", error);
  }
}



const runOutput = ref('')

/* receives the string emitted by <BoardNavbar /> */
function handleOutput (output) {
  try {
    runOutput.value = output          // show stdout / stderr
  } catch (err) {
    console.error(err)
    runOutput.value = String(err)     // still print something
  }
}


function handleAi(text) {

  try {
    view.value.dispatch({
      changes: { from: 0, to: view.value.state.doc.length, insert: text }
    });
  } catch (err) {
    console.error(err)
  }
}



async function saveCodeBase(code){
  try {
    await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/resources/${route.params.codebase_id}` , {
      method: 'PATCH',
      body: JSON.stringify({ content : code }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'     
    }) 
  } catch (error) {
    console.error("Error saving codebase:", error);
  }
}



const showChat = ref(false)

const currentUser = {
  id: '28372987498274-87897897wer',
  name: "mohamed zakaria",
  avatarUrl: 'https://ui-avatars.com/api/?name=zakaria'
}

function toggleChat() {
  showChat.value = !showChat.value
}



onMounted(async () => {
  await getCodeBase()
})
</script>


<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navbar -->
    <BoardNavbar
      :boardId="boardId"
      :boardName="boardName"
      :boardIcon="boardIcon"
      :code="code"
      :language  ="language"
      :languageExt="languageExt" 
      :userInput="userInput"
      @output="handleOutput"
      @CoddyAiresponse="handleAi"
      @toggleChat="toggleChat"
    />


  <ChatPanel
    v-if="showChat"
    :boardId="route.params.codebase_id"
    :currentUser="currentUser"
    @close="toggleChat"
   />

    <!-- Page Content -->
    <div class="flex flex-1 bg-gray-900">
      <!-- Editor Panel -->
      <div id="editor" class="flex-1 min-h-0"></div>

      <!-- Input/Output Panel -->
      <div class="w-1/3 bg-gray-900 flex flex-col p-6 border-l border-gray-700 min-h-0">
        <!-- User Input Section -->
        <div class="mb-4">
          <h2 class="text-lg mb-2 text-gray-200">Input</h2>
          <textarea
            v-model="userInput"
            class="w-full h-24 bg-gray-800 text-gray-100 rounded p-2 resize-none"
            placeholder="5&#10;7&#10;john omer"
          ></textarea>
        </div>
        <!-- Output Section takes full remaining height -->
        <div class="flex-1 overflow-auto min-h-0">
          <h2 class="text-lg mb-2 text-gray-200">Output</h2>
          <pre
            id="output-area"
            class="h-full whitespace-pre-wrap text-sm bg-gray-800 text-gray-100 rounded p-2 overflow-auto"
          >{{ runOutput }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <style scoped>
  /* view-specific styles */
  </style>
  
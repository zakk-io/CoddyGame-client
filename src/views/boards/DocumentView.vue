<script setup>
import { ref, onMounted, onBeforeUnmount, defineExpose } from 'vue'
import { useRoute } from 'vue-router'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import BoardNavbar from '@/components/BoardNavbar.vue'

// ─── ENV & ROUTER ───────────────────────────────────────────────────────────────
const API_BASE_URI = import.meta.env.VITE_API_BASE_URI
const route = useRoute()

// ─── STATE ─────────────────────────────────────────────────────────────────────
const quill     = ref(null)
const boardId   = ref('')
const boardName = ref('')
const boardIcon = ref('fa-solid fa-file-lines text-blue-500')
const content   = ref('')

// ─── UTILITIES ─────────────────────────────────────────────────────────────────
function debounce(fn, wait = 300) {
  let timer
  return () => {
    clearTimeout(timer)
    timer = setTimeout(fn, wait)
  }
}

// ─── QUILL SETUP ────────────────────────────────────────────────────────────────
function createQuill() {
  quill.value = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ font: [] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ header: [1, 2, 3] }],
        ['link', 'image'],
        ['blockquote', 'code-block']
      ]
    }
  })

  quill.value.on(
    'text-change',
    debounce(() => {
      content.value = JSON.stringify(quill.value.getContents())
      saveDocument()
    }, 500)
  )
}

// ─── DATA FETCH & SAVE ─────────────────────────────────────────────────────────
async function fetchDocument() {
  try {
    const url = `${API_BASE_URI}/api/teams/${route.params.team_id}/resources/${route.params.document_id}`
    const res = await fetch(url, { credentials: 'include' })
    const json = await res.json()

    if (json.code === 200) {
      const doc = json.data
      boardId.value   = doc.id
      boardName.value = doc.name || 'Untitled'
      content.value   = doc.content || JSON.stringify({ ops: [{ insert: '\n' }] })
      quill.value.setContents(JSON.parse(content.value))
    } else {
      console.error('Fetch error:', json.message)
    }
  } catch (err) {
    console.error('Error fetching document:', err)
  }
}

async function saveDocument() {
  try {
    const url = `${API_BASE_URI}/api/teams/${route.params.team_id}/resources/${route.params.document_id}`
    const res = await fetch(url, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        content: content.value
      })
    })
    const json = await res.json()
    if (json.code !== 200) console.error('Save error:', json.message)
  } catch (err) {
    console.error('Error saving document:', err)
  }
}

// ─── AI HELPER (called by Navbar event) ────────────────────────────────────────
function handleAi(text) {
  quill.value?.setText(text, 'user')
}

// ─── OPTIONAL: Expose for programmatic calls ──────────────────────────────────
function setAiContent(text) {
  quill.value?.setText(text, 'user')
}
defineExpose({ setAiContent })

// ─── LIFECYCLE ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  createQuill()
  await fetchDocument()
})

onBeforeUnmount(() => {
  quill.value = null
})
</script>



<template>
<div class="flex flex-col min-h-screen">
    <!-- Navbar -->
    <BoardNavbar
      :boardId="boardId"
      :boardName="boardName"
      :boardIcon="boardIcon"
      :docContent="content"
      @CoddyAiresponse="handleAi"
    />
    <div class="bg-gray-100 h-full text-black">
        <div id="editor"></div>
    </div>
        
</div>

</template>


<style scoped>
#editor{
  border: none;
}
/* make sure the inner editing canvas is white */

</style>
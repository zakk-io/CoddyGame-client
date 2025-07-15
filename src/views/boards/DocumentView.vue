<script setup>
import { ref, onMounted, onBeforeUnmount, defineExpose, markRaw } from 'vue'
import { useRoute } from 'vue-router'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import BoardNavbar from '@/components/BoardNavbar.vue'
import { io } from 'socket.io-client'

/* ─── ENV & ROUTER ─────────────────────────────────────────────────────────── */
const API_BASE_URI = import.meta.env.VITE_API_BASE_URI
const route        = useRoute()

/* ─── SOCKET ───────────────────────────────────────────────────────────────── */
const socket = io(API_BASE_URI)
socket.on('connect', () => socket.emit('join_document', route.params.document_id))

/* ─── STATE ────────────────────────────────────────────────────────────────── */
const quill      = ref(null)
const boardId    = ref('')
const boardName  = ref('')
const boardIcon  = ref('fa-solid fa-file-lines text-blue-500')
const contentStr = ref('')                     // server-friendly JSON string

/* ─── HELPERS ──────────────────────────────────────────────────────────────── */
function debounce(fn, wait = 300) {
  let t; return () => { clearTimeout(t); t = setTimeout(fn, wait) }
}

/* Newline guard (works after setContents or remote update) */
function ensureTrailingNewline () {
  const len = quill.value.getLength()
  if (quill.value.getText(len - 2, 1) !== '\n') {
    quill.value.insertText(len - 1, '\n', 'silent')
  }
}

/* ─── QUILL INIT ───────────────────────────────────────────────────────────── */
function createQuill () {
  quill.value = markRaw(new Quill('#editor', {
    theme: 'snow',
    modules: { toolbar: [
      [{ font: [] }], [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }], [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3] }], ['link', 'image'], ['blockquote', 'code-block']
    ]}
  }))

  /* LOCAL CHANGES → SERVER */
  const debouncedSave = debounce(() => {
    contentStr.value = JSON.stringify(quill.value.getContents())
    saveDocument()
  }, 300)

  quill.value.on('text-change', (delta, _old, source) => {
    if (source === 'user') {
      debouncedSave()
      socket.emit('emit_document_data', delta, route.params.document_id)
    }
  })

  /* REMOTE CHANGES → EDITOR (skip sender) */
  socket.on('brodcast_document_data', delta => {
    quill.value.updateContents(delta, 'silent')
    ensureTrailingNewline()
  })
}

/* ─── SERVER I/O ───────────────────────────────────────────────────────────── */
async function fetchDocument () {
  const url  = `${API_BASE_URI}/api/teams/${route.params.team_id}/resources/${route.params.document_id}`
  const res  = await fetch(url, { credentials: 'include' })
  const json = await res.json()

  if (json.code === 200) {
    const doc = json.data
    boardId.value   = doc.id
    boardName.value = doc.name || 'Untitled'
    const raw = doc.content ?? { ops:[{ insert:'\\n' }] }
    const delta = typeof raw === 'string' ? JSON.parse(raw) : raw
    quill.value.setContents(delta, 'silent')
    ensureTrailingNewline()
    contentStr.value = JSON.stringify(quill.value.getContents())
  } else {
    console.error('Fetch error:', json.message)
  }
}

async function saveDocument () {
  const url  = `${API_BASE_URI}/api/teams/${route.params.team_id}/resources/${route.params.document_id}`
  const res  = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ content: contentStr.value })
  })
  const json = await res.json()
  if (json.code !== 200) console.error('Save error:', json.message)
}

/* ─── AI HOOKS ─────────────────────────────────────────────────────────────── */
function handleAi (text) { quill.value?.setText(text, 'user') }
function setAiContent (t) { quill.value?.setText(t,   'user') }
defineExpose({ setAiContent })

/* ─── LIFECYCLE ────────────────────────────────────────────────────────────── */
onMounted(async () => {
  createQuill()
  await fetchDocument()
})

onBeforeUnmount(() => {
  //socket.emit('leave_document', route.params.document_id)
  socket.off(); socket.disconnect()
  quill.value?.off('text-change'); quill.value = null
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
<script setup>
import { ref, onMounted, onBeforeUnmount, markRaw,watchEffect,inject } from 'vue'
import { useRoute } from 'vue-router'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
import { io } from 'socket.io-client'
import 'quill/dist/quill.snow.css'
import BoardNavbar from '@/components/BoardNavbar.vue'
const memberInfo = inject('memberInfo')
import { useAudioCall } from '@/composables/useAudioCall';
import RemoteAudio from '@/components/RemoteAudio.vue';
import VoiceControls from '@/components/VoiceControls.vue'

Quill.register('modules/cursors', QuillCursors)      // ✔ register once

/* ── constants ───────────────────────────────────── */
const API_BASE_URI = import.meta.env.VITE_API_BASE_URI
const route        = useRoute()
const docId        = route.params.document_id

const audio = useAudioCall(docId);          // grab once
const { remoteTracks } = audio;



/* ── state ───────────────────────────────────────── */
const quill      = ref(null)
const contentStr = ref('')
const boardId    = ref('')
const boardName  = ref('')
const boardIcon  = ref('fa-solid fa-file-lines text-blue-500')

const memberName = ref('')
const memberAvatar = ref('')

/* ── socket ──────────────────────────────────────── */
const socket = io(API_BASE_URI)
socket.on('connect', () => socket.emit('join_document', docId))

/* helper: debounce */
const debounce = (fn, w = 300) => { let t; return () => { clearTimeout(t); t = setTimeout(fn, w) } }

/* ensure final newline so Quill always has a leaf node */
const ensureTrailingNewline = () => {
  const len = quill.value.getLength()
  if (quill.value.getText(len - 2, 1) !== '\n')
    quill.value.insertText(len - 1, '\n', 'silent')
}

/* ── init ────────────────────────────────────────── */
function createEditor () {
  quill.value = markRaw(new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ font: [] }], [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }], [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ header: [1, 2, 3] }], ['link', 'image'], ['blockquote', 'code-block']
      ],
      cursors: true
    }
  }))

  /* cursor module (must be AFTER init) */
  const cursors = quill.value.getModule('cursors')

  /* broadcast local delta */
  const debouncedSave = debounce(() => {
    contentStr.value = JSON.stringify(quill.value.getContents())
    saveDocument()
  })

  quill.value.on('text-change', (delta, _old, src) => {
    if (src === 'user') {
      debouncedSave()
      socket.emit('emit_document_data', delta, docId)
    }
  })

  /* broadcast caret position */
  watchEffect(() => {
  if (memberInfo?.value) {
    memberName.value = memberInfo.value.username 
    memberAvatar.value = memberInfo.value.avatar 
  } else {
    memberName.value = 'Anonymous'
    memberAvatar.value = null
  }
  })

  quill.value.on('selection-change', (range, _o, src) => {
    if (src === 'user' && range)
      socket.emit('emit_user_cursor_document', { id: socket.id,name: memberName.value, avatar: memberAvatar.value, range }, docId)
  })

  /* remote delta */
  socket.on('brodcast_document_data', d => {
    quill.value.updateContents(d, 'silent')
    ensureTrailingNewline()
  })

  /* remote cursor */
  function colorFromId(id) {
    const hash = [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0); // simple additive hash
    return `hsl(${hash % 360}, 70%, 55%)`;                                // pastel palette
  }

  socket.on('brodcast_user_cursor_document', info => {
    if (info.id === socket.id) return
    const label = (info.name ?? 'Anon').slice(0, 12);
     if (!cursors.cursors().some(c => c.id === info.id)) {   // ① make sure we create only once
        cursors.createCursor(info.id, label, colorFromId(info.id));
        cursors.toggleFlag(info.id, true); 
     }

    cursors.moveCursor(info.id, info.range)
  })

  /* clean cursor on leave */
  socket.on('user_left', id => cursors.removeCursor(id))
}




/* ── fetch / save ────────────────────────────────── */
async function fetchDocument () {
  const res  = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/resources/${docId}`, { credentials: 'include' })
  const json = await res.json()
  if (json.code === 200) {
    boardId.value   = json.data.id
    boardName.value = json.data.name || 'Untitled'
    const raw   = json.data.content ?? { ops: [{ insert: '\\n' }] }
    const delta = typeof raw === 'string' ? JSON.parse(raw) : raw
    quill.value.setContents(delta, 'silent')
    ensureTrailingNewline()
    contentStr.value = JSON.stringify(quill.value.getContents())
  }
}

async function saveDocument () {
  await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/resources/${docId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: contentStr.value })
  })
}

/* ── lifecycle ───────────────────────────────────── */
onMounted(async () => {
  createEditor()
  await fetchDocument()
})

onBeforeUnmount(() => {
  //socket.emit('leave_document', docId)
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

<RemoteAudio
    v-for="t in remoteTracks"
    :key="t.id"
    :id="t.id"
    :stream="t.stream"
  />

  <VoiceControls :audio="audio" />

</template>


<style>
#editor {
  border: none;
}
/* --- cursor avatar bubble ---------------------------------- */
.ql-cursor-flag{
  opacity: 1   !important;   /* always show */
  transition: none !important;
}
</style>


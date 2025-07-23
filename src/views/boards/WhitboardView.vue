<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
import { io } from 'socket.io-client'

const API_BASE_URI = import.meta.env.VITE_API_BASE_URI
const socket      = io(API_BASE_URI)
const whiteboard_id = route.params.whiteboard_id

socket.on('connect', () => {               // ✓ fired once handshake is done
  socket.emit('join_whiteboard', whiteboard_id)
})


const frameRef = ref(null)
const frame = ref(null)
let editorReady = false
let remotePatch  = false 



async function handleMessage(e) {
  frame.value = frameRef.value
  if (!frame.value || e.source !== frame.value.contentWindow) return

  let msg
  try { msg = JSON.parse(e.data) }
  catch { return }

  switch (msg.event) {
    case 'init':
      await geInstance()
      editorReady = true
      break
    case 'autosave':
      saveInstance(msg.xml)
      socket.emit('emit_whiteboard_data', msg.xml, whiteboard_id)
      break
  }
}





socket.on('brodcast_whiteboard_data', xml => {
    if (!frame.value) return
  // avoid echo if we’re the origin
  if (remotePatch || !xml) return

  remotePatch = true
  frame.value.contentWindow.postMessage(
    JSON.stringify({ action: 'merge', xml }),  // less jarring than load()
    '*'
  )
  remotePatch = false
})






async function geInstance(){
    try {
        const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/resources/${route.params.whiteboard_id}` , {
            credentials: 'include',
        })
        const data = await response.json();
        if (data.status === "success") {
            const instance = data.data;

            const xmlContent = instance.content ||  `<mxfile host="app.diagrams.net"><diagram name="Page-1"></diagram></mxfile>`;
            frame.value.contentWindow.postMessage(JSON.stringify({
                action: 'load',
                xml: xmlContent,
                autosave: 1
            }), '*');

        } else {
            console.error("Error fetching document:", data.message);
        }
    } catch (error) {
        console.error("Error fetching document:", error);
    }
}




//save drwa.io instance 
async function saveInstance(xml){
    try {
        await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/resources/${route.params.whiteboard_id}` , {
            method: "PATCH",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: xml })
        })
    } catch (error) {
        console.error("Error fetching document:", error);
    }
}


onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
})
</script>


<template>
    <div class="flex flex-col min-h-screen">
        <div class="bg-gray-100 h-full text-black">
            <iframe  ref="frameRef"
              src="https://embed.diagrams.net/?embed=1&proto=json"
              allow="clipboard-read; clipboard-write"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads" width="100%" height="100%">
            </iframe>
        </div>    
    </div>
    
</template>
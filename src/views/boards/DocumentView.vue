<script setup>
import Quill from "quill"
import BoardNavbar from '@/components/BoardNavbar.vue'
import { RouterView, useRoute } from 'vue-router'
import { ref,onMounted,computed } from 'vue'
const route = useRoute()


const quill = ref(null)

const boardId = ref('')
const boardName = ref('')
const boardIcon = ref('')
const content = ref('')

const API_BASE_URI = import.meta.env.VITE_API_BASE_URI

import 'quill/dist/quill.snow.css';
async function createDocument(){
    try {  
    quill.value = new Quill("#editor", {
       theme: "snow",
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
            ['blockquote', 'code-block'],
        ],
       },
   });

    } catch (error) {
        console.error("Error creating document:", error);
    }
}


async function getDocument() {
  try {

    const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/resources/${route.params.document_id}` , {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'     
    }) 

    const data = await response.json()

    if(data.code === 200){
      const document = data.data

      boardId.value = document.id
      boardName.value = document.name || 'Untitled'
      content.value = document.content || ''
      boardIcon.value = 'fa-solid fa-file-lines text-blue-500'

      createDocument()
      quill.value.setContents(JSON.parse(content.value));
    }

  } catch (error) {
    console.error("Error fetching document:", error);
  }
}



function handleAi(text) {
  try {
  
  } catch (err) {
    console.error(err)
  }
}



onMounted(async () => {
  await getDocument()
})
</script>


<template>
<div class="flex flex-col min-h-screen">
    <!-- Navbar -->
    <BoardNavbar
      :boardId="boardId"
      :boardName="boardName"
      :boardIcon="boardIcon"
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
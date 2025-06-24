<script setup>
import { ref,onMounted,watchEffect,inject,computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
const route = useRoute()
import ShareBoard from '../components/ShareBoard.vue'
import DeleteBoard from '../components/DeleteBoard.vue'
import BoardDetails from '../components/BoardDetails.vue'
import RenameBoard from '../components/RenameBoard.vue'


const boards = inject('boards', ref([]))

// Create Board menu state & handlers
const showCreateMenu = ref(false)
function toggleCreateMenu() {
  showCreateMenu.value = !showCreateMenu.value
}


const API_BASE_URI = import.meta.env.VITE_API_BASE_URI



async function createBoard(type,language) {
  const data = {type}
  if(language){
    data.language = language
  }

  const resposne = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/resources`,{
    method: "POST",
    body: JSON.stringify(data),
    headers: {
     'Content-Type': 'application/json',
  },
   credentials: 'include' 
  })

  const res = await resposne.json()

  if(res.code === 201 && res.status === "success"){
    boards.value.push(res.data)
  }

  //handle 400,403,401,500

  
  showCreateMenu.value = false
}


// Row action menu state & handlers
const activeRowMenu = ref(null)
function toggleRowMenu(idx) {
  activeRowMenu.value = activeRowMenu.value === idx ? null : idx
}



// Modals state
const showSharePanel = ref(false)
const editingBoardTitle = ref('')
const showDeletePanel = ref(false)
const editingBoardToDelete = ref('')
const showDetailsPanel = ref(false)
const detailsBoard = ref({})
const showRenamePanel = ref(false)
const editingBoardToRename = ref('')
const boardId = ref('')

function onRowAction(action, board) {
  activeRowMenu.value = null
  if (action === 'share') {
    editingBoardTitle.value = board.name
    boardId.value = board.id
    showSharePanel.value = true
    return
  }
  if (action === 'delete') {
    editingBoardToDelete.value = board.name
    boardId.value = board.id
    showDeletePanel.value = true
    return
  }
  if (action === 'details') {
    detailsBoard.value = board
    showDetailsPanel.value = true
    return
  }
  if (action === 'rename') {
    editingBoardToRename.value = board.name
    boardId.value = board.id
    showRenamePanel.value = true
    return
  }
  console.log(`${action} ->`, board.name)
}

// Modal close/handlers
function closeSharePanel() { showSharePanel.value = false }
function handleShared(payload) { console.log('Shared:', payload) }
function closeDeletePanel() { showDeletePanel.value = false }

function handleDeleted({id}) {
  // Option A: replace the array with a filtered copy
  boards.value = boards.value.filter(b => b.id !== id)
}

function closeDetailsPanel() { showDetailsPanel.value = false }
function openBoard(id) { console.log('Open board id:', id) }
function closeRenamePanel() { showRenamePanel.value = false }


function handleRenamed({id,name}) { 
  const b = boards.value.find((b) => b.id === id)
  if (b) {
    b.name = name 
    b.updatedAt = new Date().toISOString()                  
  } 
}






const BoardsIcon = {
  python:    { icon: 'fa-brands fa-python mr-2 text-[#FFD43B]'},
  c:    { icon: 'fa-solid fa-c mr-2 text-[#ff0000]'},
  java:    { icon: 'fa-brands fa-java mr-2 text-[#74C0FC]'},
  javascript:    { icon: 'fa-brands fa-js mr-2 text-[#FFD43B]'},
  php:    { icon: 'fa-brands fa-php mr-2 text-[#B197FC]'},

  document:    { icon: 'fa-file-lines text-blue-500'},
  whiteboard:     { icon: 'fa-project-diagram text-yellow-500'},
}


const selectedFilter = ref("All")

const filteredBoards = computed(() => {
  if (selectedFilter.value === "All") return boards.value

  if (selectedFilter.value === "codebase") {
    return boards.value.filter(board => board.type === "codebase")
  }

  return boards.value.filter(board => board.type === selectedFilter.value)
})



import { formatDistanceToNow } from 'date-fns'

// helper you can call from the template:
function timeAgo(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  if (isNaN(d.getTime())) return ''
  return formatDistanceToNow(d, { addSuffix: true })
}

</script>

<template>
      <!-- Content Area -->
      <main class="p-12 pb-16 bg-gray-900 flex-1">
        <p class="text-gray-400 mb-6">Filter by</p>
        <div class="flex items-center justify-between mb-6">
          <!-- Filters -->
          <div class="flex space-x-4">
            <div class="relative">
              <select v-model="selectedFilter" class="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500">
  <option value="All">All</option>
  <option value="codebase">Codebase</option>
  <option value="whiteboard">Whiteboard</option>
  <option value="document">Document</option>
</select>

              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <i class="fa-solid fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>

          <!-- Create Board -->
          <div class="relative">
            <button @click="toggleCreateMenu" class="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white">
              <i class="fa-solid fa-plus mr-2"></i>
              Create Board
            </button>
            <div v-if="showCreateMenu" class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-20">
              <ul class="divide-y divide-gray-700">
                <li @click="createBoard('codebase','python')" class="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                  <i class="fa-brands fa-python mr-2 text-[#FFD43B]"></i>
                  <span class="text-gray-100">Python</span>
                </li>
                <li @click="createBoard('codebase','c')" class="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                  <i class="fa-solid fa-c mr-2 text-[#ff0000]"></i>
                  <span class="text-gray-100">C/C++</span>
                </li>
                <li @click="createBoard('codebase','java')" class="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                  <i class="fa-brands fa-java mr-2 text-[#74C0FC]"></i>
                  <span class="text-gray-100">Java</span>
                </li>
                <li @click="createBoard('codebase','javascript')" class="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                  <i class="fa-brands fa-js mr-2 text-[#FFD43B]"></i>
                  <span class="text-gray-100">Javascript</span>
                </li>
                <li @click="createBoard('codebase','php')" class="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                  <i class="fa-brands fa-php mr-2 text-[#B197FC]"></i>
                  <span class="text-gray-100">PHP</span>
                </li>
                <li @click="createBoard('document')" class="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                  <i class="fa-solid fa-file-lines mr-3 text-blue-500"></i>
                  <span class="text-gray-100">Document</span>
                </li>
                <li @click="createBoard('whiteboard')" class="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                  <i class="fa-solid fa-project-diagram mr-2 text-yellow-500"></i>
                  <span class="text-gray-100">whiteboard</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Boards Table -->
        <div class="bg-gray-800 rounded-lg">
          <table class="w-full text-left table-auto">
            <thead class="bg-gray-700">
              <tr class="text-gray-300">
                <th class="px-6 py-4">Title</th>
                <th class="px-6 py-4">Type</th>
                <th class="px-6 py-4">Last Updated</th>
                <th class="px-6 py-4">Owner</th>
                <th class="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(board, idx) in filteredBoards" :key="board.id" class="border-b border-gray-700 hover:bg-gray-700">
                <td class="px-6 py-4 flex items-center space-x-3">
                  <i :class="['fa-solid',BoardsIcon[board.language || board.type]?.icon || 'fa-file-lines']"></i>
                  <div>
                    <p class="font-medium text-gray-100">{{ board.name }}</p>
                    <p class="text-gray-400 text-sm">{{ board.description }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-100">{{ board.language || board.type  }}</td>
                <td class="px-6 py-4 text-gray-100">{{ timeAgo(board.updatedAt) }}</td>
                <td class="px-6 py-4">
                     <div class="flex items-center space-x-2">
                       <img :src="board.creator.avatar" alt="Owner Avatar" class="h-6 w-6 rounded-full bg-gray-600" />
                       <span class="text-gray-100">{{ board.creator.username }}</span>
                     </div>
                </td>
                <td class="px-6 py-4 relative text-gray-400 cursor-pointer text-xl">
                  <button @click="toggleRowMenu(idx)">…</button>
                  <div v-if="activeRowMenu === idx" class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-20">
                    <ul class="divide-y divide-gray-700">
                      <li @click="onRowAction('share', board)" class="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        <i class="fa-solid fa-share mr-2"></i><span class="text-gray-100">Share</span>
                      </li>
                      <li @click="onRowAction('details', board)" class="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        <i class="fa-solid fa-info-circle mr-2"></i><span class="text-gray-100">Board Details</span>
                      </li>
                      <li @click="onRowAction('rename', board)" class="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        <i class="fa-solid fa-pen mr-2"></i><span class="text-gray-100">Rename</span>
                      </li>
                      <li @click="onRowAction('delete', board)" class="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        <i class="fa-solid fa-trash mr-2"></i><span class="text-gray-100">Delete</span>
                      </li>
                      <li @click="onRowAction('export', board)" class="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        <i class="fa-solid fa-file-export mr-2"></i><span class="text-gray-100">Export</span>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    <!-- Share Board Modal -->
    <ShareBoard
      v-if="showSharePanel"
      :boardTitle="editingBoardTitle"
      :boardId="boardId"
      @close="closeSharePanel"
      @shared="handleShared"
    />

    <!-- Delete Board Modal -->
    <DeleteBoard v-if="showDeletePanel"
     :boardName="editingBoardToDelete"
     :boardId="boardId"
     @close="closeDeletePanel"
     @deleted="handleDeleted" 
     />
   
    <!-- Board Details Modal -->
    <BoardDetails v-if="showDetailsPanel" 
    :board="detailsBoard"
    @close="closeDetailsPanel"
    @open="openBoard"
     />

    <!-- Rename Board Modal -->
    <RenameBoard v-if="showRenamePanel"
    :boardName="editingBoardToRename"
    :boardId="boardId"
    @close="closeRenamePanel"
    @renamed="handleRenamed"
    />

</template>

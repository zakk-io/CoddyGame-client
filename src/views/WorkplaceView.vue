<script setup>
import { ref } from 'vue'
import Header from '../components/Header.vue'
import SideBar from '../components/SideBar.vue'
import ShareBoard from '../components/ShareBoard.vue'
import DeleteBoard from '../components/DeleteBoard.vue'
import BoardDetails from '../components/BoardDetails.vue'
import RenameBoard from '../components/RenameBoard.vue'


// Create Board menu state & handlers
const showCreateMenu = ref(false)
function toggleCreateMenu() {
  showCreateMenu.value = !showCreateMenu.value
}
function createBoard(type) {
  console.log('Create new board:', type)
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

function onRowAction(action, board) {
  activeRowMenu.value = null
  if (action === 'share') {
    editingBoardTitle.value = board.title
    showSharePanel.value = true
    return
  }
  if (action === 'delete') {
    editingBoardToDelete.value = board.title
    showDeletePanel.value = true
    return
  }
  if (action === 'details') {
    detailsBoard.value = board
    showDetailsPanel.value = true
    return
  }
  if (action === 'rename') {
    editingBoardToRename.value = board.title
    showRenamePanel.value = true
    return
  }
  console.log(`${action} ->`, board.title)
}

// Modal close/handlers
function closeSharePanel() { showSharePanel.value = false }
function handleShared(payload) { console.log('Shared:', payload) }
function closeDeletePanel() { showDeletePanel.value = false }
function handleDeleted(title) { console.log('Deleted:', title) }
function closeDetailsPanel() { showDetailsPanel.value = false }
function openBoard(id) { console.log('Open board id:', id) }
function closeRenamePanel() { showRenamePanel.value = false }
function handleRenamed(newName) { console.log('Renamed to:', newName) }

// Sample data
const boards = ref([
  { id: 1, title: 'System Architecture', description: 'Collaborative Code Editor', owner: 'mo.zakk', created: 'March 19, 2025', modified: 'Today', location: 'big team' },
  { id: 2, title: 'Project - Notes', description: '', owner: 'mo.zakk', created: 'May 22, 2025', modified: 'May 22', location: 'big team' }
])
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <SideBar />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Bar -->
      <Header />

      <!-- Content Area -->
      <main class="p-12 pb-16 bg-gray-900 flex-1">
        <p class="text-gray-400 mb-6">Filter by</p>
        <div class="flex items-center justify-between mb-6">
          <!-- Filters -->
          <div class="flex space-x-4">
            <div class="relative">
              <select class="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>All</option>
                <option>codebase</option>
                <option>diagram</option>
                <option>document</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <i class="fa-solid fa-chevron-down text-gray-400"></i>
              </div>
            </div>
            <div class="relative">
              <select class="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>My Boards</option>
                <option>my boards</option>
                <option>all</option>
                <option>team leader boards</option>
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
                <li @click="createBoard('codebase')" class="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                  <i class="fa-solid fa-code mr-2 text-gray-300"></i>
                  <span class="text-gray-100">Codebase</span>
                </li>
                <li @click="createBoard('diagram')" class="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                  <i class="fa-solid fa-project-diagram mr-2 text-gray-300"></i>
                  <span class="text-gray-100">Diagram</span>
                </li>
                <li @click="createBoard('document')" class="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer">
                  <i class="fa-solid fa-file-lines mr-2 text-gray-300"></i>
                  <span class="text-gray-100">Document</span>
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
                <th class="px-6 py-4">Last Updated</th>
                <th class="px-6 py-4">Owner</th>
                <th class="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(board, idx) in boards" :key="board.id" class="border-b border-gray-700 hover:bg-gray-700">
                <td class="px-6 py-4 flex items-center space-x-3">
                  <i class="fa-solid fa-file-lines text-gray-300 text-2xl"></i>
                  <div>
                    <p class="font-medium text-gray-100">{{ board.title }}</p>
                    <p class="text-gray-400 text-sm">{{ board.description }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-100">{{ board.modified }}</td>
                <td class="px-6 py-4">
                     <div class="flex items-center space-x-2">
                       <img src="https://via.placeholder.com/24" alt="Owner Avatar" class="h-6 w-6 rounded-full bg-gray-600" />
                       <span class="text-gray-100">{{ board.owner }}</span>
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
    </div>
    <!-- Share Board Modal -->
    <ShareBoard
      v-if="showSharePanel"
      :boardTitle="editingBoardTitle"
      @close="closeSharePanel"
      @shared="handleShared"
    />

    <!-- Delete Board Modal -->
    <DeleteBoard v-if="showDeletePanel"
     :boardName="editingBoardToDelete"
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
    @close="closeRenamePanel"
    @renamed="handleRenamed"
    />
  </div>
</template>

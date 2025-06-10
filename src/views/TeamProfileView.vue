<script setup>
import { ref } from 'vue'
import Header from '../components/Header.vue'
import SideBar from '../components/SideBar.vue'

const teamName = ref('')
const description = ref('')
const isPublic = ref(false)
const membersCount = ref(3)
const boardsCount = ref(5)


function updateSettings() {
  console.log('Saving settings', {
    name: teamName.value,
    description: description.value,
    isPublic: isPublic.value,
  })
}

function leaveTeam() {
  console.log('Leaving team')
}

function deleteTeam() {
  console.log('Deleting team')
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-900 text-gray-100">
    <SideBar />

    <div class="flex-1 flex flex-col">
        <Header :title="'Settings'" />


      <div class="flex-1 overflow-auto p-6 flex">
        <div class="flex-1 bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col">
          <!-- Title + Avatar -->
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-4xl font-semibold">Team Settings</h2>
            <div
              class="h-20 w-20 rounded-lg bg-gray-700 flex items-center justify-center text-3xl font-semibold text-gray-300"
            >
              <img src="" alt="" srcset="">
            </div>
          </div>


          <!-- Team Name -->
          <div class="mb-6 w-3/4">
            <label for="teamName" class="block mb-2 font-medium uppercase text-sm">Team Name</label>
            <input
              id="teamName"
              v-model="teamName"
              type="text"
              class="w-full p-3 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-blue-500 transition"
              placeholder="team flow"
            />
          </div>

          <!-- Description -->
          <div class="mb-8 w-3/4">
            <label for="desc" class="block mb-2 font-medium uppercase text-sm">Description</label>
            <textarea
              id="desc"
              v-model="description"
              rows="3"
              class="w-full p-3 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-blue-500 transition"
              placeholder="we are the best team ever"
            ></textarea>
          </div>

          <!-- Visibility -->
          <div class="mb-8 flex items-center">
            <button
              @click="isPublic = !isPublic"
              class="relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none mr-3"
              :class="isPublic ? 'bg-green-500' : 'bg-gray-600'"
            >
              <span class="sr-only">Toggle visibility</span>
              <span
                :class="isPublic ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform"
              ></span>
            </button>
            <i :class="isPublic ? 'fas fa-globe text-lg mr-2' : 'fas fa-lock text-lg mr-2'"></i>
            <span class="font-medium uppercase text-sm">{{ isPublic ? 'Public' : 'Private' }}</span>
          </div>


          <!-- Stats -->
          <div class="flex space-x-8 mb-8 text-gray-300">
            <div class="flex items-center">
              <i class="fas fa-th-large text-xl mr-2"></i>
              <span class="text-lg font-medium mr-1">Boards:</span>
              <span class="text-xl font-bold">{{ boardsCount }}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-users text-xl mr-2"></i>
              <span class="text-lg font-medium mr-1">Members:</span>
              <span class="text-xl font-bold">{{ membersCount }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between mt-auto">
            <button
              @click="updateSettings"
              class="px-6 py-2 bg-indigo-600 hover:bg-indigo-800 rounded text-white font-medium transition"
            >
               Update
            </button>
            <div class="space-x-4">
              <button
                @click="leaveTeam"
                class="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition"
              >
                <i class="fas fa-sign-out-alt mr-1"></i> Leave Team
              </button>
              <button
                @click="deleteTeam"
                class="px-5 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition"
              >
                 Delete Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
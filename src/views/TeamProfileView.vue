<script setup>
import {ref,watchEffect,inject } from 'vue'
import { useRoute } from 'vue-router'




const teamName = ref('')
const description = ref('')
const avatarUrl    = ref('')
const isPublic = ref(false)
const membersCount = ref(3)
const boardsCount = ref(5)



const team = inject('team', null)

watchEffect(() => {
  if (!team.value) return
  teamName.value    = team.value.name
  description.value = team.value.description
  avatarUrl.value = team.value.avatar
  isPublic.value    = team.value.type === 'public'
  membersCount.value = team.value.members_count
  boardsCount.value  = team.value.resource_count
})



const route = useRoute()


const API_BASE_URI = import.meta.env.VITE_API_BASE_URI





//update team api
const updateTeam = async () => {
  const updatedTeam = {
    name: teamName.value,
    description: description.value,
    type: isPublic.value ? 'public' : 'private',
  }
  const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}`,{
    method: 'PUT',
    body : JSON.stringify(updatedTeam),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'     
  }) 

  const data = await response.json()

  if(data.status === 'success' && data.code === '200') {
    team.value.name = data.team.name
    team.value.description = data.team.description
    team.value.type = data.team.type
  }

  //handle 404,400,403,500 errors
}


function updateSettings() {
  updateTeam()
}

function leaveTeam() {
  console.log('Leaving team')
}

function deleteTeam() {
  console.log('Deleting team')
}
</script>

<template>
      <div class="flex-1 overflow-auto p-6 flex">
        <div class="flex-1 bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col">
          <!-- Title + Avatar -->
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-4xl font-semibold">Team Settings</h2>
            <div
              class="h-20 w-20 rounded-lg bg-gray-700 flex items-center justify-center text-3xl font-semibold text-gray-300"
            >
               <img
                  :src="avatarUrl"
                  alt="team avatar"
                  class="h-full w-full object-cover"
               />
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
</template>
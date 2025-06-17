<script setup>
import { RouterLink,useRoute } from 'vue-router'
import {watchEffect,inject,ref } from 'vue'


const props = defineProps({
  teamId: {
    type: String,
    required: true
  }
})




const avatarUrl    = ref('')
const teamName     = ref('')



const team = inject('team', null)

watchEffect(() => {
  if (!team.value) return
  avatarUrl.value = team.value.avatar
  teamName.value = team.value.name  
})





</script>

<template>
  <aside class="w-64 bg-gray-800 flex-shrink-0">
    <div class="px-6 py-6 border-b border-gray-700">
      <div class="flex items-center space-x-3">
        <!-- Team Avatar Placeholder -->
        <div class="h-20 w-20 bg-gray-600 flex items-center justify-center text-gray-400">
          <img
              :src="avatarUrl"
              alt="team avatar"
              class="h-full w-full object-cover"
          />
        </div>
        <span class="text-xl font-bold text-gray-100" >{{ teamName }}</span>
      </div>
    </div>
    <div class="px-4 py-4">
      <div class="relative text-gray-400">
        <input
          type="text"
          placeholder="Search"
          class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>
      <nav class="mt-6 space-y-2">
        <RouterLink :to="`/teams/${teamId}/workplace`" class="flex items-center px-4 py-2  rounded-lg text-gray-100" active-class="bg-gray-700">
          <i class="fa-solid fa-house mr-3"></i>
          Workplace
        </RouterLink>

        <RouterLink :to="`/teams/${teamId}/users/members`" class="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 text-gray-100" active-class="bg-gray-700">
          <i class="fa-solid fa-users mr-3"></i>
          Users
        </RouterLink>

        <RouterLink :to="`/teams/${teamId}/settings`" class="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 text-gray-100" active-class="bg-gray-700">
          <i class="fa-solid fa-gear mr-3"></i>
          Settings
        </RouterLink>
      </nav>
    </div>
  </aside>
</template>

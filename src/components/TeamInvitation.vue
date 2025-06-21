<script setup>
import { ref, computed,inject } from 'vue'
import {useRoute } from 'vue-router'
const route = useRoute()


const API_BASE_URI = import.meta.env.VITE_API_BASE_URI



const props = defineProps({
  show: Boolean,
  teamName: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['close', 'invite'])

const email = ref('')
const selectedRole = ref('editor')
const roles = ['co-leader', 'editor', 'viewer']

// Compute a dynamic invitation URL
const DirectJoinLinkUri = ref('')


import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();


const invitations = inject('invitations')


async function handleInvite() {
  try {
      const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/members/invitations`,{
      method: 'POST',
      body: JSON.stringify({"email":email.value,"role": selectedRole.value}),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'     
    }) 
  
    const data = await response.json()
  
    if(data.status === 'success' && data.code === '201') {
      $toast.success(data.message);
      invitations.value.push(data.invitation)
    }
  } catch (error) {
    console.error(error)
  }
}



function copyLink() {
  navigator.clipboard.writeText(DirectJoinLinkUri.value)
  $toast.success("send link to your friend");
  DirectJoinLinkUri.value = ""
  
  //notify action
}



async function createJoinLink() {
  try {
      const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/direct-join-link`,{
      method: 'POST',
      body: JSON.stringify({"role": selectedRole.value}),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'     
    }) 
  
    const data = await response.json()
  
    if(data.status === 'success' && data.code === '201') {
      DirectJoinLinkUri.value = data.link
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
    <div class="bg-gray-800 rounded-lg w-full max-w-md p-6">
      <!-- Header -->
      <div class="flex flex-col mb-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-100">Invite Member</h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-200 text-2xl leading-none">&times;</button>
        </div>
        <p v-if="teamName" class="mt-2 text-gray-300">Team: {{ teamName }}</p>
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <!-- Email Field with Icon -->
        <div>
          <label class="block text-gray-100 mb-2">Email address</label>
          <div class="relative">
            <i class="fa-solid fa-user-plus absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="email"
              type="email"
              placeholder="Email address"
              class="w-full bg-gray-700 text-gray-100 px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <!-- Role Selector -->
        <div>
          <label class="block text-gray-100 mb-2">Role</label>
          <div class="relative">
            <select
              v-model="selectedRole"
              class="w-full bg-gray-700 text-gray-100 px-4 py-2 rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <i class="fa-solid fa-chevron-down text-gray-400"></i>
            </div>
          </div>
        </div>

        <!-- DirectJoinLinkUri Link with Copy Button -->
        <div>
          <label class="block text-gray-100 mb-2">Direct Join Link</label>
          <div class="flex mb-2">
            <input
              type="text"
              readonly
              :value="DirectJoinLinkUri"
              class="flex-1 bg-gray-700 text-gray-100 px-4 py-2 rounded-l-lg focus:outline-none"
            />
            <button
              @click="copyLink"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-r-lg"
            >
              <i class="fa-solid fa-copy"></i>
            </button>
          </div>
          <button
            @click="createJoinLink"
            class="text-indigo-600"
          >
            Create Direct Join Link
          </button>
          <p>expire in 1 day</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-6 flex justify-end space-x-2">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-gray-100 rounded-lg"
        >
          Cancel
        </button>
        <button
          @click="handleInvite"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
        >
          Invite
        </button>
      </div>
    </div>
  </div>
</template>
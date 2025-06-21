<script setup>
import {ref,inject } from 'vue'
import { RouterView, useRoute } from 'vue-router'
const route = useRoute()


const API_BASE_URI = import.meta.env.VITE_API_BASE_URI

const members = inject('members', null)

// track which member menu is open
const openMenuId = ref(null)


function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id
}

async function kickUser(member) {
  try {
  const member_id = member.id
  const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/members/${member.id}/kick`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'     
  }) 

  const data = await response.json()

  if(data.status === 'success' && data.code === '200') {
    members.value = members.value.filter((m) => m.id != member_id)
    $toast.success(`${member.username} has been removed from team`);
    openMenuId.value = null
  }

  //handle 404,400,403,500 errors
} catch (error) {
  console.error(error)
}
}

import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();


async function handleRoleChange(member) {
try {
  const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/members/${member.id}`,{
    method: 'PUT',
    body: JSON.stringify({
      'role': member.role
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'     
  }) 

  const data = await response.json()

  if(data.status === 'success' && data.code === '200') {
    $toast.success(`${member.username} become ${member.role}`);
  }

  //handle 404,400,403,500 errors
} catch (error) {
  console.error(error)
}

}



</script>

<template>
        <!-- Alert -->
        <div class="mb-4 bg-indigo-600 text-white rounded-lg px-4 py-2">
          {{ members.length }} members below are in the team.
        </div>


        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full table-auto border-collapse">
            <thead>
              <tr class="text-left text-gray-400 border-b border-gray-700">
                <th class="pb-3">Member</th>
                <th class="pb-3">Role</th>
                <th class="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="member in members"
                :key="member.id"
                class="border-b border-gray-700 hover:bg-gray-800 relative"
              >
                <td class="py-4 flex items-center space-x-3">
                  <img
                    :src="member.avatar"
                    alt="avatar"
                    class="h-10 w-10 rounded-full bg-gray-600"
                  />
                  <div>
                    <div class="font-medium text-white">{{ member.username }}</div>
                    <div class="text-sm text-gray-400">{{ member.email }}</div>
                  </div>
                </td>
                <td class="py-4">
                  <select
                    v-model="member.role"
                    :disabled="member.role === 'leader'"
                    @change="handleRoleChange(member)"
                    class="bg-gray-800 text-gray-100 rounded-lg px-3 py-2 focus:outline-none disabled:opacity-50"
                  >
                    <!-- Show 'leader' only if the current member has that role -->
                    <option v-if="member.role === 'leader'">leader</option>
                    <option>co-leader</option>
                    <option>editor</option>
                    <option>viewer</option>
                  </select>
                </td>


                <td class="py-4 text-right">
                  <div class="relative inline-block">
                    <button
                      @click="toggleMenu(member.id)"
                      class="p-2 hover:bg-gray-700 rounded-full"
                    >
                      <i class="fa-solid fa-ellipsis-vertical text-gray-400"></i>
                    </button>

                    <!-- Dropdown menu (hidden for leaders) -->
                    <ul
                      v-if="openMenuId === member.id && member.role !== 'leader'"
                      class="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10"
                    >
                      <li
                        @click="kickUser(member)"
                        class="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      >
                        <i class="fa-solid fa-user-minus mr-2 text-gray-100"></i>
                        <span class="text-gray-100">remove</span>
                      </li>
                    </ul>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
</template>

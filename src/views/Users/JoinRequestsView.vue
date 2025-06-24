<script setup>
import { ref,inject, computed } from 'vue'

import { useRoute } from 'vue-router'
const route = useRoute()



const API_BASE_URI = import.meta.env.VITE_API_BASE_URI

const requests = inject('join_requests', ref([])) // safer fallback


const visibleRequests = computed(() =>
  requests.value.filter(req => req.status === 'pending' || req.status === 'rejected')
)


const pendingRequests = computed(() =>
  requests.value.filter(req => req.status === 'pending')
)



const members = inject('members', null)
async function acceptRequest(req,role) {
  try {
  const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/join-requests/${req.id}`,{
    method: 'POST',
    body: JSON.stringify({'role':role}),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'     
  }) 

  const data = await response.json()

  if(data.status === 'success' && data.code === '200') {
    req.status = 'accepted'
    members.value.push(data.member)
  }

  //handle 404,400,403,500 errors
} catch (error) {
  console.error(error)
}
}

async function rejectRequest(req) {
  try {
  const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/join-requests/${req.id}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'     
  }) 

  const data = await response.json()

  if(data.status === 'success' && data.code === '200') {
    req.status = 'rejected'
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
               {{ pendingRequests.length }} pending join Requests below are in the team.
            </div>

        <div class="overflow-x-auto">
          <table class="w-full table-auto border-collapse">
            <thead>
              <tr class="text-left text-gray-400 border-b border-gray-700">
                <th class="pb-3">Applicant</th>
                <th class="pb-3">Role</th>
                <th class="pb-3">Status</th>
                <th class="pb-3">actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="req in visibleRequests"
                :key="req.id"
                class="border-b border-gray-700 hover:bg-gray-800"
              >
                <td class="py-4 flex items-center space-x-3">
                  <img
                    :src="req.avatar"
                    alt="avatar"
                    class="h-10 w-10 rounded-full bg-gray-600"
                  />
                  <div>
                    <div class="font-medium text-white">{{ req.username }}</div>
                  </div>
                </td>
                <td class="py-4">
                  <select
                    v-model="role"
                    class="bg-gray-800 text-gray-100 rounded-lg px-3 py-2 focus:outline-none"
                  >
                  <option>co-leader</option>
                    <option>editor</option>
                    <option>viewer</option>
                  </select>
                </td>
                <td class="py-4">
                  <span
                    class="inline-block px-3 py-1 text-xs rounded-full font-semibold"
                    :class="{
                      'bg-yellow-600 text-yellow-100': req.status === 'pending',
                      'bg-red-600 text-red-100': req.status === 'rejected',

                    }"
                  >
                    {{ req.status }}
                  </span>
                </td>
                <td class="py-4 space-x-2">
                  <template v-if="req.status === 'pending'">
                    <button
                      @click="acceptRequest(req,role)"
                      class="px-3 py-1 text-green-500 hover:text-green-400 font-medium"
                    >
                      Accept
                    </button>
                    <button
                      @click="rejectRequest(req)"
                      class="px-3 py-1 text-red-500 hover:text-red-400 font-medium"
                    >
                      Reject
                    </button>
                  </template>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
</template>

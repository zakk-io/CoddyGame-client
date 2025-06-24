<script setup>
import { ref,inject, computed } from 'vue'

import { useRoute } from 'vue-router'
const route = useRoute()


const API_BASE_URI = import.meta.env.VITE_API_BASE_URI

const invitations = inject('invitations', ref([])) // safer fallback

async function cancelInvitation(inv) {
  try {
  const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/members/invitations/${inv._id}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'     
  }) 

  const data = await response.json()

  if(data.status === 'success' && data.code === '200') {
    inv.status = 'cancelled'
  }

  //handle 404,400,403,500 errors
} catch (error) {
  console.error(error)
}
}



const safeInvitations = computed(() => invitations.value || [])


const pendingInvitationsCount = computed(() => {
  return safeInvitations.value.filter(inv => inv.status === 'pending').length
})


const formatDate = iso =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',   // "May" or "5" if you prefer numeric
    day: 'numeric'
  })

</script>

<template>
          <!-- Alert -->
            <div class="mb-4 bg-indigo-600 text-white rounded-lg px-4 py-2">
               {{ pendingInvitationsCount }} invitations below are in the team.
            </div>
        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full table-auto border-collapse">
            <thead>
              <tr class="text-left text-gray-400 border-b border-gray-700">
                <th class="pb-3">Email</th>
                <th class="pb-3">Role</th>
                <th class="pb-3">Expires At</th>
                <th class="pb-3">Status</th>
                <th class="pb-3">action</th>
              </tr>
            </thead>
            <tbody>
              <tr
               v-if="safeInvitations.length" v-for="inv in safeInvitations" :key="inv._id"
                class="border-b border-gray-700 hover:bg-gray-800"
              >
                <td class="py-4">
                  <div class="font-medium text-white">{{ inv.email }}</div>
                </td>
                <td class="py-4">{{ inv.role }}</td>
                <td class="py-4">{{ formatDate(inv.expiresAt) }}</td>
                <td class="py-4">
                  <span
                    class="inline-block px-3 py-1 text-xs rounded-full font-semibold"
                    :class="{
                      'bg-yellow-600 text-yellow-100': inv.status === 'pending',
                      'bg-red-600 text-red-100': inv.status === 'cancelled',
                    }"
                  >
                    {{ inv.status }}
                  </span>
                </td>
                <td class="py-4">
                  <button
                    v-if="inv.status === 'pending'"
                    @click="cancelInvitation(inv)"
                    class="text-red-500 hover:text-red-400 font-medium"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
</template>

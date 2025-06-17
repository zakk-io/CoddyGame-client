<script setup>
import { ref, computed } from 'vue'
import Header from '../../components/Header.vue'
import SideBar from '../../components/SideBar.vue'
import UsersTabs from '../../components/UsersTabs.vue'

// Placeholder invitation data
const invitations = ref([
  {
    id: 1,
    email: 'carol.d@example.com',
    role: 'Editor',
    expires: 'Nov 02, 2023',
    status: 'Pending'
  },
  {
    id: 2,
    email: 'alex.k@example.com',
    role: 'Viewer',
    expires: 'Dec 15, 2023',
    status: 'Pending'
  },
  {
    id: 3,
    email: 'sam.w@example.com',
    role: 'Co-leader',
    expires: 'Oct 01, 2023',
    status: 'Pending'
  }
])

function cancelInvitation(inv) {
  // TODO: call API to cancel invitation
  console.log('Cancelling invitation', inv)
  // update status locally
  inv.status = 'Cancelled'
}
</script>

<template>
            <!-- Alert -->
            <div class="mb-4 bg-indigo-600 text-white rounded-lg px-4 py-2">
               {{ invitations.length }} invitations below are in the team.
            </div>
        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full table-auto border-collapse">
            <thead>
              <tr class="text-left text-gray-400 border-b border-gray-700">
                <th class="pb-3">Email</th>
                <th class="pb-3">Role</th>
                <th class="pb-3">Expires</th>
                <th class="pb-3">Status</th>
                <th class="pb-3">action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="inv in invitations"
                :key="inv.id"
                class="border-b border-gray-700 hover:bg-gray-800"
              >
                <td class="py-4">
                  <div class="font-medium text-white">{{ inv.email }}</div>
                </td>
                <td class="py-4">{{ inv.role }}</td>
                <td class="py-4">{{ inv.expires }}</td>
                <td class="py-4">
                  <span
                    class="inline-block px-3 py-1 text-xs rounded-full font-semibold"
                    :class="{
                      'bg-yellow-600 text-yellow-100': inv.status === 'Pending',
                    }"
                  >
                    {{ inv.status }}
                  </span>
                </td>
                <td class="py-4">
                  <button
                    v-if="inv.status === 'Pending'"
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

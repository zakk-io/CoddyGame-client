<script setup>
import { ref, computed } from 'vue'
import Header from '../../components/Header.vue'
import SideBar from '../../components/SideBar.vue'
import UsersTabs from '../../components/UsersTabs.vue'

// Placeholder join request data
const requests = ref([
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'editor',
    status: 'Pending',
    avatar: 'https://via.placeholder.com/40?text=JD'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'editor',
    status: 'Pending',
    avatar: 'https://via.placeholder.com/40?text=JS'
  }
])

function acceptRequest(req) {
  // TODO: call API to accept
  req.status = 'Accepted'
}

function rejectRequest(req) {
  // TODO: call API to reject
  req.status = 'Rejected'
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-900 text-gray-100">
    <SideBar />
    <div class="flex-1 flex flex-col">
      <Header :title="'Join Requests'" />
      <UsersTabs />


      <div class="flex-1 overflow-auto p-6">
            <!-- Alert -->
            <div class="mb-4 bg-indigo-600 text-white rounded-lg px-4 py-2">
               {{ requests.length }} oin Requests below are in the team.
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
                v-for="req in requests"
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
                    <div class="font-medium text-white">{{ req.name }}</div>
                    <div class="text-sm text-gray-400">{{ req.email }}</div>
                  </div>
                </td>
                <td class="py-4">
                  <select
                    v-model="req.role"
                    class="bg-gray-800 text-gray-100 rounded-lg px-3 py-2 focus:outline-none"
                  >
                  <option>co leader</option>
                    <option>editor</option>
                    <option>viewer</option>
                  </select>
                </td>
                <td class="py-4">
                  <span
                    class="inline-block px-3 py-1 text-xs rounded-full font-semibold"
                    :class="{
                      'bg-yellow-600 text-yellow-100': req.status === 'Pending',
                    }"
                  >
                    {{ req.status }}
                  </span>
                </td>
                <td class="py-4 space-x-2">
                  <button
                    @click="acceptRequest(req)"
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

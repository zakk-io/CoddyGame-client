<script setup>
import { ref, computed } from 'vue'
import Header from '../../components/Header.vue'
import SideBar from '../../components/SideBar.vue'
import UsersTabs from '../../components/UsersTabs.vue'

// placeholder member data
const members = ref([
  {
    id: 1,
    name: 'Gorwanda',
    email: 'gorwanda74@gmail.com',
    role: 'co leader',
    boardsAccess: 1,
    avatar: 'https://via.placeholder.com/40?text=GO'
  },
  {
    id: 2,
    name: 'mo. zakk',
    email: 'mozakk.io@gmail.com',
    role: 'editor',
    boardsAccess: 2,
    avatar: 'https://via.placeholder.com/40?text=MZ'
  },
  {
    id: 3,
    name: 'Mohammed',
    email: 'ug2424787@ines.ac.rw',
    role: 'editor',
    boardsAccess: 2,
    avatar: 'https://via.placeholder.com/40?text=M'
  },
  {
    id: 4,
    name: 'Invited User',
    email: 'moza2kk.io@gmail.com',
    role: 'viewer',
    boardsAccess: 1,
    avatar: 'https://via.placeholder.com/40?text=IU'
  }
])

const searchQuery = ref('')
// track which member menu is open
const openMenuId = ref(null)

// filtered based on search
const filteredMembers = computed(() => {
  if (!searchQuery.value) return members.value
  const q = searchQuery.value.toLowerCase()
  return members.value.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.email.toLowerCase().includes(q)
  )
})

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function kickUser(member) {
  // TODO: call API to remove member
  console.log('Kicking user', member)
  openMenuId.value = null
}
</script>

<template>
      <UsersTabs />

      <div class="flex-1 overflow-auto p-6">
        <!-- Alert -->
        <div class="mb-4 bg-indigo-600 text-white rounded-lg px-4 py-2">
          {{ members.length }} members below are in the team.
        </div>

        <!-- Search -->
        <div class="mb-6 relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email, or domain"
            class="w-full bg-gray-800 placeholder-gray-500 text-gray-100 rounded-lg pl-12 pr-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full table-auto border-collapse">
            <thead>
              <tr class="text-left text-gray-400 border-b border-gray-700">
                <th class="pb-3">Name</th>
                <th class="pb-3">Role</th>
                <th class="pb-3">Boards</th>
                <th class="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="member in filteredMembers"
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
                    <div class="font-medium text-white">{{ member.name }}</div>
                    <div class="text-sm text-gray-400">{{ member.email }}</div>
                  </div>
                </td>
                <td class="py-4">
                  <select
                    v-model="member.role"
                    class="bg-gray-800 text-gray-100 rounded-lg px-3 py-2 focus:outline-none"
                  >
                    <option>co leader</option>
                    <option>editor</option>
                    <option>viewer</option>
                  </select>
                </td>
                <td class="py-4 text-center">{{ member.boardsAccess }}</td>
                <td class="py-4 text-right">
                  <div class="relative inline-block">
                    <button
                      @click="toggleMenu(member.id)"
                      class="p-2 hover:bg-gray-700 rounded-full"
                    >
                      <i class="fa-solid fa-ellipsis-vertical text-gray-400"></i>
                    </button>

                    <!-- Dropdown menu -->
                    <ul
                      v-if="openMenuId === member.id"
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
      </div>
</template>

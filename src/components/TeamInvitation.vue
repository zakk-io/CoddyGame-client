<script setup>
import { ref, computed } from 'vue'

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
const roles = ['co leader', 'editor', 'viewer']

// Compute a dynamic invitation URL
const invitationUrl = computed(() => 
  `${window.location.origin}/invite`
)

function handleInvite() {
  //emit('invite', { email: email.value, role: selectedRole.value })
  console.log(`Inviting ${email.value} as ${selectedRole.value}`)
}

function copyLink() {
  navigator.clipboard.writeText(invitationUrl.value)
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

        <!-- Invitation Link with Copy Button -->
        <div>
          <label class="block text-gray-100 mb-2">Invitation Link</label>
          <div class="flex">
            <input
              type="text"
              readonly
              :value="invitationUrl"
              class="flex-1 bg-gray-700 text-gray-100 px-4 py-2 rounded-l-lg focus:outline-none"
            />
            <button
              @click="copyLink"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-r-lg"
            >
              <i class="fa-solid fa-copy"></i>
            </button>
          </div>
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

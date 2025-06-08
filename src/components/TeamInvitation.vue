<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  show: Boolean
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
  console.log('Inviting:',  email.value, 'as', selectedRole.value)

}

function copyLink() {
  navigator.clipboard.writeText(invitationUrl.value)
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
    <div class="bg-gray-800 rounded-lg w-full max-w-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-100">Invite Member</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-200 text-2xl leading-none">&times;</button>
      </div>
      <div class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email address"
          class="w-full bg-gray-700 text-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
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
        <div>
          <label class="block text-gray-100 mb-2">Invitation Link</label>
          <div class="relative">
            <input
              type="text"
              readonly
              :value="invitationUrl"
              class="w-full bg-gray-700 text-gray-100 px-4 py-2 rounded-lg pr-10"
            />
            <button
              @click="copyLink"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-200"
            >
              <i class="fa-solid fa-copy"></i>
            </button>
          </div>
        </div>
      </div>
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

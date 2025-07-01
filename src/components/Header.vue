<script setup>
import { ref,inject, computed, watchEffect } from 'vue'
import TeamInvitation from './TeamInvitation.vue'


// define a required string prop
const props = defineProps({
  title: {
    type: String,
    required: true,
    default: 'Board'
  }
})



const memberInfo = inject('memberInfo')

const canInvite = ref(false)

watchEffect(() => {
  if (memberInfo?.value) {
    canInvite.value = memberInfo.value.role === 'leader' || memberInfo.value.role === 'co-leader'
  } else {
    canInvite.value = false
  }
})


const avatarUrl = computed(() => memberInfo?.value?.avatar || null)


// Invite Members panel state & handlers
const showInvitePanel = ref(false)
function openInvitePanel() {
  showInvitePanel.value = true
}
function closeInvitePanel() {
  showInvitePanel.value = false
}

</script>

<template>
  <header class="flex items-center justify-between p-6 bg-gray-900">
    <h1 class="text-2xl font-semibold text-white">{{ title }}</h1>
    <div class="flex items-center space-x-4">
      <button  v-if="canInvite" @click="openInvitePanel" class="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white">
        <i class="fa-solid fa-user-plus mr-2"></i>
        Invite Members 
      </button>
      <img :src="avatarUrl" alt="User Avatar" class="h-8 w-8 rounded-full bg-gray-600" />


    </div>

    <!-- Invite Members Modal -->
    <TeamInvitation
      :show="showInvitePanel"
      @close="closeInvitePanel"
    />
  </header>
</template>

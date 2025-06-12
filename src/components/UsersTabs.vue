<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="border-b border-gray-700 bg-gray-900 px-8">
    <RouterLink
      to="/teams/users/members"
      class="inline-block py-3 px-4 text-gray-100"
      active-class="border-b-2 border-indigo-500"
    >
      Members
    </RouterLink>

    <RouterLink
      to="/teams/users/invitations"
      class="inline-block py-3 px-4 text-gray-100"
      active-class="border-b-2 border-indigo-500"
    >
      Invitations
    </RouterLink>

  
    <RouterLink
      to="/teams/users/join-requests"
      class="inline-block py-3 px-4 text-gray-100"
      active-class="border-b-2 border-indigo-500"
    >
      Join Requests
    </RouterLink>

  </nav>
</template>

<style scoped>
nav {
  width: 100%;
}
</style>

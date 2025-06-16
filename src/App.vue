<script setup>
import { RouterView, useRoute } from 'vue-router'
import Header from './components/Header.vue'
import SideBar from './components/SideBar.vue'

const route = useRoute()
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <SideBar />

    <div class="flex-1 flex flex-col">
      <!-- Top Bar: pass the route’s name -->
      <Header :title="route.name" />

      <!-- Main Content -->
      <RouterView />
    </div>
  </div>
</template>

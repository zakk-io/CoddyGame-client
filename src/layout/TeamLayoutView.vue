<script setup>
import { RouterView, useRoute } from 'vue-router'
import Header from '../components/Header.vue'
import SideBar from '../components/SideBar.vue'
import { ref,onMounted,provide } from 'vue'
const route = useRoute()


const API_BASE_URI = import.meta.env.VITE_API_BASE_URI




const team = ref(null)

provide('team', team)

//fetch team api
const FetchTeam = async () => {
  const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}`,{
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'     
  }) 

  const data = await response.json()

  if(data.status === 'success' && data.code === '200') {
    team.value = data.team
  }

  //handle 404,400,403,500 errors
}



onMounted(() => {
  //fetch team api
  FetchTeam()
  
})
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <SideBar :teamId="route.params.team_id" :team="team"/>

    <div class="flex-1 flex flex-col">
      <!-- Top Bar: pass the route’s name -->
      <Header :title="route.name" />

      <!-- Main Content -->
      <RouterView />
    </div>
  </div>
</template>

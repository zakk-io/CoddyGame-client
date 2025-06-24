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




const boards = ref([])
provide('boards', boards)
//fetch team resources
const FetchTeamResources = async () => {
  const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/resources`,{
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'     
  }) 

  const data = await response.json()

  if(data.status === 'success' && data.code === 200) {
    boards.value = data.data
  }

  //handle 404,400,403,500 errors
}




const members = ref([])
provide('members', members)
//fetch team members
const FetchTeamMembers = async () => {
  const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/members`,{
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'     
  }) 

  const data = await response.json()

  if(data.status === 'success' && data.code === "200") {
    members.value = data.members
  }

  //handle 404,400,403,500 errors
}




const invitations = ref([])
provide('invitations', invitations)
//fetch team invitations
async function fetchInvitations() {
  try {
    const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/members/invitations`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'     
    }) 
  
    const data = await response.json()
  
    if(data.status === 'success' && data.code === '200') {
      invitations.value = data.data.invitations      
    }
  
    //handle 404,400,403,500 errors
  } catch (error) {
    console.error(error)
  }
}





const join_requests = ref([])
provide('join_requests', join_requests)
//fetch team invitations
async function fetchjoin_requests() {
  try {
    const response = await fetch(`${API_BASE_URI}/api/teams/${route.params.team_id}/join-requests?status=all`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'     
    }) 
  
    const data = await response.json()
  
    if(data.status === 'success' && data.code === '200') {
      join_requests.value = data.joinRequests  
    }
  
    //handle 404,400,403,500 errors
  } catch (error) {
    console.error(error)
  }
}







onMounted(async () => {
  try {
    await Promise.all([ FetchTeam(), FetchTeamResources(), FetchTeamMembers(), fetchInvitations(), fetchjoin_requests() ])
  } catch (e) {
    console.error('Failed to load team or resources:', e)
  }
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

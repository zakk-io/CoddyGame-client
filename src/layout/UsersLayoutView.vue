<script setup>
import { RouterView, useRoute } from 'vue-router'
import { ref,onMounted,provide } from 'vue'
import UsersTabs from '../components/UsersTabs.vue'

const route = useRoute()


const API_BASE_URI = import.meta.env.VITE_API_BASE_URI




</script>


<template>
<UsersTabs />
<div class="flex-1 overflow-auto p-6">
<RouterView />
</div>

</template>
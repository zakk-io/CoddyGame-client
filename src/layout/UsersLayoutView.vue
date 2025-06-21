<script setup>
import { RouterView, useRoute } from 'vue-router'
import { ref,onMounted,provide } from 'vue'
import UsersTabs from '../components/UsersTabs.vue'

const route = useRoute()



</script>


<template>
<UsersTabs />
<div class="flex-1 overflow-auto p-6">
<RouterView />
</div>

</template>
<script setup>
import { RouterView, useRoute } from 'vue-router'
import { onMounted,ref } from 'vue'
import Header from './components/Header.vue'
import SideBar from './components/SideBar.vue'


const route = useRoute()


</script>

<template>
      <RouterView />
</template>

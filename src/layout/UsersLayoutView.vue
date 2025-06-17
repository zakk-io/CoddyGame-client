<script setup>
import { RouterView, useRoute } from 'vue-router'

import UsersTabs from '../components/UsersTabs.vue'
</script>


<template>
<UsersTabs />
<div class="flex-1 overflow-auto p-6">
<RouterView />
</div>

</template>
<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  stream: { type: Object,  required: true },   // MediaStream
  id:     { type: String,  required: true },
})

const audioRef = ref(null)

onMounted(() => {
  audioRef.value.srcObject = props.stream
  audioRef.value.play?.().catch(() => {})      // Safari / autoplay guard
})

// if the track object is replaced later
watch(() => props.stream, s => {
  if (audioRef.value) audioRef.value.srcObject = s
})
</script>

<template>
    <audio
      :id="props.id"
      ref="audioRef"
      autoplay
      playsinline
    />
  </template>

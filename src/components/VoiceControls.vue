<script setup>
import { computed } from 'vue'


const props = defineProps({ audio: Object });
const {
  toggleLocalMute,
  toggleRemoteMute,
  isMuted,
  remoteMuted,
  participantCount
} = props.audio;

/* icon helpers  */
const micIcon     = computed(() =>
  isMuted.value ? 'fa-microphone-slash' : 'fa-microphone')
const speakerIcon = computed(() =>
  remoteMuted.value ? 'fa-volume-xmark' : 'fa-volume-high')
</script>

<template>
    <div
      id="controls"
      class="fixed bottom-4 inset-x-0 flex justify-center gap-6 z-50"
    >
      <!-- Mute / un-mute everyone else -->
      <button
        class="relative bg-gray-800 p-4 rounded-full text-white
               hover:bg-gray-700 focus:outline-none focus:ring"
        :title="remoteMuted ? 'Unmute others' : 'Mute others'"
        @click="toggleRemoteMute"
      >
        <i :class="['fa-solid', speakerIcon, 'text-xl']"></i>
  
        <span
          id="participantCount"
          class="absolute -top-2 -right-3 bg-red-500 h-5 min-w-[1.25rem]
                 text-xs font-bold rounded-full flex items-center justify-center px-1"
        >
          {{ participantCount }}
        </span>
      </button>
  
      <!-- Mute / un-mute myself -->
      <button
        class="bg-gray-800 p-4 rounded-full text-white
               hover:bg-gray-700 focus:outline-none focus:ring"
        :title="isMuted ? 'Unmute mic' : 'Mute mic'"
        @click="toggleLocalMute"
      >
        <i :class="['fa-solid', micIcon, 'text-xl']"></i>
      </button>
    </div>
  </template>
  

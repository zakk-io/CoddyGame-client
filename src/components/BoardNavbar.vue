<template>
  <nav class="bg-gray-900 text-gray-100 px-6 py-3 flex items-center border-b border-t border-gray-700">
    <!-- Left: Board Avatar + Name + Info -->
    <div class="flex items-center space-x-3">
      <i
        :class="[
          'h-10 w-10  flex items-center justify-center text-xl',
          boardIcon
        ]"
      ></i>

      <input
        type="text"
        :value="boardName"
        class="bg-gray-900 border-blue-600  px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <!-- Spacer -->
    <div class="flex-1"></div>

    <!-- Right: Icon Buttons -->
    <div class="flex items-center space-x-4">
      <button class="p-2 hover:bg-indigo-500 rounded text-sm" title="Run">
        <i class="fa-solid fa-play"></i>
      </button>
      <button class="p-2  hover:bg-gray-600 rounded-full text-sm" title="AI Assistant">
        <i class="fa-solid fa-robot"></i>
      </button>
      <button class="p-2 hover:bg-gray-600 rounded text-sm" title="Share">
        <i class="fa-solid fa-share-alt"></i>
      </button>
      <button class="p-2 hover:bg-gray-600 rounded text-sm" title="Export">
        <i class="fa-solid fa-download"></i>
      </button>
      <button class="p-2 hover:bg-gray-600 rounded text-sm" title="chatting">
        <i class="fa-solid fa-message"></i>
      </button>
    </div>
  </nav>
</template>

<script setup>
  const props = defineProps({
    boardId: {
      type: String,
      required: true
    },

    boardName: {
      type: String,
      default: 'Untitled'
    },

    boardIcon: {
      type: String,
      default: 'https://via.placeholder.com/32'
    }
  })
</script>

<style scoped>
/* Navbar shadow for SaaS feel */
nav {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}
</style>

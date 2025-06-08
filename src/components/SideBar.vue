<template>
        <aside class="w-64 bg-gray-800 flex-shrink-0">
      <div class="px-6 py-6 flex items-center justify-between border-b border-gray-700">
        <span class="text-xl font-bold">TeamFlow</span>
      </div>
      <div class="px-4 py-4">
        <div class="relative text-gray-400">
          <input type="text" placeholder="Search" class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i class="fa-solid fa-magnifying-glass text-gray-400"></i>
          </div>
        </div>
        <nav class="mt-6 space-y-2">
          <a href="#" class="flex items-center px-4 py-2 bg-gray-700 rounded-lg text-gray-100">
            <i class="fa-solid fa-house mr-3"></i>
            Home
          </a>
          <a href="#" class="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700">
            <i class="fa-solid fa-gear mr-3"></i>
            Settings
          </a>
          <a href="#" class="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700">
            <i class="fa-solid fa-users mr-3"></i>
            Users
          </a>
        </nav>
      </div>
    </aside>
</template>
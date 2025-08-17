<script setup>

</script>


<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold text-center mb-6 text-gray-700">Create Account 🚀</h2>

      <!-- Only OAuth Providers -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Create with</span>
          </div>
        </div>

        <div class="mt-6 space-y-3">
          <a href="http://127.0.0.1:3000/api/auth/oauth2/google" class="block">
            <button class="w-full text-gray-700 flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <img src="https://www.google.com/favicon.ico" alt="Google" class="h-5 w-5 mr-2">
              Google
            </button>
          </a>

          <a href="http://127.0.0.1:3000/api/auth/oauth2/linkedIn" class="block">
            <button class="w-full text-gray-700 flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <img src="https://www.linkedin.com/favicon.ico" alt="LinkedIn" class="h-5 w-5 mr-2">
              LinkedIn
            </button>
          </a>
        </div>
      </div>

      <p class="mt-4 text-center text-sm text-gray-600">
        Already have an account?
        <a href="/login" class="text-blue-600 hover:text-blue-700">Login</a>
      </p>
    </div>
  </div>
</template>
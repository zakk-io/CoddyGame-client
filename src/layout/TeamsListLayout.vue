<script setup>
import { ref, onMounted, computed } from 'vue'

const API_BASE_URI = import.meta.env.VITE_API_BASE_URI || ''

// --- State
const userTeams      = ref([])
const publicTeams    = ref([])
const loadingUser    = ref(true)
const loadingPublic  = ref(true)
const errorUser      = ref('')
const errorPublic    = ref('')

// Create Team modal/form state
const showCreate     = ref(false)
const creating       = ref(false)
const form           = ref({ name: '', type: 'public', description: '' })
const formError      = ref('')

// Join request local state per team
const joinBusy       = ref({})   // { [teamId]: true|false }
const joinStatus     = ref({})   // { [teamId]: 'pending'|'sent'|'error' }
const joinError      = ref({})   // { [teamId]: 'message' }

// --- Helpers
const hasUserTeams   = computed(() => userTeams.value && userTeams.value.length > 0)
const hasPublicTeams = computed(() => publicTeams.value && publicTeams.value.length > 0)

function avatarUrl(team){
  // fallback if backend didn't generate an avatar
  return team?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(team?.name || 'team')}`
}

function isoToDate(iso){
  try { return new Date(iso).toLocaleDateString() } catch { return '' }
}

// --- API Calls
async function fetchUserTeams(){
  loadingUser.value = true
  errorUser.value = ''
  try {
    const res = await fetch(`${API_BASE_URI}/api/teams`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    })
    const data = await res.json()
    if(!res.ok){
      // API returns 404 when no teams
      if(data?.message){ errorUser.value = data.message }
      userTeams.value = []
      return
    }
    userTeams.value = data?.teams || []
  } catch (e){
    errorUser.value = 'Failed to load your teams.'
  } finally {
    loadingUser.value = false
  }
}

async function fetchPublicTeams(){
  loadingPublic.value = true
  errorPublic.value = ''
  try {
    const res = await fetch(`${API_BASE_URI}/api/teams/public`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    })
    const data = await res.json()
    if(!res.ok){
      if(data?.message){ errorPublic.value = data.message }
      publicTeams.value = []
      return
    }
    publicTeams.value = data?.teams || []
  } catch (e){
    errorPublic.value = 'Failed to load public teams.'
  } finally {
    loadingPublic.value = false
  }
}

async function submitCreateTeam(){
  formError.value = ''
  if(!form.value.name.trim()){
    formError.value = 'Team name is required.'
    return
  }
  creating.value = true
  try {
    const res = await fetch(`${API_BASE_URI}/api/teams`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: form.value.name.trim(),
        type: form.value.type,
        description: form.value.description.trim()
      })
    })
    const data = await res.json()
    if(!res.ok){
      formError.value = data?.message || 'Failed to create team.'
      return
    }
    // optimistic: prepend to user teams
    if(data?.team){
      userTeams.value = [data.team, ...userTeams.value]
    }
    // reset & close
    form.value = { name: '', type: 'public', description: '' }
    showCreate.value = false
  } catch (e){
    formError.value = 'Network error while creating team.'
  } finally {
    creating.value = false
  }
}

/**
 * Send Join Request to backend:
 * Backend handler (your provided code) expects: req.params.team_id
 * Route assumed: POST /api/teams/:team_id/join
 * Success: 201 { status: "success", message: "join request has been sent successfully" }
 */
async function joinRequest(teamId){
  joinError.value[teamId] = ''
  joinStatus.value[teamId] = 'pending'
  joinBusy.value[teamId] = true
  try {
    const res = await fetch(`${API_BASE_URI}/api/teams/${teamId}/join`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    })
    const data = await res.json().catch(() => ({}))
    if(!res.ok){
      const msg = data?.message || 'Failed to send join request.'
      joinError.value[teamId] = msg
      joinStatus.value[teamId] = 'error'
      return
    }
    // success
    joinStatus.value[teamId] = 'sent'
    // Optional: remove the team card from public list after requesting
    // publicTeams.value = publicTeams.value.filter(t => t.id !== teamId)
  } catch (e){
    joinError.value[teamId] = 'Network error while sending request.'
    joinStatus.value[teamId] = 'error'
  } finally {
    joinBusy.value[teamId] = false
  }
}



// --- Cookie helper
  function setAuthCookieFromQuery(){
  const authToken = route.query.authToken
  if(authToken){
  document.cookie = `authToken=${authToken}; Path=/; Max-Age=${7*24*60*60}; Secure; SameSite=lax`
  // clean up URL to avoid leaving token in address bar/history
  router.replace({ query: {} })
  }
  }

onMounted(() => {
  setAuthCookieFromQuery()
  fetchUserTeams()
  fetchPublicTeams()
})
</script>

<template>
  <div class="space-y-8 p-10">
    <!-- Header / Create Button -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <i class="fa-solid fa-users text-slate-400"></i>
        <div>
          <h1 class="text-2xl font-semibold text-slate-100">Teams</h1>
          <p class="text-slate-400 text-sm">Create and explore teams across your workspace.</p>
        </div>
      </div>
      <button
        class="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 px-4 py-2 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        @click="showCreate = true"
      >
        <i class="fa-solid fa-plus"></i>
        Create team
      </button>
    </div>

    <!-- Your Teams -->
    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-user text-slate-400"></i>
          <h2 class="text-lg font-medium text-slate-100">Your teams</h2>
          <span class="text-xs text-slate-400">({{ userTeams.length }})</span>
        </div>
        <button class="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1" @click="fetchUserTeams">
          <i class="fa-solid fa-rotate-right"></i>
          Refresh
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="loadingUser" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="animate-pulse rounded-2xl bg-slate-800/60 p-4">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-full bg-slate-700"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-slate-700 rounded w-2/3"></div>
              <div class="h-3 bg-slate-700 rounded w-1/3"></div>
            </div>
          </div>
          <div class="mt-4 h-3 bg-slate-700 rounded w-5/6"></div>
        </div>
      </div>

      <!-- Empty / Error -->
      <div v-else-if="!hasUserTeams">
        <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-center">
          <p class="text-slate-300">{{ errorUser || 'You are not a member of any team yet.' }}</p>
          <div class="mt-4">
            <button class="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-white inline-flex items-center gap-2" @click="showCreate = true">
              <i class="fa-solid fa-plus"></i>
              Create your first team
            </button>
          </div>
        </div>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <article
          v-for="t in userTeams"
          :key="t.id"
          class="group rounded-2xl border border-slate-800 bg-slate-900/40 p-4 hover:border-indigo-700 hover:bg-slate-900/60 transition-colors"
        >
          <div class="flex items-start gap-4">
            <img :src="avatarUrl(t)" alt="avatar" class="h-12 w-12 rounded-full ring-2 ring-slate-800" />
            <div class="min-w-0">
              <h3 class="truncate text-slate-100 font-semibold group-hover:text-white">{{ t.name }}</h3>
              <p class="text-xs uppercase tracking-wide text-slate-400">{{ t.type }}</p>
            </div>
          </div>
          <p class="mt-3 line-clamp-2 text-sm text-slate-300">{{ t.description }}</p>
          <p class="mt-2 text-xs text-slate-500">Created {{ isoToDate(t.createdAt) }}</p>
          <div class="mt-3">
            <router-link :to="`/teams/${t.id}/workplace`" class="text-sm text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1">
              Open team
              <i class="fa-solid fa-arrow-right-long text-xs"></i>
            </router-link>
          </div>
        </article>
      </div>
    </section>

    <!-- Public Teams -->
    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-users text-slate-400"></i>
          <h2 class="text-lg font-medium text-slate-100">Public teams</h2>
          <span class="text-xs text-slate-400">({{ publicTeams.length }})</span>
        </div>
        <button class="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1" @click="fetchPublicTeams">
          <i class="fa-solid fa-rotate-right"></i>
          Refresh
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="loadingPublic" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="animate-pulse rounded-2xl bg-slate-800/60 p-4">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-full bg-slate-700"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-slate-700 rounded w-2/3"></div>
              <div class="h-3 bg-slate-700 rounded w-1/3"></div>
            </div>
          </div>
          <div class="mt-4 h-3 bg-slate-700 rounded w-5/6"></div>
        </div>
      </div>

      <!-- Empty / Error -->
      <div v-else-if="!hasPublicTeams">
        <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-center">
          <p class="text-slate-300">{{ errorPublic || 'No public teams found.' }}</p>
        </div>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <article
          v-for="t in publicTeams"
          :key="t.id"
          class="group rounded-2xl border border-slate-800 bg-slate-900/40 p-4 hover:border-indigo-700 hover:bg-slate-900/60 transition-colors"
        >
          <div class="flex items-start gap-4">
            <img :src="avatarUrl(t)" alt="avatar" class="h-12 w-12 rounded-full ring-2 ring-slate-800" />
            <div class="min-w-0">
              <h3 class="truncate text-slate-100 font-semibold group-hover:text-white">{{ t.name }}</h3>
              <p class="text-xs uppercase tracking-wide text-slate-400">{{ t.type }}</p>
            </div>
          </div>
          <p class="mt-3 line-clamp-2 text-sm text-slate-300">{{ t.description }}</p>
          <p class="mt-2 text-xs text-slate-500">Created {{ isoToDate(t.createdAt) }}</p>

          <!-- Join Request button / states -->
          <div class="mt-3">
            <button
              v-if="joinStatus[t.id] !== 'sent'"
              :disabled="joinBusy[t.id]"
              @click="joinRequest(t.id)"
              class="rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 px-3 py-1 text-sm text-white inline-flex items-center gap-2"
            >
              <i v-if="!joinBusy[t.id]" class="fa-solid fa-user-plus"></i>
              <svg v-else class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              <span>{{ joinBusy[t.id] ? 'Sending...' : 'Join request' }}</span>
            </button>

            <span
              v-else
              class="inline-flex items-center gap-2 rounded-xl border border-emerald-700/50 bg-emerald-900/30 text-emerald-300 px-3 py-1 text-sm"
            >
              <i class="fa-solid fa-check"></i>
              Request sent
            </span>

            <p v-if="joinStatus[t.id] === 'error'" class="mt-2 text-xs text-rose-400">
              <i class="fa-solid fa-triangle-exclamation mr-1"></i>{{ joinError[t.id] }}
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- Create Team Modal -->
    <div v-if="showCreate" class="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60" @click="showCreate = false"></div>
      <div class="relative z-10 w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-100">Create a new team</h3>
          <button class="p-1 rounded-lg hover:bg-slate-800" @click="showCreate = false" aria-label="Close">
            <i class="fa-solid fa-xmark text-slate-300"></i>
          </button>
        </div>

        <form class="mt-4 space-y-4" @submit.prevent="submitCreateTeam">
          <div>
            <label class="block text-sm text-slate-300 mb-1">Team name</label>
            <div class="relative">
              <i class="fa-solid fa-pen-nib absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
              <input
                v-model="form.name"
                type="text"
                placeholder="e.g., Security Research"
                class="w-full rounded-xl border border-slate-700 bg-slate-800/60 p-2.5 pl-9 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-slate-300 mb-1">Type</label>
              <div class="relative">
                <i class="fa-solid fa-eye absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                <select
                  v-model="form.type"
                  class="w-full rounded-xl border border-slate-700 bg-slate-800/60 p-2.5 pl-9 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm text-slate-300 mb-1">Visibility hint</label>
              <div class="text-xs text-slate-400 border border-slate-800 rounded-xl p-2.5 bg-slate-900/50">
                <i class="fa-solid fa-circle-info mr-1"></i>
                Public teams are discoverable. Private teams are invite-only.
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm text-slate-300 mb-1">Description</label>
            <div class="relative">
              <i class="fa-solid fa-align-left absolute left-3 top-3 text-slate-500 text-sm"></i>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="What is this team about?"
                class="w-full rounded-xl border border-slate-700 bg-slate-800/60 p-2.5 pl-9 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>
          </div>

          <p v-if="formError" class="text-sm text-rose-400">{{ formError }}</p>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button type="button" class="rounded-xl border border-slate-700 px-4 py-2 text-slate-300 hover:bg-slate-800 inline-flex items-center gap-2" @click="showCreate = false">
              <i class="fa-solid fa-ban"></i>
              Cancel
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 px-4 py-2 text-white"
            >
              <i v-if="!creating" class="fa-solid fa-circle-check"></i>
              <svg v-else class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
              <span>{{ creating ? 'Creating...' : 'Create team' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional line clamp utility if Tailwind plugin is not enabled */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

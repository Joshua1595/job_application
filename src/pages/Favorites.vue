<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { useJobStore } from '../stores/jobs'
import { useFavoriteStore } from '../stores/favorites'

const jobStore = useJobStore()
const favoriteStore = useFavoriteStore()

onMounted(async () => {
  await Promise.all([
    favoriteStore.fetchFavorites(),
    jobStore.fetchJobs(),
  ])
})

const favoriteJobs = computed(() => {
  return jobStore.jobs.filter((job) =>
    favoriteStore.favoriteJobIds.includes(String(job.id))
  )
})

const removeFavorite = async (jobId) => {
  try {
    await favoriteStore.removeFavorite(jobId)
  } catch (error) {
    console.error('Remove favorite error:', error)
  }
}

const clearFavorites = async () => {
  const confirmed = window.confirm(
    'Are you sure you want to remove all favorite jobs?'
  )
  if (!confirmed) return

  const jobs = [...favoriteStore.favoriteJobIds]

  try {
    for (const jobId of jobs) {
      await favoriteStore.removeFavorite(jobId)
    }
  } catch (error) {
    console.error('Clear favorites error:', error)
  }
}
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          Favorite jobs
        </h1>
        <p class="mt-2 text-lg text-slate-600">
          Jobs you’ve saved for later
        </p>
      </div>

      <button
        v-if="favoriteJobs.length > 0"
        type="button"
        @click="clearFavorites"
        class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
        Clear all
      </button>
    </div>

    <!-- Loading -->
    <div
      v-if="jobStore.loading || favoriteStore.loading"
      class="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm"
    >
      <div class="w-11 h-11 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
      <p class="mt-5 text-slate-600 font-medium">Loading favorites...</p>
    </div>

    <!-- Error -->
    <div
      v-else-if="jobStore.error || favoriteStore.error"
      class="bg-white border border-red-100 rounded-2xl p-12 text-center shadow-sm"
    >
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 text-red-500 mb-5">
        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-slate-900">Failed to load favorites</h2>
      <p class="mt-2 text-slate-600 max-w-md mx-auto">
        {{ favoriteStore.error || jobStore.error }}
      </p>
      <button
        type="button"
        @click="
          Promise.all([
            favoriteStore.fetchFavorites(),
            jobStore.fetchJobs(),
          ])
        "
        class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition"
      >
        Try again
      </button>
    </div>

    <!-- Empty -->
    <div
      v-else-if="favoriteJobs.length === 0"
      class="bg-white border border-slate-200 rounded-2xl p-14 text-center shadow-sm"
    >
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mb-5">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-slate-900">No favorites yet</h2>
      <p class="mt-2 text-slate-600 max-w-sm mx-auto">
        You haven’t saved any jobs. Browse opportunities and tap the heart to save ones you like.
      </p>
      <RouterLink
        to="/jobs"
        class="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition"
      >
        Browse jobs
      </RouterLink>
    </div>

    <!-- Favorites Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="job in favoriteJobs"
        :key="job.id"
        class="group bg-white border border-slate-200 rounded-2xl p-6 flex flex-col shadow-sm hover:border-slate-300 hover:shadow-md transition-all"
      >
        <div class="flex-1">
          <div class="flex items-start justify-between gap-3">
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-100">
              {{ job.type }}
            </span>

            <button
              type="button"
              @click="removeFavorite(job.id)"
              class="flex items-center justify-center w-9 h-9 rounded-full text-red-500 hover:bg-red-50 transition"
              title="Remove from favorites"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </button>
          </div>

          <h2 class="mt-4 text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition">
            {{ job.title }}
          </h2>
          <p class="mt-1.5 text-sm font-medium text-slate-600">
            {{ job.company }}
          </p>

          <div class="mt-4 space-y-2 text-sm text-slate-500">
            <p class="flex items-center gap-2">
              <svg class="w-4 h-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {{ job.location }}
            </p>
            <p class="flex items-center gap-2">
              <svg class="w-4 h-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              {{ job.category }}
            </p>
            <p class="flex items-center gap-2">
              <svg class="w-4 h-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ job.salary || 'Salary not specified' }}
            </p>
          </div>

          <p class="mt-4 text-sm text-slate-500 line-clamp-3 leading-relaxed">
            {{ job.description }}
          </p>
        </div>

        <!-- Actions -->
        <div class="mt-6 pt-5 border-t border-slate-100 flex gap-3">
          <RouterLink
            :to="`/jobs/${job.id}`"
            class="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition"
          >
            View details
          </RouterLink>

          <button
            type="button"
            @click="removeFavorite(job.id)"
            class="px-4 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
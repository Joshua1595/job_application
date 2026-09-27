<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useJobStore } from '../stores/jobs'
import { useFavoriteStore } from '../stores/favorites'
import { getJobById } from '../services/jobs'

const route = useRoute()
const jobStore = useJobStore()
const favoriteStore = useFavoriteStore()

const job = ref(null)
const loading = ref(true)
const error = ref(null)

const isFavorite = computed(() => {
  return job.value ? favoriteStore.isFavorite(job.value.id) : false
})

const toggleFavorite = async () => {
  if (!job.value) return

  try {
    await favoriteStore.toggleFavorite(job.value.id)
  } catch (error) {
    console.error('Toggle favorite error:', error)
  }
}

const fetchJob = async () => {
  loading.value = true
  error.value = null
  job.value = null

  try {
    const data = await getJobById(route.params.id)
    job.value = data.job
  } catch (err) {
    console.error('Fetch job error:', err)

    if (err.response?.status === 404) {
      error.value = 'The job you are looking for does not exist.'
    } else {
      error.value =
        err.response?.data?.message ||
        'Failed to load job details.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchJob()
})
</script>

<template>
  <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
    <!-- Back -->
    <RouterLink
      to="/jobs"
      class="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition mb-8"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      Back to jobs
    </RouterLink>

    <!-- Loading -->
    <div
      v-if="loading"
      class="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm"
    >
      <div class="w-11 h-11 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
      <p class="mt-5 text-slate-600 font-medium">Loading job details...</p>
    </div>

    <!-- Error / Not Found -->
    <div
      v-else-if="error"
      class="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm"
    >
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 text-slate-400 mb-5">
        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-slate-900">Job not found</h1>
      <p class="mt-2 text-slate-600 max-w-md mx-auto">
        {{ error }}
      </p>
      <div class="mt-7 flex flex-col sm:flex-row justify-center gap-3">
        <button
          type="button"
          @click="fetchJob"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition"
        >
          Try again
        </button>
        <RouterLink
          to="/jobs"
          class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
        >
          Browse jobs
        </RouterLink>
      </div>
    </div>

    <!-- Job Details -->
    <div v-else-if="job" class="space-y-6">
      <!-- Header Card -->
      <div class="bg-white border border-slate-200 rounded-2xl p-7 md:p-8 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <!-- Main Info -->
          <div class="min-w-0">
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-100 mb-4">
              {{ job.type }}
            </span>

            <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              {{ job.title }}
            </h1>

            <p class="mt-3 text-xl font-medium text-slate-600">
              {{ job.company }}
            </p>
          </div>

          <!-- Salary + Location -->
          <div class="md:text-right shrink-0">
            <p class="text-lg font-bold text-slate-900">
              {{ job.salary || 'Salary not specified' }}
            </p>
            <p class="mt-1.5 flex items-center gap-1.5 text-slate-500 md:justify-end">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {{ job.location }}
            </p>
          </div>
        </div>

        <!-- Category -->
        <div class="mt-6">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {{ job.category }}
          </span>
        </div>

        <!-- Actions -->
        <div class="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            @click="toggleFavorite"
            :class="
              isFavorite
                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                : 'bg-blue-600 text-white border-transparent hover:bg-blue-700 shadow-lg shadow-blue-600/25'
            "
            class="inline-flex items-center justify-center gap-2 px-6 py-3 border text-sm font-semibold rounded-xl transition-all"
          >
            <svg
              v-if="isFavorite"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <svg
              v-else
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            {{ isFavorite ? 'Remove from favorites' : 'Save job' }}
          </button>

          <RouterLink
            :to="`/jobs/${job.id}/apply`"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition"
          >
            Apply now
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </RouterLink>
        </div>
      </div>

      <!-- Description -->
      <div class="bg-white border border-slate-200 rounded-2xl p-7 md:p-8 shadow-sm">
        <h2 class="text-xl font-bold text-slate-900">
          Job description
        </h2>
        <p class="mt-4 text-slate-600 leading-relaxed whitespace-pre-line">
          {{ job.description }}
        </p>
      </div>

      <!-- Requirements -->
      <div class="bg-white border border-slate-200 rounded-2xl p-7 md:p-8 shadow-sm">
        <h2 class="text-xl font-bold text-slate-900">
          Requirements
        </h2>

        <ul
          v-if="job.requirements && job.requirements.length > 0"
          class="mt-5 space-y-3"
        >
          <li
            v-for="(requirement, index) in job.requirements"
            :key="index"
            class="flex items-start gap-3 text-slate-600"
          >
            <span class="flex items-center justify-center w-5 h-5 mt-0.5 rounded-full bg-blue-50 text-blue-600 shrink-0">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </span>
            <span>{{ requirement }}</span>
          </li>
        </ul>

        <p v-else class="mt-4 text-slate-500">
          No specific requirements listed.
        </p>
      </div>
    </div>
  </section>
</template>
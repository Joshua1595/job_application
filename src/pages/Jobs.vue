<script setup>
import { computed, onMounted, ref } from 'vue'
import { useJobStore } from '../stores/jobs'
import JobCard from '../components/JobCard.vue'

const jobStore = useJobStore()

const searchQuery = ref('')
const selectedLocation = ref('')
const selectedType = ref('')
const selectedCategory = ref('')

onMounted(() => {
  jobStore.fetchJobs()
})

const locations = computed(() => jobStore.locations)
const jobTypes = computed(() => jobStore.jobTypes)
const categories = computed(() => jobStore.categories)

const filteredJobs = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  return jobStore.jobs.filter((job) => {
    const matchesSearch =
      !query ||
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query)

    const matchesLocation =
      !selectedLocation.value ||
      job.location === selectedLocation.value

    const matchesType =
      !selectedType.value ||
      job.type === selectedType.value

    const matchesCategory =
      !selectedCategory.value ||
      job.category === selectedCategory.value

    return (
      matchesSearch &&
      matchesLocation &&
      matchesType &&
      matchesCategory
    )
  })
})

const hasActiveFilters = computed(() =>
  searchQuery.value ||
  selectedLocation.value ||
  selectedType.value ||
  selectedCategory.value
)

const clearFilters = () => {
  searchQuery.value = ''
  selectedLocation.value = ''
  selectedType.value = ''
  selectedCategory.value = ''
}

const retryFetchJobs = () => {
  jobStore.fetchJobs()
}
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
    <!-- Page Header -->
    <div class="mb-10">
      <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
        Find your next role
      </h1>
      <p class="mt-3 text-lg text-slate-600 max-w-2xl">
        Search thousands of opportunities and filter by location, type, and category.
      </p>
    </div>

    <!-- Loading State -->
    <div
      v-if="jobStore.loading"
      class="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm"
    >
      <div class="w-11 h-11 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
      <p class="mt-5 text-slate-600 font-medium">
        Loading opportunities...
      </p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="jobStore.error"
      class="bg-white border border-red-100 rounded-2xl p-12 text-center shadow-sm"
    >
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 text-red-500 mb-5">
        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-slate-900">
        Failed to load jobs
      </h2>
      <p class="mt-2 text-slate-600 max-w-md mx-auto">
        {{ jobStore.error }}
      </p>
      <button
        type="button"
        @click="retryFetchJobs"
        class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
        </svg>
        Try again
      </button>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Search & Filters Card -->
      <div class="bg-white border border-slate-200 rounded-2xl p-6 md:p-7 mb-8 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          <!-- Search -->
          <div class="lg:col-span-5">
            <label for="search" class="block text-sm font-medium text-slate-700 mb-1.5">
              Search
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input
                id="search"
                v-model="searchQuery"
                type="text"
                placeholder="Job title or company..."
                class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>

          <!-- Location -->
          <div class="lg:col-span-2">
            <label for="location" class="block text-sm font-medium text-slate-700 mb-1.5">
              Location
            </label>
            <select
              id="location"
              v-model="selectedLocation"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none"
            >
              <option value="">All locations</option>
              <option
                v-for="location in locations"
                :key="location"
                :value="location"
              >
                {{ location }}
              </option>
            </select>
          </div>

          <!-- Job Type -->
          <div class="lg:col-span-2">
            <label for="type" class="block text-sm font-medium text-slate-700 mb-1.5">
              Job type
            </label>
            <select
              id="type"
              v-model="selectedType"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none"
            >
              <option value="">All types</option>
              <option
                v-for="type in jobTypes"
                :key="type"
                :value="type"
              >
                {{ type }}
              </option>
            </select>
          </div>

          <!-- Category -->
          <div class="lg:col-span-2">
            <label for="category" class="block text-sm font-medium text-slate-700 mb-1.5">
              Category
            </label>
            <select
              id="category"
              v-model="selectedCategory"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none"
            >
              <option value="">All categories</option>
              <option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>

          <!-- Clear -->
          <div class="lg:col-span-1 flex items-end">
            <button
              type="button"
              @click="clearFilters"
              :disabled="!hasActiveFilters"
              class="w-full px-4 py-3 text-sm font-medium text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <!-- Results Header -->
      <div class="flex items-center justify-between mb-6">
        <p class="text-slate-600">
          <span class="font-semibold text-slate-900">{{ filteredJobs.length }}</span>
          {{ filteredJobs.length === 1 ? 'job' : 'jobs' }} found
          <span v-if="hasActiveFilters" class="text-slate-400"> · filtered</span>
        </p>
      </div>

      <!-- Job Results -->
      <div
        v-if="filteredJobs.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <JobCard
          v-for="job in filteredJobs"
          :key="job.id"
          :job="job"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="bg-white border border-slate-200 rounded-2xl p-14 text-center shadow-sm"
      >
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 text-slate-400 mb-5">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-slate-900">
          No jobs found
        </h2>
        <p class="mt-2 text-slate-600 max-w-sm mx-auto">
          Try adjusting your search or clearing the filters to see more results.
        </p>
        <button
          type="button"
          @click="clearFilters"
          class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition"
        >
          Clear all filters
        </button>
      </div>
    </div>
  </section>
</template>
<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { useAdminStore } from '../stores/admin'
import { useJobManagementStore } from '../stores/jobManagement'

const adminStore = useAdminStore()
const jobManagementStore = useJobManagementStore()

onMounted(() => {
  adminStore.fetchJobs()
})

const deleteJob = async (job) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${job.title}"? This action cannot be undone.`
  )

  if (!confirmed) return

  try {
    await jobManagementStore.removeJob(job.id)
    adminStore.jobs = adminStore.jobs.filter(
      (item) => item.id !== job.id
    )
  } catch (error) {
    // Error is already stored in jobManagementStore
  }
}
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          Admin job management
        </h1>
        <p class="mt-2 text-lg text-slate-600">
          Oversee all job listings and their employers across the platform
        </p>
      </div>

      <RouterLink
        to="/manage-jobs/create"
        class="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Create job
      </RouterLink>
    </div>

    <!-- Loading -->
    <div
      v-if="adminStore.loading"
      class="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm"
    >
      <div class="w-11 h-11 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
      <p class="mt-5 text-slate-600 font-medium">Loading jobs...</p>
    </div>

    <!-- Error -->
    <div
      v-else-if="adminStore.error"
      class="bg-white border border-red-100 rounded-2xl p-12 text-center shadow-sm"
    >
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 text-red-500 mb-5">
        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-slate-900">Failed to load jobs</h2>
      <p class="mt-2 text-slate-600 max-w-md mx-auto">
        {{ adminStore.error }}
      </p>
      <button
        type="button"
        @click="adminStore.fetchJobs()"
        class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition"
      >
        Try again
      </button>
    </div>

    <!-- Empty -->
    <div
      v-else-if="adminStore.jobs.length === 0"
      class="bg-white border border-slate-200 rounded-2xl p-14 text-center shadow-sm"
    >
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mb-5">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-slate-900">No jobs yet</h2>
      <p class="mt-2 text-slate-600 max-w-sm mx-auto">
        No job listings have been created on the platform yet.
      </p>
      <RouterLink
        to="/manage-jobs/create"
        class="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Create first job
      </RouterLink>
    </div>

    <!-- Jobs List -->
    <div v-else class="space-y-4">
      <div
        v-for="job in adminStore.jobs"
        :key="job.id"
        class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition-all"
      >
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <!-- Job Info -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-3">
              <h2 class="text-lg font-bold text-slate-900">
                {{ job.title }}
              </h2>
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                {{ job.type }}
              </span>
            </div>

            <p class="mt-1.5 text-sm font-medium text-slate-600">
              {{ job.company }}
            </p>

            <!-- Meta grid -->
            <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Location
                </p>
                <p class="mt-1 text-sm font-medium text-slate-800">
                  {{ job.location }}
                </p>
              </div>

              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Category
                </p>
                <p class="mt-1 text-sm font-medium text-slate-800">
                  {{ job.category }}
                </p>
              </div>

              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Salary
                </p>
                <p class="mt-1 text-sm font-medium text-slate-800">
                  {{ job.salary || 'Not specified' }}
                </p>
              </div>

              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Employer
                </p>
                <p class="mt-1 text-sm font-medium text-slate-800">
                  {{ job.employer_name || 'N/A' }}
                </p>
                <p
                  v-if="job.employer_email"
                  class="text-xs text-slate-500 mt-0.5"
                >
                  {{ job.employer_email }}
                </p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-2 shrink-0">
            <RouterLink
              :to="`/manage-jobs/${job.id}/edit`"
              class="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
              Edit
            </RouterLink>

            <button
              type="button"
              @click="deleteJob(job)"
              :disabled="jobManagementStore.loading"
              class="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useApplicationStore } from '../stores/applications'

const applicationStore = useApplicationStore()

const applications = computed(() => applicationStore.applications)

onMounted(async () => {
  await applicationStore.fetchApplications()
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const deleteApplication = async (id) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this application? This action cannot be undone.'
  )
  if (!confirmed) return

  try {
    await applicationStore.removeApplication(id)
  } catch (error) {
    console.error('Delete application error:', error)
  }
}

const statusClasses = (status) => {
  const classes = {
    Applied: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
    Reviewing: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
    Interview: 'bg-violet-50 text-violet-700 ring-1 ring-violet-100',
    Accepted: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
    Rejected: 'bg-red-50 text-red-700 ring-1 ring-red-100',
  }

  return classes[status] || 'bg-slate-50 text-slate-700 ring-1 ring-slate-100'
}

const statusTextColor = (status) => {
  if (status === 'Accepted') return 'text-emerald-600'
  if (status === 'Rejected') return 'text-red-600'
  return 'text-slate-900'
}
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          My applications
        </h1>
        <p class="mt-2 text-lg text-slate-600">
          Track the status of every job you’ve applied to
        </p>
      </div>

      <RouterLink
        to="/jobs"
        class="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        Browse jobs
      </RouterLink>
    </div>

    <!-- Loading -->
    <div
      v-if="applicationStore.loading"
      class="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm"
    >
      <div class="w-11 h-11 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
      <p class="mt-5 text-slate-600 font-medium">Loading applications...</p>
    </div>

    <!-- Error -->
    <div
      v-else-if="applicationStore.error"
      class="bg-white border border-red-100 rounded-2xl p-12 text-center shadow-sm"
    >
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 text-red-500 mb-5">
        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-slate-900">Failed to load applications</h2>
      <p class="mt-2 text-slate-600 max-w-md mx-auto">
        {{ applicationStore.error }}
      </p>
      <button
        type="button"
        @click="applicationStore.fetchApplications()"
        class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition"
      >
        Try again
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="applications.length === 0"
      class="bg-white border border-slate-200 rounded-2xl p-14 text-center shadow-sm"
    >
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mb-5">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m6.75 0a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25h10.5z" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-slate-900">No applications yet</h2>
      <p class="mt-2 text-slate-600 max-w-sm mx-auto">
        You haven’t applied to any jobs. Start browsing opportunities and submit your first application.
      </p>
      <RouterLink
        to="/jobs"
        class="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition"
      >
        Browse jobs
      </RouterLink>
    </div>

    <!-- Applications List -->
    <div v-else class="space-y-5">
      <div
        v-for="application in applications"
        :key="application.id"
        class="bg-white border border-slate-200 rounded-2xl p-6 md:p-7 shadow-sm hover:border-slate-300 hover:shadow-md transition-all"
      >
        <!-- Top -->
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div class="min-w-0">
            <h2 class="text-lg font-bold text-slate-900">
              {{ application.job_title }}
            </h2>
            <p class="mt-1 text-sm font-medium text-slate-600">
              {{ application.company }}
            </p>
          </div>

          <span
            class="inline-flex items-center w-fit px-3 py-1 rounded-full text-xs font-semibold"
            :class="statusClasses(application.status)"
          >
            {{ application.status }}
          </span>
        </div>

        <!-- Info Grid -->
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Applicant</p>
            <p class="mt-1 text-sm font-medium text-slate-800">{{ application.full_name }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Email</p>
            <p class="mt-1 text-sm font-medium text-slate-800 truncate">{{ application.email }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Phone</p>
            <p class="mt-1 text-sm font-medium text-slate-800">{{ application.phone }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Applied</p>
            <p class="mt-1 text-sm font-medium text-slate-800">{{ formatDate(application.applied_at) }}</p>
          </div>
        </div>

        <!-- Status Note -->
        <div class="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
            Current status
          </p>
          <p
            class="mt-1 text-sm font-semibold"
            :class="statusTextColor(application.status)"
          >
            {{ application.status }}
          </p>
          <p class="mt-1 text-sm text-slate-500">
            The employer will update your application status when there’s news.
          </p>
        </div>

        <!-- Cover Letter -->
        <div class="mt-6 pt-6 border-t border-slate-100">
          <h3 class="text-sm font-semibold text-slate-900">Cover letter</h3>
          <p class="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {{ application.cover_letter }}
          </p>
        </div>

        <!-- Actions -->
        <div class="mt-6 pt-5 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            @click="deleteApplication(application.id)"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Delete application
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
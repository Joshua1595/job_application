<script setup>
import { computed, onMounted, ref } from 'vue'
import { useEmployerApplicationStore } from '../stores/employerApplications'
import { updateApplicationStatus } from '../services/applications'

const applicationStore = useEmployerApplicationStore()

const applications = computed(() => applicationStore.applications || [])

const updatingId = ref(null)
const updateError = ref('')

onMounted(async () => {
  try {
    await applicationStore.fetchApplications()
  } catch (error) {
    console.error('Load employer applications error:', error)
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
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

const updateStatus = async (application, status) => {
  updateError.value = ''
  updatingId.value = application.id

  try {
    const data = await updateApplicationStatus(application.id, status)

    const index = applicationStore.applications.findIndex(
      (item) => String(item.id) === String(application.id)
    )

    if (index !== -1) {
      applicationStore.applications[index] = {
        ...applicationStore.applications[index],
        status: data.application.status,
      }
    }
  } catch (error) {
    console.error('Update application status error:', error)
    updateError.value =
      error.response?.data?.message ||
      'Failed to update application status'
  } finally {
    updatingId.value = null
  }
}
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
    <!-- Header -->
    <div class="mb-10">
      <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
        Applications
      </h1>
      <p class="mt-2 text-lg text-slate-600">
        Review and manage applications submitted to your jobs
      </p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Total</p>
        <p class="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          {{ applicationStore.applicationCount }}
        </p>
      </div>
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Applied</p>
        <p class="mt-2 text-2xl font-bold tracking-tight text-blue-600">
          {{ applicationStore.appliedCount }}
        </p>
      </div>
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Reviewing</p>
        <p class="mt-2 text-2xl font-bold tracking-tight text-amber-600">
          {{ applicationStore.reviewingCount }}
        </p>
      </div>
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Interview</p>
        <p class="mt-2 text-2xl font-bold tracking-tight text-violet-600">
          {{ applicationStore.interviewCount }}
        </p>
      </div>
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Accepted</p>
        <p class="mt-2 text-2xl font-bold tracking-tight text-emerald-600">
          {{ applicationStore.acceptedCount }}
        </p>
      </div>
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

    <!-- Empty -->
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
        You don’t have any applications for your jobs yet. Once candidates apply, they’ll appear here.
      </p>
    </div>

    <!-- Applications List -->
    <div v-else class="space-y-5">
      <!-- Update Error -->
      <div
        v-if="updateError"
        class="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm"
      >
        <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <span>{{ updateError }}</span>
      </div>

      <div
        v-for="application in applications"
        :key="application.id"
        class="bg-white border border-slate-200 rounded-2xl p-6 md:p-7 shadow-sm hover:border-slate-300 hover:shadow-md transition-all"
      >
        <!-- Job + Status -->
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

        <!-- Applicant Info -->
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

        <!-- Status Update -->
        <div class="mt-6 pt-5 border-t border-slate-100">
          <label
            :for="`status-${application.id}`"
            class="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Update status
          </label>
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              :id="`status-${application.id}`"
              :value="application.status"
              :disabled="updatingId === application.id"
              @change="updateStatus(application, $event.target.value)"
              class="w-full sm:w-56 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50 transition appearance-none"
            >
              <option value="Applied">Applied</option>
              <option value="Reviewing">Reviewing</option>
              <option value="Interview">Interview</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>

            <p
              v-if="updatingId === application.id"
              class="text-sm text-slate-500 flex items-center gap-2"
            >
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Updating...
            </p>
          </div>
        </div>

        <!-- Cover Letter -->
        <div class="mt-6 pt-5 border-t border-slate-100">
          <h3 class="text-sm font-semibold text-slate-900">Cover letter</h3>
          <p class="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {{ application.cover_letter }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
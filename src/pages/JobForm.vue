<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getJobById } from '../services/jobs'
import { useJobManagementStore } from '../stores/jobManagement'

const route = useRoute()
const router = useRouter()
const jobManagementStore = useJobManagementStore()

const isEditMode = computed(() => !!route.params.id)

const loadingJob = ref(false)
const submitError = ref('')

const form = reactive({
  title: '',
  company: '',
  location: '',
  type: '',
  category: '',
  salary: '',
  description: '',
  requirements: '',
})

const loadJob = async () => {
  if (!isEditMode.value) return

  loadingJob.value = true

  try {
    const data = await getJobById(route.params.id)
    const job = data.job

    form.title = job.title
    form.company = job.company
    form.location = job.location
    form.type = job.type
    form.category = job.category
    form.salary = job.salary || ''
    form.description = job.description
    form.requirements = Array.isArray(job.requirements)
      ? job.requirements.join('\n')
      : ''
  } catch (error) {
    console.error('Load job error:', error)
    submitError.value =
      error.response?.data?.message || 'Failed to load job'
  } finally {
    loadingJob.value = false
  }
}

onMounted(() => {
  loadJob()
})

const submitJob = async () => {
  submitError.value = ''

  if (
    !form.title.trim() ||
    !form.company.trim() ||
    !form.location.trim() ||
    !form.type.trim() ||
    !form.category.trim() ||
    !form.description.trim()
  ) {
    submitError.value = 'Please fill in all required fields.'
    return
  }

  const requirements = form.requirements
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

  const jobData = {
    title: form.title.trim(),
    company: form.company.trim(),
    location: form.location.trim(),
    type: form.type.trim(),
    category: form.category.trim(),
    salary: form.salary.trim(),
    description: form.description.trim(),
    requirements,
  }

  try {
    if (!isEditMode.value) {
      await jobManagementStore.addJob(jobData)
      await jobManagementStore.fetchMyJobs()
    } else {
      await jobManagementStore.editJob(route.params.id, jobData)
      await jobManagementStore.fetchMyJobs()
    }

    await router.push('/manage-jobs')
  } catch (error) {
    console.error('Save job error:', error)
    submitError.value =
      jobManagementStore.error ||
      error.response?.data?.message ||
      'Failed to save job'
  }
}
</script>

<template>
  <section class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
    <!-- Header -->
    <div class="mb-10">
      <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
        {{ isEditMode ? 'Edit job' : 'Create job' }}
      </h1>
      <p class="mt-2 text-lg text-slate-600">
        {{
          isEditMode
            ? 'Update the details of your job listing.'
            : 'Fill in the details to publish a new opportunity.'
        }}
      </p>
    </div>

    <!-- Loading -->
    <div
      v-if="loadingJob"
      class="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm"
    >
      <div class="w-11 h-11 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
      <p class="mt-5 text-slate-600 font-medium">Loading job...</p>
    </div>

    <!-- Form -->
    <form
      v-else
      @submit.prevent="submitJob"
      class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm"
    >
      <!-- Error -->
      <div
        v-if="submitError"
        class="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm"
      >
        <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <span>{{ submitError }}</span>
      </div>

      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1.5">
          Job title <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.title"
          type="text"
          placeholder="e.g. Frontend Developer"
          class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
        />
      </div>

      <!-- Company -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1.5">
          Company <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.company"
          type="text"
          placeholder="e.g. Tech Solutions PLC"
          class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
        />
      </div>

      <!-- Location + Type -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">
            Location <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.location"
            type="text"
            placeholder="e.g. Addis Ababa"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">
            Job type <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.type"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none"
          >
            <option value="">Select type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
      </div>

      <!-- Category + Salary -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">
            Category <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.category"
            type="text"
            placeholder="e.g. Software Development"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">
            Salary
          </label>
          <input
            v-model="form.salary"
            type="text"
            placeholder="e.g. ETB 25,000 – 40,000"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1.5">
          Description <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="form.description"
          rows="6"
          placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
          class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-y"
        ></textarea>
      </div>

      <!-- Requirements -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1.5">
          Requirements
        </label>
        <textarea
          v-model="form.requirements"
          rows="5"
          placeholder="Bachelor's degree in Computer Science&#10;2+ years of JavaScript experience&#10;Familiarity with React"
          class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-y"
        ></textarea>
        <p class="mt-2 text-sm text-slate-500">
          Enter one requirement per line.
        </p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
        <button
          type="button"
          @click="router.push('/manage-jobs')"
          class="px-5 py-3 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          :disabled="jobManagementStore.loading"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          <svg
            v-if="jobManagementStore.loading"
            class="w-4 h-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{
            jobManagementStore.loading
              ? 'Saving...'
              : isEditMode
                ? 'Update job'
                : 'Create job'
          }}
        </button>
      </div>
    </form>
  </section>
</template>
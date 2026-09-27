<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useJobStore } from '../stores/jobs'
import { useApplicationStore } from '../stores/applications'

const route = useRoute()
const router = useRouter()

const jobStore = useJobStore()
const applicationStore = useApplicationStore()

const loading = ref(true)
const error = ref(null)
const submitError = ref('')

const job = computed(() => {
  return jobStore.getJobById(route.params.id)
})

const hasApplied = computed(() => {
  return applicationStore.hasApplied(route.params.id)
})

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  coverLetter: '',
})

onMounted(async () => {
  if (jobStore.jobs.length === 0) {
    await jobStore.fetchJobs()
  }

  loading.value = false

  if (!job.value) {
    error.value = 'The job you are looking for does not exist.'
  }
})

const submitApplication = async () => {
  submitError.value = ''

  if (applicationStore.hasApplied(route.params.id)) {
    submitError.value =
      'You have already applied for this job.'

    return
  }

  if (
    !form.fullName.trim() ||
    !form.email.trim() ||
    !form.phone.trim() ||
    !form.coverLetter.trim()
  ) {
    submitError.value =
      'Please fill in all required fields.'

    return
  }

  try {
    await applicationStore.addApplication({
      jobId: String(job.value.id),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      coverLetter: form.coverLetter.trim(),
    })

    router.push('/applications')
  } catch (error) {
    submitError.value =
      error.response?.data?.message ||
      'Failed to submit application.'
  }
}
</script>

<template>
  <section
    class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
  >

    <!-- Back -->
    <RouterLink
      :to="`/jobs/${route.params.id}`"
      class="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
    >
      ← Back to Job
    </RouterLink>

    <!-- Loading -->
    <div
      v-if="loading"
      class="bg-white border border-gray-200 rounded-xl p-10 text-center"
    >
      <div
        class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"
      ></div>

      <p class="mt-4 text-gray-600">
        Loading job...
      </p>
    </div>

    <!-- Job Not Found -->
    <div
      v-else-if="error"
      class="bg-white border border-gray-200 rounded-xl p-8 text-center"
    >
      <h1 class="text-2xl font-bold text-gray-900">
        Job Not Found
      </h1>

      <p class="mt-2 text-gray-600">
        {{ error }}
      </p>

      <RouterLink
        to="/jobs"
        class="inline-block mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Browse Jobs
      </RouterLink>
    </div>

    <!-- Already Applied -->
    <div
      v-else-if="hasApplied"
      class="bg-white border border-gray-200 rounded-xl p-8 text-center"
    >
      <div class="text-5xl mb-4">
        ✓
      </div>

      <h1 class="text-2xl font-bold text-gray-900">
        Already Applied
      </h1>

      <p class="mt-2 text-gray-600">
        You have already submitted an application for
        <span class="font-semibold">
          {{ job.title }}
        </span>
        at
        <span class="font-semibold">
          {{ job.company }}
        </span>.
      </p>

      <div
        class="mt-6 flex flex-col sm:flex-row justify-center gap-3"
      >
        <RouterLink
          to="/applications"
          class="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          View Applications
        </RouterLink>

        <RouterLink
          to="/jobs"
          class="px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
        >
          Browse Jobs
        </RouterLink>
      </div>
    </div>

    <!-- Application Form -->
    <div
      v-else-if="job"
      class="bg-white border border-gray-200 rounded-xl p-8"
    >

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Apply for {{ job.title }}
        </h1>

        <p class="mt-2 text-gray-600">
          {{ job.company }} · {{ job.location }}
        </p>
      </div>

      <!-- Error -->
      <div
        v-if="submitError"
        class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg"
      >
        {{ submitError }}
      </div>

      <form
        @submit.prevent="submitApplication"
        class="space-y-6"
      >

        <!-- Full Name -->
        <div>
          <label
            for="fullName"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Full Name
          </label>

          <input
            id="fullName"
            v-model="form.fullName"
            type="text"
            placeholder="Enter your full name"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Email -->
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>

          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Phone -->
        <div>
          <label
            for="phone"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number
          </label>

          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            placeholder="Enter your phone number"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Cover Letter -->
        <div>
          <label
            for="coverLetter"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Cover Letter
          </label>

          <textarea
            id="coverLetter"
            v-model="form.coverLetter"
            rows="7"
            placeholder="Write your cover letter..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <!-- Actions -->
        <div
          class="flex flex-col sm:flex-row gap-3 pt-2"
        >
          <button
            type="submit"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Submit Application
          </button>

          <RouterLink
            :to="`/jobs/${job.id}`"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition text-center"
          >
            Cancel
          </RouterLink>
        </div>

      </form>
    </div>

  </section>
</template>
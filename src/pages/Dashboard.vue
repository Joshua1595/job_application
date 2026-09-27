<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { useDashboardStore } from '../stores/dashboard'
import { useAuthStore } from '../stores/auth'
import { useJobManagementStore } from '../stores/jobManagement'

const dashboardStore = useDashboardStore()
const authStore = useAuthStore()
const jobManagementStore = useJobManagementStore()

const user = computed(() => {
  return authStore.user
})

const isStudent = computed(() => {
  return user.value?.role === 'student'
})

const isEmployer = computed(() => {
  return user.value?.role === 'employer'
})

const isAdmin = computed(() => {
  return user.value?.role === 'admin'
})

const isEmployerOrAdmin = computed(() => {
  return isEmployer.value || isAdmin.value
})

const managementJobs = computed(() => {
  return jobManagementStore.jobs || []
})

const availableJobsCount = computed(() => {
  return managementJobs.value.length
})

onMounted(async () => {
  if (isStudent.value) {
    try {
      await dashboardStore.fetchDashboard()
    } catch (error) {
      console.error(
        'Load student dashboard error:',
        error
      )
    }
  }

  if (isEmployerOrAdmin.value) {
    try {
      await jobManagementStore.fetchMyJobs()
    } catch (error) {
      console.error(
        'Load employer/admin jobs error:',
        error
      )
    }
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const statusClasses = (status) => {
  const classes = {
    Applied: 'bg-blue-100 text-blue-700',
    Reviewing: 'bg-yellow-100 text-yellow-700',
    Interview: 'bg-purple-100 text-purple-700',
    Accepted: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
  }

  return (
    classes[status] ||
    'bg-gray-100 text-gray-700'
  )
}
</script>

<template>
  <section
    class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
  >
    <!-- HEADER -->

    <div class="mb-8">
      <h1
        class="text-3xl font-bold text-gray-900"
      >
        Dashboard
      </h1>

      <p class="mt-2 text-gray-600">
        Welcome back,
        {{ user?.fullName }}.
      </p>
    </div>

    <!-- ================================= -->
    <!-- STUDENT DASHBOARD -->
    <!-- ================================= -->

    <div v-if="isStudent">

      <!-- Loading -->

      <div
        v-if="dashboardStore.loading"
        class="bg-white border border-gray-200 rounded-xl p-10 text-center"
      >
        <div
          class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"
        ></div>

        <p class="mt-4 text-gray-600">
          Loading dashboard...
        </p>
      </div>

      <!-- Error -->

      <div
        v-else-if="dashboardStore.error"
        class="bg-white border border-red-200 rounded-xl p-8 text-center"
      >
        <h2
          class="text-xl font-semibold text-red-600"
        >
          Failed to Load Dashboard
        </h2>

        <p class="mt-2 text-gray-600">
          {{ dashboardStore.error }}
        </p>

        <button
          type="button"
          @click="dashboardStore.fetchDashboard()"
          class="mt-5 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>

      <!-- Student Content -->

      <div v-else>

        <!-- Statistics -->

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5"
        >
          <div
            class="bg-white border border-gray-200 rounded-xl p-5"
          >
            <p class="text-sm text-gray-500">
              Total Applications
            </p>

            <p
              class="mt-2 text-3xl font-bold text-gray-900"
            >
              {{ dashboardStore.stats.total }}
            </p>
          </div>

          <div
            class="bg-white border border-gray-200 rounded-xl p-5"
          >
            <p class="text-sm text-gray-500">
              Applied
            </p>

            <p
              class="mt-2 text-3xl font-bold text-blue-600"
            >
              {{ dashboardStore.stats.applied }}
            </p>
          </div>

          <div
            class="bg-white border border-gray-200 rounded-xl p-5"
          >
            <p class="text-sm text-gray-500">
              Reviewing
            </p>

            <p
              class="mt-2 text-3xl font-bold text-yellow-600"
            >
              {{ dashboardStore.stats.reviewing }}
            </p>
          </div>

          <div
            class="bg-white border border-gray-200 rounded-xl p-5"
          >
            <p class="text-sm text-gray-500">
              Interviews
            </p>

            <p
              class="mt-2 text-3xl font-bold text-purple-600"
            >
              {{ dashboardStore.stats.interview }}
            </p>
          </div>

          <div
            class="bg-white border border-gray-200 rounded-xl p-5"
          >
            <p class="text-sm text-gray-500">
              Accepted
            </p>

            <p
              class="mt-2 text-3xl font-bold text-green-600"
            >
              {{ dashboardStore.stats.accepted }}
            </p>
          </div>

          <div
            class="bg-white border border-gray-200 rounded-xl p-5"
          >
            <p class="text-sm text-gray-500">
              Rejected
            </p>

            <p
              class="mt-2 text-3xl font-bold text-red-600"
            >
              {{ dashboardStore.stats.rejected }}
            </p>
          </div>
        </div>

        <!-- Quick Actions -->

        <div class="mt-8">
          <h2
            class="text-xl font-semibold text-gray-900 mb-4"
          >
            Quick Actions
          </h2>

          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <RouterLink
              to="/jobs"
              class="bg-blue-600 text-white rounded-xl p-5 hover:bg-blue-700 transition"
            >
              <h3 class="font-semibold text-lg">
                Browse Jobs
              </h3>

              <p
                class="mt-1 text-blue-100 text-sm"
              >
                Find new job opportunities.
              </p>
            </RouterLink>

            <RouterLink
              to="/favorites"
              class="bg-white border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition"
            >
              <h3
                class="font-semibold text-lg text-gray-900"
              >
                Favorite Jobs
              </h3>

              <p
                class="mt-1 text-gray-600 text-sm"
              >
                View your saved jobs.
              </p>
            </RouterLink>

            <RouterLink
              to="/applications"
              class="bg-white border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition"
            >
              <h3
                class="font-semibold text-lg text-gray-900"
              >
                My Applications
              </h3>

              <p
                class="mt-1 text-gray-600 text-sm"
              >
                Track your applications.
              </p>
            </RouterLink>
          </div>
        </div>

        <!-- Recent Applications -->

        <div class="mt-10">
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"
          >
            <h2
              class="text-xl font-semibold text-gray-900"
            >
              Recent Applications
            </h2>

            <RouterLink
              to="/applications"
              class="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All
            </RouterLink>
          </div>

          <div
            v-if="
              dashboardStore.recentApplications.length === 0
            "
            class="bg-white border border-gray-200 rounded-xl p-8 text-center"
          >
            <p class="text-gray-600">
              You haven't submitted any
              applications yet.
            </p>

            <RouterLink
              to="/jobs"
              class="inline-block mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse Jobs
            </RouterLink>
          </div>

          <div
            v-else
            class="space-y-4"
          >
            <div
              v-for="application in dashboardStore.recentApplications"
              :key="application.id"
              class="bg-white border border-gray-200 rounded-xl p-5"
            >
              <div
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <h3
                    class="font-semibold text-gray-900"
                  >
                    {{ application.job_title }}
                  </h3>

                  <p
                    class="text-gray-600 text-sm mt-1"
                  >
                    {{ application.company }}
                  </p>
                </div>

                <span
                  class="w-fit px-3 py-1 rounded-full text-sm font-medium"
                  :class="
                    statusClasses(
                      application.status
                    )
                  "
                >
                  {{ application.status }}
                </span>
              </div>

              <p
                class="mt-3 text-sm text-gray-500"
              >
                Applied:
                {{
                  formatDate(
                    application.applied_at
                  )
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================================= -->
    <!-- EMPLOYER / ADMIN DASHBOARD -->
    <!-- ================================= -->

    <div
      v-else-if="isEmployerOrAdmin"
    >

      <!-- Loading -->

      <div
        v-if="jobManagementStore.loading"
        class="bg-white border border-gray-200 rounded-xl p-10 text-center"
      >
        <div
          class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"
        ></div>

        <p class="mt-4 text-gray-600">
          Loading your jobs...
        </p>
      </div>

      <!-- Error -->

      <div
        v-else-if="jobManagementStore.error"
        class="bg-white border border-red-200 rounded-xl p-8 text-center"
      >
        <h2
          class="text-xl font-semibold text-red-600"
        >
          Failed to Load Jobs
        </h2>

        <p class="mt-2 text-gray-600">
          {{ jobManagementStore.error }}
        </p>

        <button
          type="button"
          @click="jobManagementStore.fetchMyJobs()"
          class="mt-5 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>

      <div v-else>

        <!-- Welcome Card -->

        <div
          class="bg-white border border-gray-200 rounded-xl p-6 mb-8"
        >
          <h2
            class="text-2xl font-semibold text-gray-900"
          >
            {{
              isAdmin
                ? 'Admin Dashboard'
                : 'Employer Dashboard'
            }}
          </h2>

          <p class="mt-2 text-gray-600">
            {{
              isAdmin
                ? 'Manage job listings and monitor the platform.'
                : 'Manage your job listings and find candidates.'
            }}
          </p>
        </div>

        <!-- Management Statistics -->

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <!-- Available Jobs -->

          <div
            class="bg-white border border-gray-200 rounded-xl p-6"
          >
            <p class="text-sm text-gray-500">
              {{
                isAdmin
                  ? 'Total Jobs'
                  : 'Your Jobs'
              }}
            </p>

            <p
              class="mt-2 text-3xl font-bold text-blue-600"
            >
              {{ availableJobsCount }}
            </p>
          </div>

          <!-- Role -->

          <div
            class="bg-white border border-gray-200 rounded-xl p-6"
          >
            <p class="text-sm text-gray-500">
              Your Role
            </p>

            <p
              class="mt-2 text-3xl font-bold text-gray-900 capitalize"
            >
              {{ user?.role }}
            </p>
          </div>

          <!-- Management -->

          <div
            class="bg-white border border-gray-200 rounded-xl p-6"
          >
            <p class="text-sm text-gray-500">
              Job Management
            </p>

            <p
              class="mt-2 text-3xl font-bold text-green-600"
            >
              Active
            </p>
          </div>
        </div>

        <!-- Quick Actions -->

        <div class="mt-8">
          <h2
            class="text-xl font-semibold text-gray-900 mb-4"
          >
            Quick Actions
          </h2>

          <div
            class="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            <RouterLink
              to="/manage-jobs"
              class="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 transition"
            >
              <h3
                class="text-lg font-semibold"
              >
                Manage Jobs
              </h3>

              <p class="mt-2 text-blue-100">
                Create, edit, and remove job
                listings.
              </p>
            </RouterLink>

            <RouterLink
              to="/manage-jobs/create"
              class="bg-white border border-gray-200 rounded-xl p-6 hover:bg-gray-50 transition"
            >
              <h3
                class="text-lg font-semibold text-gray-900"
              >
                Create New Job
              </h3>

              <p class="mt-2 text-gray-600">
                Publish a new opportunity.
              </p>
            </RouterLink>
          </div>
        </div>

        <!-- Recent Jobs -->

        <div class="mt-10">
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"
          >
            <h2
              class="text-xl font-semibold text-gray-900"
            >
              Recent Jobs
            </h2>

            <RouterLink
              to="/manage-jobs"
              class="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All
            </RouterLink>
          </div>

          <!-- No Jobs -->

          <div
            v-if="managementJobs.length === 0"
            class="bg-white border border-gray-200 rounded-xl p-8 text-center"
          >
            <p class="text-gray-600">
              {{
                isAdmin
                  ? 'No jobs available yet.'
                  : "You haven't created any jobs yet."
              }}
            </p>

            <RouterLink
              to="/manage-jobs/create"
              class="inline-block mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Job
            </RouterLink>
          </div>

          <!-- Jobs -->

          <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div
              v-for="job in managementJobs.slice(0, 5)"
              :key="job.id"
              class="bg-white border border-gray-200 rounded-xl p-5"
            >
              <div
                class="flex items-start justify-between gap-3"
              >
                <div>
                  <h3
                    class="font-semibold text-gray-900"
                  >
                    {{ job.title }}
                  </h3>

                  <p
                    class="text-gray-600 text-sm mt-1"
                  >
                    {{ job.company }}
                  </p>
                </div>

                <span
                  class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                >
                  {{ job.type }}
                </span>
              </div>

              <div
                class="mt-4 text-sm text-gray-600 space-y-1"
              >
                <p>
                  📍 {{ job.location }}
                </p>

                <p>
                  💼 {{ job.category }}
                </p>

                <p v-if="job.salary">
                  💰 {{ job.salary }}
                </p>
              </div>

              <div class="mt-5">
                <RouterLink
                  :to="`/manage-jobs/${job.id}/edit`"
                  class="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Edit Job →
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
 
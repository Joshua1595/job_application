import { defineStore } from 'pinia'
import {
  getApplications,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
} from '../services/applications'

export const useApplicationStore = defineStore(
  'applications',
  {
    state: () => ({
      applications: [],
      loading: false,
      error: null,
    }),

    getters: {
      applicationCount: (state) => {
        return state.applications.length
      },

      hasApplied: (state) => {
        return (jobId) => {
          return state.applications.some(
            (application) =>
              String(application.job_id) ===
              String(jobId)
          )
        }
      },

      appliedCount: (state) => {
        return state.applications.filter(
          (application) =>
            application.status === 'Applied'
        ).length
      },

      reviewingCount: (state) => {
        return state.applications.filter(
          (application) =>
            application.status === 'Reviewing'
        ).length
      },

      interviewCount: (state) => {
        return state.applications.filter(
          (application) =>
            application.status === 'Interview'
        ).length
      },

      acceptedCount: (state) => {
        return state.applications.filter(
          (application) =>
            application.status === 'Accepted'
        ).length
      },

      rejectedCount: (state) => {
        return state.applications.filter(
          (application) =>
            application.status === 'Rejected'
        ).length
      },

      recentApplications: (state) => {
        return [...state.applications]
          .sort(
            (a, b) =>
              new Date(b.applied_at) -
              new Date(a.applied_at)
          )
          .slice(0, 5)
      },
    },

    actions: {
      async fetchApplications() {
        this.loading = true
        this.error = null

        try {
          const data = await getApplications()

          this.applications = data.applications
        } catch (error) {
          console.error(
            'Fetch applications error:',
            error
          )

          this.error =
            error.response?.data?.message ||
            'Failed to load applications'
        } finally {
          this.loading = false
        }
      },

      async addApplication(application) {
        this.loading = true
        this.error = null

        try {
          const data =
            await createApplication(application)

          this.applications.unshift(
            data.application
          )

          return data.application
        } catch (error) {
          console.error(
            'Create application error:',
            error
          )

          this.error =
            error.response?.data?.message ||
            'Failed to submit application'

          throw error
        } finally {
          this.loading = false
        }
      },

      async updateStatus(applicationId, status) {
        this.error = null

        try {
          const data =
            await updateApplicationStatus(
              applicationId,
              status
            )

          const index =
            this.applications.findIndex(
              (application) =>
                application.id === applicationId
            )

          if (index !== -1) {
            this.applications[index] =
              data.application
          }

          return data.application
        } catch (error) {
          console.error(
            'Update application status error:',
            error
          )

          this.error =
            error.response?.data?.message ||
            'Failed to update application status'

          throw error
        }
      },

      async removeApplication(applicationId) {
        this.error = null

        try {
          await deleteApplication(applicationId)

          this.applications =
            this.applications.filter(
              (application) =>
                application.id !== applicationId
            )
        } catch (error) {
          console.error(
            'Delete application error:',
            error
          )

          this.error =
            error.response?.data?.message ||
            'Failed to delete application'

          throw error
        }
      },

      clearApplications() {
        this.applications = []
      },
    },
  }
)
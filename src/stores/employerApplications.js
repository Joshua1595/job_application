import { defineStore } from 'pinia'

import {
  getEmployerApplications,
} from '../services/employer'

export const useEmployerApplicationStore =
  defineStore('employerApplications', {
    state: () => ({
      applications: [],
      loading: false,
      error: null,
    }),

    getters: {
      applicationCount: (state) => {
        return state.applications.length
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
    },

    actions: {
      async fetchApplications() {
        this.loading = true
        this.error = null

        try {
          const data =
            await getEmployerApplications()

          this.applications =
            data.applications || []

          return this.applications
        } catch (error) {
          console.error(
            'Fetch employer applications error:',
            error
          )

          this.error =
            error.response?.data?.message ||
            'Failed to load applications'

          throw error
        } finally {
          this.loading = false
        }
      },
    },
  })


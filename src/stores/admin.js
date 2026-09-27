import { defineStore } from 'pinia'

import { getAdminJobs } from '../services/admin'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    jobs: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchJobs() {
      this.loading = true
      this.error = null

      try {
        const data = await getAdminJobs()

        this.jobs = data.jobs
      } catch (error) {
        console.error(
          'Fetch admin jobs error:',
          error
        )

        this.error =
          error.response?.data?.message ||
          'Failed to load admin jobs'
      } finally {
        this.loading = false
      }
    },
  },
})
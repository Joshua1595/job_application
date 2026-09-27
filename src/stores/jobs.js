import { defineStore } from 'pinia'
import {
  getJobs,
  getJobById,
} from '../services/jobs'

export const useJobStore = defineStore('jobs', {
  state: () => ({
    jobs: [],
    loading: false,
    error: null,
  }),

  getters: {
    locations: (state) => {
      return [
        ...new Set(
          state.jobs.map((job) => job.location)
        ),
      ]
    },

    jobTypes: (state) => {
      return [
        ...new Set(
          state.jobs.map((job) => job.type)
        ),
      ]
    },

    categories: (state) => {
      return [
        ...new Set(
          state.jobs.map((job) => job.category)
        ),
      ]
    },

    getJobById: (state) => {
      return (id) => {
        return state.jobs.find(
          (job) => String(job.id) === String(id)
        )
      }
    },
  },

  actions: {
    async fetchJobs() {
      this.loading = true
      this.error = null

      try {
        const data = await getJobs()

        this.jobs = data.jobs
      } catch (error) {
        console.error('Fetch jobs error:', error)

        this.error =
          error.response?.data?.message ||
          'Failed to load jobs'
      } finally {
        this.loading = false
      }
    },
  },
})
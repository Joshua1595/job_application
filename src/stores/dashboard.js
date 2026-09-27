import { defineStore } from 'pinia'
import { getDashboard } from '../services/dashboard'

export const useDashboardStore = defineStore(
  'dashboard',
  {
    state: () => ({
      stats: {
        total: 0,
        applied: 0,
        reviewing: 0,
        interview: 0,
        accepted: 0,
        rejected: 0,
      },

      recentApplications: [],

      loading: false,
      error: null,
    }),

    actions: {
      async fetchDashboard() {
        this.loading = true
        this.error = null

        try {
          const data = await getDashboard()

          this.stats = data.stats
          this.recentApplications =
            data.recentApplications
        } catch (error) {
          console.error(
            'Fetch dashboard error:',
            error
          )

          this.error =
            error.response?.data?.message ||
            'Failed to load dashboard'
        } finally {
          this.loading = false
        }
      },

      clearDashboard() {
        this.stats = {
          total: 0,
          applied: 0,
          reviewing: 0,
          interview: 0,
          accepted: 0,
          rejected: 0,
        }

        this.recentApplications = []
        this.error = null
      },
    },
  }
)
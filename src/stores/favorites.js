import { defineStore } from 'pinia'

import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../services/favorites'

export const useFavoriteStore = defineStore(
  'favorites',
  {
    state: () => ({
      favoriteJobIds: [],
      loading: false,
      error: null,
    }),

    getters: {
      favoriteCount: (state) => {
        return state.favoriteJobIds.length
      },

      isFavorite: (state) => {
        return (jobId) => {
          return state.favoriteJobIds.includes(
            String(jobId)
          )
        }
      },
    },

    actions: {
      async fetchFavorites() {
        this.loading = true
        this.error = null

        try {
          const data = await getFavorites()

          this.favoriteJobIds =
            data.favorites.map(
              (favorite) =>
                String(favorite.job_id)
            )
        } catch (error) {
          console.error(
            'Fetch favorites error:',
            error
          )

          this.error =
            error.response?.data?.message ||
            'Failed to load favorites'
        } finally {
          this.loading = false
        }
      },

      async addFavorite(jobId) {
        this.error = null

        try {
          await addFavorite(String(jobId))

          const id = String(jobId)

          if (!this.favoriteJobIds.includes(id)) {
            this.favoriteJobIds.push(id)
          }
        } catch (error) {
          console.error(
            'Add favorite error:',
            error
          )

          this.error =
            error.response?.data?.message ||
            'Failed to add favorite'

          throw error
        }
      },

      async removeFavorite(jobId) {
        this.error = null

        try {
          await removeFavorite(String(jobId))

          const id = String(jobId)

          this.favoriteJobIds =
            this.favoriteJobIds.filter(
              (favoriteId) =>
                favoriteId !== id
            )
        } catch (error) {
          console.error(
            'Remove favorite error:',
            error
          )

          this.error =
            error.response?.data?.message ||
            'Failed to remove favorite'

          throw error
        }
      },

      async toggleFavorite(jobId) {
        const id = String(jobId)

        if (this.isFavorite(id)) {
          await this.removeFavorite(id)
        } else {
          await this.addFavorite(id)
        }
      },

      clearFavorites() {
        this.favoriteJobIds = []
      },
    },
  }
)
import { defineStore } from 'pinia'
import { useFavoriteStore } from './favorites'
import {
  registerUser,
  loginUser,
} from '../services/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(
      localStorage.getItem('jobboard_user')
    ) || null,

    token:
      localStorage.getItem('jobboard_token') || null,

    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => {
      return !!state.token
    },
  },

  actions: {
    async register(userData) {
      this.loading = true
      this.error = null

      try {
        const data = await registerUser(userData)

        return data
      } catch (error) {
        console.error(
          'Registration error:',
          error
        )

        this.error =
          error.response?.data?.message ||
          'Registration failed'

        throw error
      } finally {
        this.loading = false
      }
    },

    async login(credentials) {
        this.loading = true
        this.error = null

        try {
            const data = await loginUser(credentials)

            this.token = data.token
            this.user = data.user

            localStorage.setItem(
            'jobboard_token',
            data.token
            )

            localStorage.setItem(
            'jobboard_user',
            JSON.stringify(data.user)
            )

            const favoriteStore = useFavoriteStore()

            await favoriteStore.fetchFavorites()

            return data
        } catch (error) {
            console.error(
            'Login error:',
            error
            )

            this.error =
            error.response?.data?.message ||
            'Login failed'

            throw error
        } finally {
            this.loading = false
        }
    },
    logout() {
      this.user = null
      this.token = null

      localStorage.removeItem(
        'jobboard_token'
      )

      localStorage.removeItem(
        'jobboard_user'
      )
    },
  },
})
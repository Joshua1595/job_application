import { defineStore } from 'pinia'

import {
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} from '../services/jobManagement'

export const useJobManagementStore =
  defineStore('jobManagement', {
    state: () => ({
      jobs: [],
      loading: false,
      error: null,
    }),

    actions: {
      // Get jobs owned by the current employer
      async fetchMyJobs() {
        this.loading = true
        this.error = null

        try {
          const data = await getMyJobs()

          // IMPORTANT: save the jobs into Pinia state
          this.jobs = data.jobs || []

          return this.jobs
        } catch (error) {
          console.error(
            'Fetch my jobs error:',
            error
          )

          this.error =
            error.response?.data?.message ||
            'Failed to load your jobs'

          throw error
        } finally {
          this.loading = false
        }
      },

      // Create a new job
      async addJob(job) {
        this.loading = true
        this.error = null

        try {
          const data = await createJob(job)

          const newJob = data.job

          // Add the newly created job to Pinia state
          this.jobs.unshift(newJob)

          return newJob
        } catch (error) {
          console.error(
            'Create job error:',
            error
          )

          this.error =
            error.response?.data?.message ||
            'Failed to create job'

          throw error
        } finally {
          this.loading = false
        }
      },

      // Update an existing job
      async editJob(id, job) {
        this.loading = true
        this.error = null

        try {
          const data = await updateJob(id, job)

          const updatedJob = data.job

          // Update the job inside Pinia state
          const index = this.jobs.findIndex(
            (item) =>
              String(item.id) === String(id)
          )

          if (index !== -1) {
            this.jobs[index] = updatedJob
          }

          return updatedJob
        } catch (error) {
          console.error(
            'Update job error:',
            error
          )

          this.error =
            error.response?.data?.message ||
            'Failed to update job'

          throw error
        } finally {
          this.loading = false
        }
      },

      // Delete a job
      async removeJob(id) {
        this.loading = true
        this.error = null

        try {
          await deleteJob(id)

          // Remove the job from Pinia state
          this.jobs = this.jobs.filter(
            (job) =>
              String(job.id) !== String(id)
          )
        } catch (error) {
          console.error(
            'Delete job error:',
            error
          )

          this.error =
            error.response?.data?.message ||
            'Failed to delete job'

          throw error
        } finally {
          this.loading = false
        }
      },
    },
  })


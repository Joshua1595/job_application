import api from './api'

export const getAdminJobs = async () => {
  const response = await api.get('/admin/jobs')
  return response.data
}
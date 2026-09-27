
import api from './api'

export const getEmployerApplications = async () => {
  const response = await api.get(
    '/employer/applications'
  )

  return response.data
}


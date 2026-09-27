import api from './api'

export const getApplications = async () => {
  const response = await api.get('/applications')

  return response.data
}

export const getApplicationById = async (id) => {
  const response = await api.get(`/applications/${id}`)

  return response.data
}

export const createApplication = async (application) => {
  const response = await api.post(
    '/applications',
    application
  )

  return response.data
}

export const updateApplicationStatus = async (
  id,
  status
) => {
  const response = await api.patch(
    `/applications/${id}/status`,
    { status }
  )

  return response.data
}

export const deleteApplication = async (id) => {
  const response = await api.delete(
    `/applications/${id}`
  )

  return response.data
}
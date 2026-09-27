import api from './api'

export const getFavorites = async () => {
  const response = await api.get('/favorites')

  return response.data
}

export const addFavorite = async (jobId) => {
  const response = await api.post(
    '/favorites',
    {
      jobId,
    }
  )

  return response.data
}

export const removeFavorite = async (jobId) => {
  const response = await api.delete(
    `/favorites/${jobId}`
  )

  return response.data
}
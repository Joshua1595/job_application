const pool = require('../config/db')

// Get current user's favorites
const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id

    const result = await pool.query(
      `
      SELECT
        f.id,
        f.job_id,
        f.created_at,
        j.title,
        j.company,
        j.location,
        j.type,
        j.category,
        j.salary,
        j.description,
        j.requirements
      FROM favorites f
      JOIN jobs j ON f.job_id = j.id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
      `,
      [userId]
    )

    res.json({
      success: true,
      count: result.rows.length,
      favorites: result.rows,
    })
  } catch (error) {
    console.error('Get favorites error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorites',
    })
  }
}

// Add favorite
const addFavorite = async (req, res) => {
  try {
    const userId = req.user.id
    const { jobId } = req.body

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required',
      })
    }

    const jobResult = await pool.query(
      `
      SELECT id
      FROM jobs
      WHERE id = $1
      `,
      [jobId]
    )

    if (jobResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      })
    }

    const existingFavorite = await pool.query(
      `
      SELECT id
      FROM favorites
      WHERE user_id = $1
      AND job_id = $2
      `,
      [userId, jobId]
    )

    if (existingFavorite.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Job is already in favorites',
      })
    }

    const result = await pool.query(
      `
      INSERT INTO favorites (
        user_id,
        job_id
      )
      VALUES ($1, $2)
      RETURNING
        id,
        user_id,
        job_id,
        created_at
      `,
      [userId, jobId]
    )

    res.status(201).json({
      success: true,
      message: 'Job added to favorites',
      favorite: result.rows[0],
    })
  } catch (error) {
    console.error('Add favorite error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to add favorite',
    })
  }
}

// Remove favorite
const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id
    const { jobId } = req.params

    const result = await pool.query(
      `
      DELETE FROM favorites
      WHERE user_id = $1
      AND job_id = $2
      RETURNING id
      `,
      [userId, jobId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found',
      })
    }

    res.json({
      success: true,
      message: 'Job removed from favorites',
    })
  } catch (error) {
    console.error(
      'Remove favorite error:',
      error
    )

    res.status(500).json({
      success: false,
      message: 'Failed to remove favorite',
    })
  }
}

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
}
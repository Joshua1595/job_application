const pool = require('../config/db')

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id

    const statsResult = await pool.query(
      `
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (
          WHERE status = 'Applied'
        )::int AS applied,
        COUNT(*) FILTER (
          WHERE status = 'Reviewing'
        )::int AS reviewing,
        COUNT(*) FILTER (
          WHERE status = 'Interview'
        )::int AS interview,
        COUNT(*) FILTER (
          WHERE status = 'Accepted'
        )::int AS accepted,
        COUNT(*) FILTER (
          WHERE status = 'Rejected'
        )::int AS rejected
      FROM applications
      WHERE user_id = $1
      `,
      [userId]
    )

    const recentResult = await pool.query(
      `
      SELECT
        a.id,
        a.job_id,
        a.status,
        a.applied_at,
        j.title AS job_title,
        j.company
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.user_id = $1
      ORDER BY a.applied_at DESC
      LIMIT 5
      `,
      [userId]
    )

    res.json({
      success: true,
      stats: statsResult.rows[0],
      recentApplications: recentResult.rows,
    })
  } catch (error) {
    console.error(
      'Get dashboard error:',
      error
    )

    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
    })
  }
}

module.exports = {
  getDashboard,
}
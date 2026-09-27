const pool = require('../config/db')

const getAllJobsForAdmin = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        j.id,
        j.title,
        j.company,
        j.location,
        j.type,
        j.category,
        j.salary,
        j.description,
        j.requirements,
        j.employer_id,
        j.created_at,
        u.full_name AS employer_name,
        u.email AS employer_email
      FROM jobs j
      LEFT JOIN users u
        ON j.employer_id = u.id
      ORDER BY j.created_at DESC
    `)

    res.json({
      success: true,
      count: result.rows.length,
      jobs: result.rows,
    })
  } catch (error) {
    console.error(
      'Get admin jobs error:',
      error
    )

    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin jobs',
    })
  }
}

module.exports = {
  getAllJobsForAdmin,
}
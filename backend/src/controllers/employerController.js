const pool = require('../config/db')

const getEmployerApplications = async (req, res) => {
  try {
    const employerId = req.user.id

    const result = await pool.query(
      `
      SELECT
        a.id,
        a.job_id,
        a.user_id,
        a.full_name,
        a.email,
        a.phone,
        a.cover_letter,
        a.status,
        a.applied_at,
        j.title AS job_title,
        j.company
      FROM applications a
      INNER JOIN jobs j
        ON a.job_id = j.id
      WHERE j.employer_id = $1
      ORDER BY a.applied_at DESC
      `,
      [employerId]
    )

    res.json({
      success: true,
      count: result.rows.length,
      applications: result.rows,
    })
  } catch (error) {
    console.error(
      'Get employer applications error:',
      error
    )

    res.status(500).json({
      success: false,
      message: 'Failed to fetch employer applications',
    })
  }
}

module.exports = {
  getEmployerApplications,
}

const pool = require('../config/db')
const getJobs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        company,
        location,
        type,
        category,
        salary,
        description,
        requirements,
        employer_id,
        created_at
      FROM jobs
      ORDER BY created_at DESC
    `)

    res.json({
      success: true,
      count: result.rows.length,
      jobs: result.rows,
    })
  } catch (error) {
    console.error('Get jobs error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
    })
  }
}
const getJobById = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `
      SELECT
        id,
        title,
        company,
        location,
        type,
        category,
        salary,
        description,
        requirements,
        employer_id,
        created_at
      FROM jobs
      WHERE id = $1
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      })
    }

    res.json({
      success: true,
      job: result.rows[0],
    })
  } catch (error) {
    console.error('Get job error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
    })
  }
}

const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      category,
      salary,
      description,
      requirements,
    } = req.body

    const employerId = req.user.id

    if (
      !title ||
      !company ||
      !location ||
      !type ||
      !category ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Title, company, location, type, category, and description are required',
      })
    }

    const result = await pool.query(
      `
      INSERT INTO jobs (
        title,
        company,
        location,
        type,
        category,
        salary,
        description,
        requirements,
        employer_id
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9
      )
      RETURNING
        id,
        title,
        company,
        location,
        type,
        category,
        salary,
        description,
        requirements,
        employer_id,
        created_at
      `,
      [
        title.trim(),
        company.trim(),
        location.trim(),
        type.trim(),
        category.trim(),
        salary?.trim() || null,
        description.trim(),
        Array.isArray(requirements)
          ? requirements
          : [],
        employerId,
      ]
    )

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job: result.rows[0],
    })
  } catch (error) {
    console.error('Create job error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to create job',
    })
  }
}

const updateJob = async (req, res) => {
  try {
    const { id } = req.params

    const {
      title,
      company,
      location,
      type,
      category,
      salary,
      description,
      requirements,
    } = req.body

    const userId = req.user.id
    const userRole = req.user.role

    if (
      !title ||
      !company ||
      !location ||
      !type ||
      !category ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Title, company, location, type, category, and description are required',
      })
    }

    let result

    /*
     * Admin can update any job.
     */
    if (userRole === 'admin') {
      result = await pool.query(
        `
        UPDATE jobs
        SET
          title = $1,
          company = $2,
          location = $3,
          type = $4,
          category = $5,
          salary = $6,
          description = $7,
          requirements = $8
        WHERE id = $9
        RETURNING
          id,
          title,
          company,
          location,
          type,
          category,
          salary,
          description,
          requirements,
          employer_id,
          created_at
        `,
        [
          title.trim(),
          company.trim(),
          location.trim(),
          type.trim(),
          category.trim(),
          salary?.trim() || null,
          description.trim(),
          Array.isArray(requirements)
            ? requirements
            : [],
          id,
        ]
      )
    } else {
      /*
       * Employer can only update their own job.
       */
      result = await pool.query(
        `
        UPDATE jobs
        SET
          title = $1,
          company = $2,
          location = $3,
          type = $4,
          category = $5,
          salary = $6,
          description = $7,
          requirements = $8
        WHERE id = $9
          AND employer_id = $10
        RETURNING
          id,
          title,
          company,
          location,
          type,
          category,
          salary,
          description,
          requirements,
          employer_id,
          created_at
        `,
        [
          title.trim(),
          company.trim(),
          location.trim(),
          type.trim(),
          category.trim(),
          salary?.trim() || null,
          description.trim(),
          Array.isArray(requirements)
            ? requirements
            : [],
          id,
          userId,
        ]
      )
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          'Job not found or you do not have permission to modify it',
      })
    }

    res.json({
      success: true,
      message: 'Job updated successfully',
      job: result.rows[0],
    })
  } catch (error) {
    console.error('Update job error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to update job',
    })
  }
}

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params

    const userId = req.user.id
    const userRole = req.user.role

    let result

    /*
     * Admin can delete any job.
     */
    if (userRole === 'admin') {
      result = await pool.query(
        `
        DELETE FROM jobs
        WHERE id = $1
        RETURNING id
        `,
        [id]
      )
    } else {
      /*
       * Employer can only delete their own job.
       */
      result = await pool.query(
        `
        DELETE FROM jobs
        WHERE id = $1
          AND employer_id = $2
        RETURNING id
        `,
        [id, userId]
      )
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          'Job not found or you do not have permission to delete it',
      })
    }

    res.json({
      success: true,
      message: 'Job deleted successfully',
    })
  } catch (error) {
    console.error('Delete job error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
    })
  }
}

const getMyJobs = async (req, res) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role

    let result

    /*
     * Admin sees all jobs.
     */
    if (userRole === 'admin') {
      result = await pool.query(`
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
    } else {
      /*
       * Employer sees ONLY jobs they created.
       */
      result = await pool.query(
        `
        SELECT
          id,
          title,
          company,
          location,
          type,
          category,
          salary,
          description,
          requirements,
          employer_id,
          created_at
        FROM jobs
        WHERE employer_id = $1
        ORDER BY created_at DESC
        `,
        [userId]
      )
    }

    res.json({
      success: true,
      count: result.rows.length,
      jobs: result.rows,
    })
  } catch (error) {
    console.error(
      'Get my jobs error:',
      error
    )

    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
    })
  }
}

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
}

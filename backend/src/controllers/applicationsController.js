const pool = require('../config/db')

// Get all applications
const getApplications = async (req, res) => {
  try {
    const userId = req.user.id

    const result = await pool.query(
      `
      SELECT
        a.id,
        a.user_id,
        a.job_id,
        a.full_name,
        a.email,
        a.phone,
        a.cover_letter,
        a.status,
        a.applied_at,
        j.title AS job_title,
        j.company
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.user_id = $1
      ORDER BY a.applied_at DESC
      `,
      [userId]
    )

    res.json({
      success: true,
      count: result.rows.length,
      applications: result.rows,
    })
  } catch (error) {
    console.error(
      'Get applications error:',
      error
    )

    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
    })
  }
}

// Get application by ID
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const result = await pool.query(
      `
      SELECT
        a.id,
        a.user_id,
        a.job_id,
        a.full_name,
        a.email,
        a.phone,
        a.cover_letter,
        a.status,
        a.applied_at,
        j.title AS job_title,
        j.company
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = $1
      AND a.user_id = $2
      `,
      [id, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    res.json({
      success: true,
      application: result.rows[0],
    })
  } catch (error) {
    console.error(
      'Get application error:',
      error
    )

    res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
    })
  }
}

// Create application
const createApplication = async (req, res) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role

    const {
      jobId,
      fullName,
      email,
      phone,
      coverLetter,
    } = req.body

    // Validate required fields
    if (
      !jobId ||
      !fullName ||
      !email ||
      !phone ||
      !coverLetter
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      })
    }

    // Find the job and its owner
    const jobResult = await pool.query(
      `
      SELECT
        id,
        title,
        company,
        employer_id
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

    const job = jobResult.rows[0]

    // Prevent an employer from applying to their own job
    if (
      userRole === 'employer' &&
      String(job.employer_id) === String(userId)
    ) {
      return res.status(403).json({
        success: false,
        message:
          'You cannot apply to your own job',
      })
    }

    // Prevent duplicate applications
    const existingApplication =
      await pool.query(
        `
        SELECT id
        FROM applications
        WHERE user_id = $1
        AND job_id = $2
        `,
        [userId, jobId]
      )

    if (existingApplication.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          'You have already applied for this job',
      })
    }

    // Create application
    const result = await pool.query(
      `
      INSERT INTO applications (
        user_id,
        job_id,
        full_name,
        email,
        phone,
        cover_letter,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'Applied')
      RETURNING
        id,
        user_id,
        job_id,
        full_name,
        email,
        phone,
        cover_letter,
        status,
        applied_at
      `,
      [
        userId,
        jobId,
        fullName.trim(),
        email.trim(),
        phone.trim(),
        coverLetter.trim(),
      ]
    )

    res.status(201).json({
      success: true,
      message:
        'Application submitted successfully',
      application: result.rows[0],
    })
  } catch (error) {
    console.error(
      'Create application error:',
      error
    )

    res.status(500).json({
      success: false,
      message: 'Failed to create application',
    })
  }
}


// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const userId = req.user.id
    const userRole = req.user.role

    const allowedStatuses = [
      'Applied',
      'Reviewing',
      'Interview',
      'Accepted',
      'Rejected',
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application status',
      })
    }

    // Only employers can update application status
    if (userRole !== 'employer') {
      return res.status(403).json({
        success: false,
        message:
          'Only the employer can update application status',
      })
    }

    // Update only if the application belongs
    // to a job owned by the current employer
    const result = await pool.query(
      `
      UPDATE applications a
      SET status = $1
      FROM jobs j
      WHERE a.id = $2
      AND a.job_id = j.id
      AND j.employer_id = $3
      RETURNING
        a.id,
        a.user_id,
        a.job_id,
        a.full_name,
        a.email,
        a.phone,
        a.cover_letter,
        a.status,
        a.applied_at
      `,
      [status, id, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          'Application not found or you do not have permission to update it',
      })
    }

    res.json({
      success: true,
      message:
        'Application status updated successfully',
      application: result.rows[0],
    })
  } catch (error) {
    console.error(
      'Update application status error:',
      error
    )

    res.status(500).json({
      success: false,
      message:
        'Failed to update application status',
    })
  }
}



// Delete application
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const result = await pool.query(
      `
      DELETE FROM applications
      WHERE id = $1
      AND user_id = $2
      RETURNING id
      `,
      [id, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    res.json({
      success: true,
      message:
        'Application deleted successfully',
    })
  } catch (error) {
    console.error(
      'Delete application error:',
      error
    )

    res.status(500).json({
      success: false,
      message:
        'Failed to delete application',
    })
  }
}

module.exports = {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
}


const express = require('express')

const authenticateToken = require('../middleware/authMiddleware')
const requireRoles = require('../middleware/roleMiddleware')

const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} = require('../controllers/jobsController')

const router = express.Router()

// Public
router.get('/', getJobs)
router.get(
  '/my-jobs',
  authenticateToken,
  requireRoles('employer', 'admin'),
  getMyJobs
)
router.get('/:id', getJobById)

// Employer/Admin
router.post(
  '/',
  authenticateToken,
  requireRoles('employer', 'admin'),
  createJob
)

router.patch(
  '/:id',
  authenticateToken,
  requireRoles('employer', 'admin'),
  updateJob
)

router.delete(
  '/:id',
  authenticateToken,
  requireRoles('employer', 'admin'),
  deleteJob
)

module.exports = router
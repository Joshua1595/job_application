const express = require('express')

const authenticateToken = require('../middleware/authMiddleware')
const requireRoles = require('../middleware/roleMiddleware')

const {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
} = require('../controllers/applicationsController')

const router = express.Router()

router.get(
  '/',
  authenticateToken,
  getApplications
)

router.get(
  '/:id',
  authenticateToken,
  getApplicationById
)

router.post(
  '/',
  authenticateToken,
  createApplication
)

// Only employers can update application status
router.patch(
  '/:id/status',
  authenticateToken,
  requireRoles('employer'),
  updateApplicationStatus
)

router.delete(
  '/:id',
  authenticateToken,
  deleteApplication
)

module.exports = router
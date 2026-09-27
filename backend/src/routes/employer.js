const express = require('express')

const authenticateToken = require('../middleware/authMiddleware')
const requireRoles = require('../middleware/roleMiddleware')

const {
  getEmployerApplications,
} = require('../controllers/employerController')

const router = express.Router()

router.get(
  '/applications',
  authenticateToken,
  requireRoles('employer'),
  getEmployerApplications
)

module.exports = router
const express = require('express')

const authenticateToken = require('../middleware/authMiddleware')
const requireRoles = require('../middleware/roleMiddleware')

const {
  getAllJobsForAdmin,
} = require('../controllers/adminController')

const router = express.Router()

router.get(
  '/jobs',
  authenticateToken,
  requireRoles('admin'),
  getAllJobsForAdmin
)

module.exports = router
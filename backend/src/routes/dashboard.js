const express = require('express')

const authenticateToken = require('../middleware/authMiddleware')

const {
  getDashboard,
} = require('../controllers/dashboardController')

const router = express.Router()

router.get(
  '/',
  authenticateToken,
  getDashboard
)

module.exports = router
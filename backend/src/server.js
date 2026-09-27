require('dotenv').config()

const express = require('express')
const cors = require('cors')
const pool = require('./config/db')
const app = express()
const jobsRoutes = require('./routes/jobs')
const applicationsRoutes = require('./routes/applications')
const authRoutes = require('./routes/auth')
const authenticateToken = require('./middleware/authMiddleware')
const favoritesRoutes = require('./routes/favorites')
const dashboardRoutes = require('./routes/dashboard')
const requireRoles = require('./middleware/roleMiddleware')
const adminRoutes = require('./routes/admin')
const employerRoutes = require('./routes/employer')
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'JobBoard API is running',
  })
})

app.get('/api/health/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')

    res.json({
      success: true,
      message: 'Database connection is working',
      time: result.rows[0].now,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Database connection failed',
    })
  }
})
app.use('/api/jobs', jobsRoutes)
app.use('/api/applications', applicationsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  })
})
app.use('/api/favorites', favoritesRoutes)
app.get(
  '/api/auth/role-test',
  authenticateToken,
  requireRoles('employer', 'admin'),
  (req, res) => {
    res.json({
      success: true,
      message: 'You have employer/admin access',
      user: req.user,
    })
  }
)
app.use('/api/admin', adminRoutes)
app.use('/api/employer', employerRoutes)
app.listen(PORT, () => {
  console.log(`JobBoard API running on port ${PORT}`)
})
const bcrypt = require('bcrypt')
const pool = require('../config/db')
const jwt = require('jsonwebtoken')
const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
    } = req.body

    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required',
      })
    }

    // Basic password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      })
    }

    // Check if email already exists
    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1
      `,
      [email.toLowerCase()]
    )

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const result = await pool.query(
      `
      INSERT INTO users (
        full_name,
        email,
        password_hash
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        full_name,
        email,
        created_at
      `,
      [
        fullName.trim(),
        email.toLowerCase(),
        passwordHash,
      ]
    )

    const user = result.rows[0]

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user,
    })
  } catch (error) {
    console.error('Register error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to create account',
    })
  }
}
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })
    }

    const result = await pool.query(
      `
      SELECT
        id,
        full_name,
        email,
        password_hash,
        role
      FROM users
      WHERE email = $1
      `,
      [email.toLowerCase()]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    const user = result.rows[0]

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    )

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
         role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    )

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to login',
    })
  }
}

module.exports = {
  register,
  login,
}
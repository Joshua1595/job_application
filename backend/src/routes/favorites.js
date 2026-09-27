const express = require('express')

const authenticateToken = require('../middleware/authMiddleware')

const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require('../controllers/favoritesController')

const router = express.Router()

router.get(
  '/',
  authenticateToken,
  getFavorites
)

router.post(
  '/',
  authenticateToken,
  addFavorite
)

router.delete(
  '/:jobId',
  authenticateToken,
  removeFavorite
)

module.exports = router
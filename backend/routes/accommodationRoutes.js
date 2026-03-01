const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAll,
  getById,
  getByLocation,
  create,
  update,
  remove,
} = require('../controllers/accommodationController');

// Public routes - no auth required
router.get('/', getAll);
router.get('/location/:location', getByLocation);
router.get('/:id', getById);

// Protected routes - require JWT
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  create,
  getByHost,
  getByUser,
  remove,
} = require('../controllers/reservationController');

// All reservation routes require authentication
router.post('/', auth, create);
router.get('/host', auth, getByHost);
router.get('/user', auth, getByUser);
router.delete('/:id', auth, remove);

module.exports = router;

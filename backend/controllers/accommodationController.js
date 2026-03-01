const Accommodation = require('../models/Accommodation');
const mongoose = require('mongoose');

/**
 * GET /api/accommodations
 * Returns all accommodation listings.
 */
const getAll = async (req, res) => {
  try {
    const accommodations = await Accommodation.find().sort({ createdAt: -1 });
    res.status(200).json(accommodations);
  } catch (err) {
    console.error('Get accommodations error:', err);
    res.status(500).json({ message: 'Failed to fetch accommodations.' });
  }
};

/**
 * GET /api/accommodations/:id
 * Returns a single accommodation by id.
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid accommodation ID.' });
    }

    const accommodation = await Accommodation.findById(id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found.' });
    }

    res.status(200).json(accommodation);
  } catch (err) {
    console.error('Get accommodation error:', err);
    res.status(500).json({ message: 'Failed to fetch accommodation.' });
  }
};

/**
 * GET /api/accommodations/location/:location
 * Returns accommodations filtered by location (e.g. "New York").
 */
const getByLocation = async (req, res) => {
  try {
    const location = req.params.location;
    if (!location || typeof location !== 'string') {
      return res.status(400).json({ message: 'Location is required.' });
    }

    const accommodations = await Accommodation.find({
      location: new RegExp(location, 'i'),
    }).sort({ createdAt: -1 });

    res.status(200).json(accommodations);
  } catch (err) {
    console.error('Get by location error:', err);
    res.status(500).json({ message: 'Failed to fetch accommodations.' });
  }
};

/**
 * POST /api/accommodations
 * Creates a new accommodation. Requires auth.
 */
const create = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.user) {
      data.host_id = req.user._id;
      data.host = req.user.username;
    }

    const accommodation = new Accommodation(data);
    await accommodation.save();

    res.status(201).json(accommodation);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(' ') });
    }
    console.error('Create accommodation error:', err);
    res.status(500).json({ message: 'Failed to create accommodation.' });
  }
};

/**
 * PUT /api/accommodations/:id
 * Updates an existing accommodation. Requires auth.
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid accommodation ID.' });
    }

    const accommodation = await Accommodation.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found.' });
    }

    res.status(200).json(accommodation);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(' ') });
    }
    console.error('Update accommodation error:', err);
    res.status(500).json({ message: 'Failed to update accommodation.' });
  }
};

/**
 * DELETE /api/accommodations/:id
 * Deletes an accommodation. Requires auth.
 */
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid accommodation ID.' });
    }

    const accommodation = await Accommodation.findByIdAndDelete(id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found.' });
    }

    res.status(200).json({ message: 'Accommodation deleted successfully.' });
  } catch (err) {
    console.error('Delete accommodation error:', err);
    res.status(500).json({ message: 'Failed to delete accommodation.' });
  }
};

module.exports = {
  getAll,
  getById,
  getByLocation,
  create,
  update,
  remove,
};

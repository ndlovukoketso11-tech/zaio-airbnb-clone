const Reservation = require('../models/Reservation');
const Accommodation = require('../models/Accommodation');
const mongoose = require('mongoose');

/**
 * Helper to calculate reservation totals (mirrors frontend calculator).
 */
function calculateTotals(acc, checkIn, checkOut, guests) {
  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  const subtotal = acc.price * nights;
  let weeklyDiscount = 0;
  if (acc.weeklyDiscount && nights >= 7) {
    weeklyDiscount = (subtotal * acc.weeklyDiscount) / 100;
  }
  const afterDiscount = subtotal - weeklyDiscount;
  const cleaningFee = acc.cleaningFee || 0;
  const serviceFee = acc.serviceFee || 0;
  const occupancyTaxes = acc.occupancyTaxes || 0;
  const total = afterDiscount + cleaningFee + serviceFee + occupancyTaxes;

  return {
    totalNights: nights,
    pricePerNight: acc.price,
    subtotal,
    weeklyDiscount,
    cleaningFee,
    serviceFee,
    occupancyTaxes,
    total,
  };
}

/**
 * POST /api/reservations
 * Creates a new reservation. Requires auth.
 */
const create = async (req, res) => {
  try {
    const { accommodationId, checkIn, checkOut, guests } = req.body;
    const userId = req.user._id;

    if (!accommodationId || !checkIn || !checkOut || guests == null) {
      return res.status(400).json({
        message: 'Please provide accommodationId, checkIn, checkOut, and guests.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(accommodationId)) {
      return res.status(400).json({ message: 'Invalid accommodation ID.' });
    }

    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found.' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ message: 'Check-out must be after check-in.' });
    }

    const totals = calculateTotals(accommodation, checkInDate, checkOutDate, guests);

    const reservation = new Reservation({
      accommodation: accommodation._id,
      user: userId,
      host: accommodation.host_id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: Number(guests),
      totalNights: totals.totalNights,
      pricePerNight: totals.pricePerNight,
      subtotal: totals.subtotal,
      weeklyDiscount: totals.weeklyDiscount,
      cleaningFee: totals.cleaningFee,
      serviceFee: totals.serviceFee,
      occupancyTaxes: totals.occupancyTaxes,
      total: totals.total,
    });

    await reservation.save();
    await reservation.populate('accommodation', 'title location images price');

    res.status(201).json(reservation);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(' ') });
    }
    console.error('Create reservation error:', err);
    res.status(500).json({ message: 'Failed to create reservation.' });
  }
};

/**
 * GET /api/reservations/host
 * Returns reservations for the logged-in host. Requires auth.
 */
const getByHost = async (req, res) => {
  try {
    const hostId = req.user._id;
    const reservations = await Reservation.find({ host: hostId })
      .populate('accommodation', 'title location images price')
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json(reservations);
  } catch (err) {
    console.error('Get host reservations error:', err);
    res.status(500).json({ message: 'Failed to fetch reservations.' });
  }
};

/**
 * GET /api/reservations/user
 * Returns reservations for the logged-in user. Requires auth.
 */
const getByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const reservations = await Reservation.find({ user: userId })
      .populate('accommodation', 'title location images price')
      .sort({ createdAt: -1 });

    res.status(200).json(reservations);
  } catch (err) {
    console.error('Get user reservations error:', err);
    res.status(500).json({ message: 'Failed to fetch reservations.' });
  }
};

/**
 * DELETE /api/reservations/:id
 * Deletes a reservation. Requires auth.
 */
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid reservation ID.' });
    }

    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    res.status(200).json({ message: 'Reservation deleted successfully.' });
  } catch (err) {
    console.error('Delete reservation error:', err);
    res.status(500).json({ message: 'Failed to delete reservation.' });
  }
};

module.exports = {
  create,
  getByHost,
  getByUser,
  remove,
};

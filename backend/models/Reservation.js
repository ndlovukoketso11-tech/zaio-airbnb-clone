const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  accommodation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accommodation',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
  },
  totalNights: {
    type: Number,
    required: true,
    min: 1,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  subtotal: { type: Number, required: true },
  weeklyDiscount: { type: Number, default: 0 },
  cleaningFee: { type: Number, default: 0 },
  serviceFee: { type: Number, default: 0 },
  occupancyTaxes: { type: Number, default: 0 },
  total: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Reservation', reservationSchema);

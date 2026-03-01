const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
    // e.g. "Entire apartment", "Private room"
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0,
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0,
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  weeklyDiscount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  cleaningFee: {
    type: Number,
    default: 0,
    min: 0,
  },
  serviceFee: {
    type: Number,
    default: 0,
    min: 0,
  },
  occupancyTaxes: {
    type: Number,
    default: 0,
    min: 0,
  },
  amenities: [{
    type: String,
    trim: true,
  }],
  images: [{
    type: String,
    trim: true,
  }],
  host: {
    type: String,
    trim: true,
  },
  host_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0,
  },
  enhancedCleaning: { type: Boolean, default: false },
  selfCheckIn: { type: Boolean, default: false },
  specificRatings: {
    cleanliness: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    checkIn: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    location: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Accommodation', accommodationSchema);

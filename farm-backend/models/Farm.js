const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    soilType: {
      type: String,
      trim: true,
    },
    size: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farm', farmSchema);

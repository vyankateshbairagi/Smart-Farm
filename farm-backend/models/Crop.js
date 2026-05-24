const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
    cropName: {
      type: String,
      required: true,
      trim: true,
    },
    season: {
      type: String,
      trim: true,
    },
    sowingDate: {
      type: Date,
    },
    status: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crop', cropSchema);

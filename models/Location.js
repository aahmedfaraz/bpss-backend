const mongoose = require("mongoose");

const LocationSchema = mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
  },
  city: {
    type: String,
    required: true,
  },
  organizationID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'organization',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Define compound index for date, month, and year
LocationSchema.index({ address: 1, city: 1 }, { unique: true });

module.exports = mongoose.model("location", LocationSchema);

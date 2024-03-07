const mongoose = require("mongoose");

const GuardSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cnic: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  supervisorID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'supervisor',
  },
  locationID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'location',
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

module.exports = mongoose.model("guard", GuardSchema);

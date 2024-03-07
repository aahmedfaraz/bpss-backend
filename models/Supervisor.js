const mongoose = require("mongoose");

const SupervisorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
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

module.exports = mongoose.model("supervisor", SupervisorSchema);

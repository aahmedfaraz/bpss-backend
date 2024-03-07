const mongoose = require("mongoose");

const OrganizationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("organization", OrganizationSchema);

const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema({
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
  organizationID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'organization',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("admin", AdminSchema);

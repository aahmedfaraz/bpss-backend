const mongoose = require("mongoose");

const AttendanceSchema = mongoose.Schema({
  date: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  guardID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'guard',
  },
  supervisorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'supervisor',
  },
});

// Define compound index for date, month, and year
AttendanceSchema.index({ date: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("guard", AttendanceSchema);

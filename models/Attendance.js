const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    index: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  checkIn: {
    type: Date,
    default: null,
  },
  checkOut: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["present", "absent", "late", "half-day", "on-leave"],
    default: "absent",
  },
  workHours: {
    type: Number,
    default: 0,
  },
  overtime: {
    type: Number,
    default: 0,
  },
  leaveType: {
    type: String,
    enum: ["sick", "casual", "annual", "unpaid", "none"],
    default: "none",
  },
  notes: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "Office",
  },
  isRemote: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for efficient queries
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

// Pre-save middleware to calculate work hours
attendanceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Calculate work hours if both check-in and check-out are present
  if (this.checkIn && this.checkOut) {
    const diffMs = this.checkOut - this.checkIn;
    const hours = diffMs / (1000 * 60 * 60);
    this.workHours = Math.round(hours * 100) / 100; // Round to 2 decimal places

    // Calculate overtime (assuming 8 hours is standard)
    if (hours > 8) {
      this.overtime = Math.round((hours - 8) * 100) / 100;
    }

    // Update status based on work hours
    if (hours >= 8) {
      this.status = "present";
    } else if (hours >= 4) {
      this.status = "half-day";
    }
  }

  next();
});

module.exports = attendanceSchema;

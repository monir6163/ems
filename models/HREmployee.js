const mongoose = require("mongoose");

const hrEmployeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  department: {
    type: String,
    default: "HR",
  },
  position: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
  },
  specialization: {
    type: String, // e.g., Recruitment, Training, Payroll
  },
  certifications: {
    type: [String],
    default: [],
  },
  joinDate: {
    type: Date,
    default: Date.now,
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

hrEmployeeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = hrEmployeeSchema;

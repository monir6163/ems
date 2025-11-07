const mongoose = require("mongoose");

const itEmployeeSchema = new mongoose.Schema({
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
    default: "IT",
  },
  position: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
  },
  skills: {
    type: [String],
    default: [],
  },
  projectsAssigned: {
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

itEmployeeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = itEmployeeSchema;

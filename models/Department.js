const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  departmentId: {
    type: String,
    required: true,
    unique: true,
  },
  departmentName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  managerId: {
    type: String,
  },
  location: {
    type: String,
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

// Update the updatedAt field on save
departmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = departmentSchema;

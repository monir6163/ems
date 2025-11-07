const mongoose = require("mongoose");
const { db4 } = require("../config/database");

const financeEmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  position: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  projects: [{
    type: String
  }]
});

const FinanceEmployee = db4.model("FinanceEmployee", financeEmployeeSchema);
module.exports = FinanceEmployee;
const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
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
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
  },
  baseSalary: {
    type: Number,
    required: true,
    min: 0,
  },
  // Earnings
  allowances: {
    housing: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    medical: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
  bonus: {
    type: Number,
    default: 0,
  },
  overtimePay: {
    type: Number,
    default: 0,
  },
  // Deductions
  deductions: {
    tax: { type: Number, default: 0 },
    insurance: { type: Number, default: 0 },
    providentFund: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
  // Attendance-based calculations
  attendanceData: {
    totalWorkingDays: { type: Number, default: 0 },
    daysPresent: { type: Number, default: 0 },
    daysAbsent: { type: Number, default: 0 },
    daysOnLeave: { type: Number, default: 0 },
    totalWorkHours: { type: Number, default: 0 },
    totalOvertime: { type: Number, default: 0 },
  },
  // Calculated fields
  grossSalary: {
    type: Number,
    default: 0,
  },
  totalDeductions: {
    type: Number,
    default: 0,
  },
  netSalary: {
    type: Number,
    default: 0,
  },
  // Payment details
  paymentStatus: {
    type: String,
    enum: ["pending", "processing", "paid", "cancelled"],
    default: "pending",
  },
  paymentDate: {
    type: Date,
    default: null,
  },
  paymentMethod: {
    type: String,
    enum: ["bank-transfer", "cash", "cheque", "none"],
    default: "none",
  },
  notes: {
    type: String,
    default: "",
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
payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

// Pre-save middleware to calculate salaries
payrollSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Calculate total allowances
  const totalAllowances =
    (this.allowances.housing || 0) +
    (this.allowances.transport || 0) +
    (this.allowances.medical || 0) +
    (this.allowances.other || 0);

  // Calculate gross salary
  this.grossSalary =
    this.baseSalary +
    totalAllowances +
    (this.bonus || 0) +
    (this.overtimePay || 0);

  // Calculate total deductions
  this.totalDeductions =
    (this.deductions.tax || 0) +
    (this.deductions.insurance || 0) +
    (this.deductions.providentFund || 0) +
    (this.deductions.other || 0);

  // Calculate net salary
  this.netSalary = this.grossSalary - this.totalDeductions;

  // Apply attendance-based deduction if days absent
  if (
    this.attendanceData.daysAbsent > 0 &&
    this.attendanceData.totalWorkingDays > 0
  ) {
    const perDaySalary = this.baseSalary / this.attendanceData.totalWorkingDays;
    const absentDeduction = perDaySalary * this.attendanceData.daysAbsent;
    this.netSalary -= absentDeduction;
  }

  // Ensure net salary is not negative
  if (this.netSalary < 0) {
    this.netSalary = 0;
  }

  next();
});

module.exports = payrollSchema;

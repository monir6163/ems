const express = require("express");
const router = express.Router();
const { db3 } = require("../config/database");
const hrEmployeeSchema = require("../models/HREmployee");
const {
  isAuthenticated,
  isAdmin,
  isAdminOrManager,
} = require("../middleware/auth");

// Create HREmployee model using db3 connection
const HREmployee = db3.model("HREmployee", hrEmployeeSchema);

// Get all HR employees (accessible by all authenticated users)
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const employees = await HREmployee.find();
    res.json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching HR employees",
      error: error.message,
    });
  }
});

// Get single HR employee by ID (accessible by all authenticated users)
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const employee = await HREmployee.findOne({ employeeId: req.params.id });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "HR Employee not found",
      });
    }
    res.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching HR employee",
      error: error.message,
    });
  }
});

// Create new HR employee (admin or manager only)
router.post("/", isAuthenticated, isAdminOrManager, async (req, res) => {
  try {
    const employee = new HREmployee(req.body);
    await employee.save();
    res.status(201).json({
      success: true,
      message: "HR Employee created successfully",
      data: employee,
      createdBy: req.user.email,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating HR employee",
      error: error.message,
    });
  }
});

// Update HR employee (admin or manager only)
router.put("/:id", isAuthenticated, isAdminOrManager, async (req, res) => {
  try {
    const employee = await HREmployee.findOneAndUpdate(
      { employeeId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "HR Employee not found",
      });
    }
    res.json({
      success: true,
      message: "HR Employee updated successfully",
      data: employee,
      updatedBy: req.user.email,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating HR employee",
      error: error.message,
    });
  }
});

// Delete HR employee (admin only)
router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const employee = await HREmployee.findOneAndDelete({
      employeeId: req.params.id,
    });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "HR Employee not found",
      });
    }
    res.json({
      success: true,
      message: "HR Employee deleted successfully",
      data: employee,
      deletedBy: req.user.email,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting HR employee",
      error: error.message,
    });
  }
});

// Search HR employees by specialization (accessible by all authenticated users)
router.get("/search/specialization", isAuthenticated, async (req, res) => {
  try {
    const { spec } = req.query;
    if (!spec) {
      return res.status(400).json({
        success: false,
        message: "Specialization parameter is required",
      });
    }
    const employees = await HREmployee.find({
      specialization: { $regex: spec, $options: "i" },
    });
    res.json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching HR employees",
      error: error.message,
    });
  }
});

module.exports = router;

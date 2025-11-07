const express = require("express");
const router = express.Router();
const { db2 } = require("../config/database");
const itEmployeeSchema = require("../models/ITEmployee");
const {
  isAuthenticated,
  isAdmin,
  isAdminOrManager,
} = require("../middleware/auth");

// Create ITEmployee model using db2 connection
const ITEmployee = db2.model("ITEmployee", itEmployeeSchema);

// Get all IT employees (accessible by all authenticated users)
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const employees = await ITEmployee.find();
    res.json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching IT employees",
      error: error.message,
    });
  }
});

// Get single IT employee by ID (accessible by all authenticated users)
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const employee = await ITEmployee.findOne({ employeeId: req.params.id });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "IT Employee not found",
      });
    }
    res.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching IT employee",
      error: error.message,
    });
  }
});

// Create new IT employee (admin or manager only)
router.post("/", isAuthenticated, isAdminOrManager, async (req, res) => {
  try {
    const employee = new ITEmployee(req.body);
    await employee.save();
    res.status(201).json({
      success: true,
      message: "IT Employee created successfully",
      data: employee,
      createdBy: req.user.email,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating IT employee",
      error: error.message,
    });
  }
});

// Update IT employee (admin or manager only)
router.put("/:id", isAuthenticated, isAdminOrManager, async (req, res) => {
  try {
    const employee = await ITEmployee.findOneAndUpdate(
      { employeeId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "IT Employee not found",
      });
    }
    res.json({
      success: true,
      message: "IT Employee updated successfully",
      data: employee,
      updatedBy: req.user.email,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating IT employee",
      error: error.message,
    });
  }
});

// Delete IT employee (admin only)
router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const employee = await ITEmployee.findOneAndDelete({
      employeeId: req.params.id,
    });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "IT Employee not found",
      });
    }
    res.json({
      success: true,
      message: "IT Employee deleted successfully",
      data: employee,
      deletedBy: req.user.email,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting IT employee",
      error: error.message,
    });
  }
});

// Search IT employees by skills (accessible by all authenticated users)
router.get("/search/skills", isAuthenticated, async (req, res) => {
  try {
    const { skill } = req.query;
    if (!skill) {
      return res.status(400).json({
        success: false,
        message: "Skill parameter is required",
      });
    }
    const employees = await ITEmployee.find({ skills: { $in: [skill] } });
    res.json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching IT employees",
      error: error.message,
    });
  }
});

module.exports = router;

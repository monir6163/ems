const express = require("express");
const router = express.Router();
const { db1 } = require("../config/database");
const departmentSchema = require("../models/Department");
const {
  isAuthenticated,
  isAdmin,
  isAdminOrManager,
} = require("../middleware/auth");

// Create Department model using db1 connection
const Department = db1.model("Department", departmentSchema);

// Get all departments (accessible by all authenticated users)
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const departments = await Department.find();
    res.json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching departments",
      error: error.message,
    });
  }
});

// Get single department by ID (accessible by all authenticated users)
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const department = await Department.findOne({
      departmentId: req.params.id,
    });
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
    res.json({
      success: true,
      data: department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching department",
      error: error.message,
    });
  }
});

// Create new department (admin only)
router.post("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
      createdBy: req.user.email,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating department",
      error: error.message,
    });
  }
});

// Update department (admin only)
router.put("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const department = await Department.findOneAndUpdate(
      { departmentId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
    res.json({
      success: true,
      message: "Department updated successfully",
      data: department,
      updatedBy: req.user.email,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating department",
      error: error.message,
    });
  }
});

// Delete department (admin only)
router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const department = await Department.findOneAndDelete({
      departmentId: req.params.id,
    });
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
    res.json({
      success: true,
      message: "Department deleted successfully",
      data: department,
      deletedBy: req.user.email,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting department",
      error: error.message,
    });
  }
});

module.exports = router;

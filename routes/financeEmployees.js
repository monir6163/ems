const express = require("express");
const router = express.Router();
const FinanceEmployee = require("../models/FinanceEmployee");

// Get all finance employees
router.get("/", async (req, res) => {
  try {
    const employees = await FinanceEmployee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new finance employee
router.post("/", async (req, res) => {
  const employee = new FinanceEmployee(req.body);
  try {
    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get specific finance employee
router.get("/:id", async (req, res) => {
  try {
    const employee = await FinanceEmployee.findById(req.params.id);
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update finance employee
router.patch("/:id", async (req, res) => {
  try {
    const employee = await FinanceEmployee.findById(req.params.id);
    if (employee) {
      Object.assign(employee, req.body);
      const updatedEmployee = await employee.save();
      res.json(updatedEmployee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete finance employee
router.delete("/:id", async (req, res) => {
  try {
    const employee = await FinanceEmployee.findById(req.params.id);
    if (employee) {
      await employee.deleteOne();
      res.json({ message: "Employee deleted successfully" });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const {
  isAdmin,
  isAdminOrManager,
  isAuthenticated,
} = require("../middleware/auth");

// Create Payroll model
const createPayrollModel = (db) => {
  const payrollSchema = require("../models/Payroll");
  return db.model("Payroll", payrollSchema);
};

// Create Attendance model
const createAttendanceModel = (db) => {
  const attendanceSchema = require("../models/Attendance");
  return db.model("Attendance", attendanceSchema);
};

// Get payroll model
const getPayrollModel = (req) => {
  const { db6 } = require("../config/database");
  return createPayrollModel(db6);
};

// Get attendance model
const getAttendanceModel = (req) => {
  const { db5 } = require("../config/database");
  return createAttendanceModel(db5);
};

// Generate payroll for an employee
router.post(
  "/generate",
  isAuthenticated,
  isAdminOrManager,
  async (req, res) => {
    try {
      const {
        employeeId,
        employeeName,
        department,
        month,
        year,
        baseSalary,
        allowances,
        bonus,
        deductions,
      } = req.body;

      if (
        !employeeId ||
        !employeeName ||
        !department ||
        !month ||
        !year ||
        !baseSalary
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Employee ID, name, department, month, year, and base salary are required",
        });
      }

      const Payroll = getPayrollModel(req);
      const Attendance = getAttendanceModel(req);

      // Check if payroll already exists for this month
      const existingPayroll = await Payroll.findOne({
        employeeId,
        month,
        year,
      });

      if (existingPayroll) {
        return res.status(400).json({
          success: false,
          message: "Payroll already exists for this month",
          data: existingPayroll,
        });
      }

      // Get attendance data for the month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const attendanceRecords = await Attendance.find({
        employeeId,
        date: { $gte: startDate, $lte: endDate },
      });

      // Calculate attendance statistics
      const totalWorkingDays = new Date(year, month, 0).getDate();
      const daysPresent = attendanceRecords.filter(
        (a) => a.status === "present"
      ).length;
      const daysAbsent = attendanceRecords.filter(
        (a) => a.status === "absent"
      ).length;
      const daysOnLeave = attendanceRecords.filter(
        (a) => a.status === "on-leave"
      ).length;
      const totalWorkHours = attendanceRecords.reduce(
        (sum, a) => sum + (a.workHours || 0),
        0
      );
      const totalOvertime = attendanceRecords.reduce(
        (sum, a) => sum + (a.overtime || 0),
        0
      );

      // Calculate overtime pay (assuming hourly rate based on 8-hour workday and 22 working days)
      const hourlyRate = baseSalary / (22 * 8);
      const overtimePay = totalOvertime * hourlyRate * 1.5; // 1.5x for overtime

      // Create payroll
      const payroll = new Payroll({
        employeeId,
        employeeName,
        department,
        month,
        year,
        baseSalary,
        allowances: allowances || {},
        bonus: bonus || 0,
        overtimePay: Math.round(overtimePay * 100) / 100,
        deductions: deductions || {},
        attendanceData: {
          totalWorkingDays,
          daysPresent,
          daysAbsent,
          daysOnLeave,
          totalWorkHours,
          totalOvertime,
        },
      });

      await payroll.save();

      res.status(201).json({
        success: true,
        message: "Payroll generated successfully",
        data: payroll,
      });
    } catch (error) {
      console.error("Generate payroll error:", error);
      res.status(500).json({
        success: false,
        message: "Error generating payroll",
        error: error.message,
      });
    }
  }
);

// Get all payrolls with pagination
router.get("/", isAuthenticated, isAdminOrManager, async (req, res) => {
  try {
    const { page = 1, limit = 20, month, year, department } = req.query;

    const Payroll = getPayrollModel(req);
    const query = {};

    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);
    if (department) query.department = department;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [payrolls, total] = await Promise.all([
      Payroll.find(query)
        .sort({ year: -1, month: -1, employeeName: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Payroll.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: payrolls,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get payrolls error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving payrolls",
      error: error.message,
    });
  }
});

// Get payroll by employee ID
router.get("/employee/:employeeId", isAuthenticated, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const Payroll = getPayrollModel(req);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [payrolls, total] = await Promise.all([
      Payroll.find({ employeeId })
        .sort({ year: -1, month: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Payroll.countDocuments({ employeeId }),
    ]);

    res.status(200).json({
      success: true,
      data: payrolls,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get employee payroll error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving employee payroll",
      error: error.message,
    });
  }
});

// Get specific payroll by ID
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const Payroll = getPayrollModel(req);

    const payroll = await Payroll.findById(id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    res.status(200).json({
      success: true,
      data: payroll,
    });
  } catch (error) {
    console.error("Get payroll error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving payroll",
      error: error.message,
    });
  }
});

// Update payroll
router.put("/:id", isAuthenticated, isAdminOrManager, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const Payroll = getPayrollModel(req);
    const payroll = await Payroll.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payroll updated successfully",
      data: payroll,
    });
  } catch (error) {
    console.error("Update payroll error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating payroll",
      error: error.message,
    });
  }
});

// Update payment status
router.patch(
  "/:id/payment-status",
  isAuthenticated,
  isAdminOrManager,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { paymentStatus, paymentMethod, paymentDate } = req.body;

      if (!paymentStatus) {
        return res.status(400).json({
          success: false,
          message: "Payment status is required",
        });
      }

      const Payroll = getPayrollModel(req);
      const payroll = await Payroll.findById(id);

      if (!payroll) {
        return res.status(404).json({
          success: false,
          message: "Payroll not found",
        });
      }

      payroll.paymentStatus = paymentStatus;
      if (paymentMethod) payroll.paymentMethod = paymentMethod;
      if (paymentDate) payroll.paymentDate = new Date(paymentDate);

      if (paymentStatus === "paid" && !payroll.paymentDate) {
        payroll.paymentDate = new Date();
      }

      await payroll.save();

      res.status(200).json({
        success: true,
        message: "Payment status updated successfully",
        data: payroll,
      });
    } catch (error) {
      console.error("Update payment status error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating payment status",
        error: error.message,
      });
    }
  }
);

// Get payroll summary by department
router.get(
  "/report/department/:department",
  isAuthenticated,
  isAdminOrManager,
  async (req, res) => {
    try {
      const { department } = req.params;
      const { month, year } = req.query;

      const Payroll = getPayrollModel(req);
      const query = { department };

      if (month) query.month = parseInt(month);
      if (year) query.year = parseInt(year);

      const payrolls = await Payroll.find(query);

      const summary = {
        department,
        month: month ? parseInt(month) : "All",
        year: year ? parseInt(year) : "All",
        totalEmployees: payrolls.length,
        totalGrossSalary: payrolls.reduce((sum, p) => sum + p.grossSalary, 0),
        totalDeductions: payrolls.reduce(
          (sum, p) => sum + p.totalDeductions,
          0
        ),
        totalNetSalary: payrolls.reduce((sum, p) => sum + p.netSalary, 0),
        totalBonus: payrolls.reduce((sum, p) => sum + (p.bonus || 0), 0),
        totalOvertimePay: payrolls.reduce(
          (sum, p) => sum + (p.overtimePay || 0),
          0
        ),
        paymentStatus: {
          pending: payrolls.filter((p) => p.paymentStatus === "pending").length,
          processing: payrolls.filter((p) => p.paymentStatus === "processing")
            .length,
          paid: payrolls.filter((p) => p.paymentStatus === "paid").length,
          cancelled: payrolls.filter((p) => p.paymentStatus === "cancelled")
            .length,
        },
      };

      res.status(200).json({
        success: true,
        data: summary,
        payrolls,
      });
    } catch (error) {
      console.error("Get department payroll report error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving department payroll report",
        error: error.message,
      });
    }
  }
);

// Get overall payroll statistics
router.get("/report/statistics", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { month, year } = req.query;

    const Payroll = getPayrollModel(req);
    const query = {};

    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const payrolls = await Payroll.find(query);

    const statistics = {
      period: {
        month: month ? parseInt(month) : "All",
        year: year ? parseInt(year) : "All",
      },
      totalEmployees: payrolls.length,
      totalGrossSalary:
        Math.round(payrolls.reduce((sum, p) => sum + p.grossSalary, 0) * 100) /
        100,
      totalDeductions:
        Math.round(
          payrolls.reduce((sum, p) => sum + p.totalDeductions, 0) * 100
        ) / 100,
      totalNetSalary:
        Math.round(payrolls.reduce((sum, p) => sum + p.netSalary, 0) * 100) /
        100,
      averageGrossSalary:
        payrolls.length > 0
          ? Math.round(
              (payrolls.reduce((sum, p) => sum + p.grossSalary, 0) /
                payrolls.length) *
                100
            ) / 100
          : 0,
      averageNetSalary:
        payrolls.length > 0
          ? Math.round(
              (payrolls.reduce((sum, p) => sum + p.netSalary, 0) /
                payrolls.length) *
                100
            ) / 100
          : 0,
      byDepartment: {},
      paymentStatus: {
        pending: payrolls.filter((p) => p.paymentStatus === "pending").length,
        processing: payrolls.filter((p) => p.paymentStatus === "processing")
          .length,
        paid: payrolls.filter((p) => p.paymentStatus === "paid").length,
        cancelled: payrolls.filter((p) => p.paymentStatus === "cancelled")
          .length,
      },
    };

    // Group by department
    const departments = [...new Set(payrolls.map((p) => p.department))];
    departments.forEach((dept) => {
      const deptPayrolls = payrolls.filter((p) => p.department === dept);
      statistics.byDepartment[dept] = {
        employees: deptPayrolls.length,
        totalNetSalary:
          Math.round(
            deptPayrolls.reduce((sum, p) => sum + p.netSalary, 0) * 100
          ) / 100,
      };
    });

    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error("Get payroll statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving payroll statistics",
      error: error.message,
    });
  }
});

// Delete payroll (admin only)
router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const Payroll = getPayrollModel(req);
    const payroll = await Payroll.findByIdAndDelete(id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payroll deleted successfully",
      data: payroll,
    });
  } catch (error) {
    console.error("Delete payroll error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting payroll",
      error: error.message,
    });
  }
});

module.exports = router;

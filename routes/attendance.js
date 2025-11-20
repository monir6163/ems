const express = require("express");
const router = express.Router();
const {
  isAdmin,
  isAdminOrManager,
  isAuthenticated,
} = require("../middleware/auth");

// Create Attendance model
const createAttendanceModel = (db) => {
  const attendanceSchema = require("../models/Attendance");
  return db.model("Attendance", attendanceSchema);
};

// Get attendance model
const getAttendanceModel = (req) => {
  const { db5 } = require("../config/database");
  return createAttendanceModel(db5);
};

// Check-in endpoint
router.post("/check-in", isAuthenticated, async (req, res) => {
  try {
    const { employeeId, employeeName, department, location, isRemote } =
      req.body;

    if (!employeeId || !employeeName || !department) {
      return res.status(400).json({
        success: false,
        message: "Employee ID, name, and department are required",
      });
    }

    const Attendance = getAttendanceModel(req);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: today,
    });

    if (existingAttendance && existingAttendance.checkIn) {
      return res.status(400).json({
        success: false,
        message: "Already checked in today",
        data: existingAttendance,
      });
    }

    // Create or update attendance
    const attendance =
      existingAttendance ||
      new Attendance({
        employeeId,
        employeeName,
        department,
        date: today,
      });

    attendance.checkIn = new Date();
    attendance.status = "present";
    attendance.location = location || "Office";
    attendance.isRemote = isRemote || false;

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Check-in successful",
      data: attendance,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({
      success: false,
      message: "Error during check-in",
      error: error.message,
    });
  }
});

// Check-out endpoint
router.post("/check-out", isAuthenticated, async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    const Attendance = getAttendanceModel(req);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId,
      date: today,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "No check-in record found for today",
      });
    }

    if (!attendance.checkIn) {
      return res.status(400).json({
        success: false,
        message: "Must check in before checking out",
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: "Already checked out today",
        data: attendance,
      });
    }

    attendance.checkOut = new Date();
    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Check-out successful",
      data: attendance,
    });
  } catch (error) {
    console.error("Check-out error:", error);
    res.status(500).json({
      success: false,
      message: "Error during check-out",
      error: error.message,
    });
  }
});

// Mark attendance manually (admin/manager only)
router.post("/mark", isAuthenticated, isAdminOrManager, async (req, res) => {
  try {
    const {
      employeeId,
      employeeName,
      department,
      date,
      status,
      leaveType,
      notes,
    } = req.body;

    if (!employeeId || !employeeName || !department || !status) {
      return res.status(400).json({
        success: false,
        message: "Employee ID, name, department, and status are required",
      });
    }

    const Attendance = getAttendanceModel(req);
    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = new Attendance({
      employeeId,
      employeeName,
      department,
      date: attendanceDate,
      status,
      leaveType: leaveType || "none",
      notes: notes || "",
    });

    await attendance.save();

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Mark attendance error:", error);
    res.status(500).json({
      success: false,
      message: "Error marking attendance",
      error: error.message,
    });
  }
});

// Get attendance by employee ID
router.get("/employee/:employeeId", isAuthenticated, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate, page = 1, limit = 30 } = req.query;

    const Attendance = getAttendanceModel(req);
    const query = { employeeId };

    // Add date range filter if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [attendance, total] = await Promise.all([
      Attendance.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Attendance.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: attendance,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get attendance error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving attendance",
      error: error.message,
    });
  }
});

// Get today's attendance for an employee
router.get("/today/:employeeId", isAuthenticated, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const Attendance = getAttendanceModel(req);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId,
      date: today,
    });

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("Get today's attendance error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving today's attendance",
      error: error.message,
    });
  }
});

// Get attendance report by department
router.get(
  "/report/department/:department",
  isAuthenticated,
  isAdminOrManager,
  async (req, res) => {
    try {
      const { department } = req.params;
      const { startDate, endDate } = req.query;

      const Attendance = getAttendanceModel(req);
      const query = { department };

      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          query.date.$lte = end;
        }
      }

      const attendance = await Attendance.find(query).sort({ date: -1 });

      // Calculate summary statistics
      const summary = {
        totalRecords: attendance.length,
        present: attendance.filter((a) => a.status === "present").length,
        absent: attendance.filter((a) => a.status === "absent").length,
        late: attendance.filter((a) => a.status === "late").length,
        halfDay: attendance.filter((a) => a.status === "half-day").length,
        onLeave: attendance.filter((a) => a.status === "on-leave").length,
        totalWorkHours: attendance.reduce(
          (sum, a) => sum + (a.workHours || 0),
          0
        ),
        totalOvertime: attendance.reduce(
          (sum, a) => sum + (a.overtime || 0),
          0
        ),
      };

      res.status(200).json({
        success: true,
        data: attendance,
        summary,
      });
    } catch (error) {
      console.error("Get department report error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving department report",
        error: error.message,
      });
    }
  }
);

// Get attendance summary for an employee
router.get("/summary/:employeeId", isAuthenticated, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.query;

    const Attendance = getAttendanceModel(req);

    // Default to current month/year if not provided
    const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    // Create date range for the month
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    const attendance = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    });

    const summary = {
      month: targetMonth,
      year: targetYear,
      totalDays: attendance.length,
      present: attendance.filter((a) => a.status === "present").length,
      absent: attendance.filter((a) => a.status === "absent").length,
      late: attendance.filter((a) => a.status === "late").length,
      halfDay: attendance.filter((a) => a.status === "half-day").length,
      onLeave: attendance.filter((a) => a.status === "on-leave").length,
      totalWorkHours: attendance.reduce(
        (sum, a) => sum + (a.workHours || 0),
        0
      ),
      totalOvertime: attendance.reduce((sum, a) => sum + (a.overtime || 0), 0),
      averageWorkHours:
        attendance.length > 0
          ? (
              attendance.reduce((sum, a) => sum + (a.workHours || 0), 0) /
              attendance.length
            ).toFixed(2)
          : 0,
    };

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Get attendance summary error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving attendance summary",
      error: error.message,
    });
  }
});

// Update attendance (admin/manager only)
router.put("/:id", isAuthenticated, isAdminOrManager, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const Attendance = getAttendanceModel(req);
    const attendance = await Attendance.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Update attendance error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating attendance",
      error: error.message,
    });
  }
});

// Delete attendance (admin only)
router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const Attendance = getAttendanceModel(req);
    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Delete attendance error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting attendance",
      error: error.message,
    });
  }
});

module.exports = router;

// Test Attendance Data
// Run this file using: node testAttendance.js

const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

// Sample attendance data for different employees
const attendanceData = {
  employees: [
    {
      employeeId: "IT001",
      employeeName: "John Doe",
      department: "IT",
    },
    {
      employeeId: "HR001",
      employeeName: "Sarah Smith",
      department: "HR",
    },
    {
      employeeId: "FIN001",
      employeeName: "David Martinez",
      department: "Finance",
    },
    {
      employeeId: "IT002",
      employeeName: "Alice Johnson",
      department: "IT",
    },
    {
      employeeId: "HR002",
      employeeName: "Michael Brown",
      department: "HR",
    },
  ],
};

// Helper function to generate dates for the current month
function generateMonthDates() {
  const dates = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // Get all dates from the 1st to today
  for (let day = 1; day <= today.getDate(); day++) {
    dates.push(new Date(year, month, day));
  }

  return dates;
}

// Generate random check-in time (8:00 AM - 9:30 AM)
function getRandomCheckIn(date) {
  const checkIn = new Date(date);
  const hour = 8 + Math.floor(Math.random() * 2); // 8 or 9
  const minute = Math.floor(Math.random() * 60);
  checkIn.setHours(hour, minute, 0, 0);
  return checkIn;
}

// Generate check-out time (5:00 PM - 7:00 PM)
function getRandomCheckOut(checkIn) {
  const checkOut = new Date(checkIn);
  const hoursWorked = 8 + Math.floor(Math.random() * 3); // 8-10 hours
  checkOut.setHours(checkIn.getHours() + hoursWorked);
  checkOut.setMinutes(checkIn.getMinutes() + Math.floor(Math.random() * 60));
  return checkOut;
}

// Simulate check-in for an employee
async function checkIn(
  employeeId,
  employeeName,
  department,
  checkInTime,
  location = "Office"
) {
  try {
    const response = await axios.post(`${BASE_URL}/attendance/check-in`, {
      employeeId,
      employeeName,
      department,
      location,
      isRemote: location !== "Office",
    });

    // Update the check-in time in database
    if (response.data.data && response.data.data._id) {
      await axios.put(`${BASE_URL}/attendance/${response.data.data._id}`, {
        checkIn: checkInTime,
      });
    }

    return response.data.data;
  } catch (error) {
    console.error(
      `Error check-in for ${employeeName}:`,
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// Simulate check-out for an employee
async function checkOut(employeeId, checkOutTime, attendanceId) {
  try {
    await axios.post(`${BASE_URL}/attendance/check-out`, {
      employeeId,
    });

    // Update the check-out time
    await axios.put(`${BASE_URL}/attendance/${attendanceId}`, {
      checkOut: checkOutTime,
    });

    return true;
  } catch (error) {
    console.error(
      `Error check-out for ${employeeId}:`,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Mark manual attendance (for leaves, absences, etc.)
async function markAttendance(
  employeeId,
  employeeName,
  department,
  date,
  status,
  leaveType = "none",
  notes = ""
) {
  try {
    const response = await axios.post(`${BASE_URL}/attendance/mark`, {
      employeeId,
      employeeName,
      department,
      date,
      status,
      leaveType,
      notes,
    });
    return response.data.data;
  } catch (error) {
    console.error(
      `Error marking attendance:`,
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// Create attendance records for the month
async function createMonthlyAttendance() {
  console.log("\n📅 Creating Monthly Attendance Records...");
  console.log("==========================================\n");

  const dates = generateMonthDates();
  let totalRecords = 0;
  let successCount = 0;

  for (const employee of attendanceData.employees) {
    console.log(
      `\n👤 Processing: ${employee.employeeName} (${employee.employeeId})`
    );

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const dayOfWeek = date.getDay();

      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }

      totalRecords++;

      // 10% chance of leave or absence
      const random = Math.random();

      if (random < 0.05) {
        // Absent
        await markAttendance(
          employee.employeeId,
          employee.employeeName,
          employee.department,
          date,
          "absent",
          "none",
          "Unplanned absence"
        );
        console.log(`   ${date.toLocaleDateString()}: ❌ Absent`);
        successCount++;
      } else if (random < 0.1) {
        // On Leave
        const leaveTypes = ["sick", "casual", "annual"];
        const leaveType =
          leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
        await markAttendance(
          employee.employeeId,
          employee.employeeName,
          employee.department,
          date,
          "on-leave",
          leaveType,
          `${leaveType} leave`
        );
        console.log(
          `   ${date.toLocaleDateString()}: 🏖️  On ${leaveType} leave`
        );
        successCount++;
      } else {
        // Present - simulate check-in and check-out
        const checkInTime = getRandomCheckIn(date);
        const checkOutTime = getRandomCheckOut(checkInTime);
        const location = random < 0.15 ? "Remote" : "Office";

        const attendance = await checkIn(
          employee.employeeId,
          employee.employeeName,
          employee.department,
          checkInTime,
          location
        );

        if (attendance) {
          await checkOut(employee.employeeId, checkOutTime, attendance._id);
          const hours = (
            (checkOutTime - checkInTime) /
            (1000 * 60 * 60)
          ).toFixed(2);
          console.log(
            `   ${date.toLocaleDateString()}: ✅ Present (${hours}h) ${
              location === "Remote" ? "🏠" : "🏢"
            }`
          );
          successCount++;
        }
      }

      // Small delay to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  console.log(
    `\n\n📊 Summary: ${successCount}/${totalRecords} attendance records created\n`
  );
}

// Fetch attendance summary for an employee
async function getEmployeeAttendanceSummary(employeeId) {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const response = await axios.get(
      `${BASE_URL}/attendance/summary/${employeeId}?month=${month}&year=${year}`
    );

    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching summary:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// Display attendance summaries
async function displayAttendanceSummaries() {
  console.log("\n📊 Attendance Summaries for Current Month");
  console.log("==========================================\n");

  for (const employee of attendanceData.employees) {
    const summary = await getEmployeeAttendanceSummary(employee.employeeId);

    if (summary) {
      console.log(`👤 ${employee.employeeName} (${employee.employeeId})`);
      console.log(`   Present Days: ${summary.present}`);
      console.log(`   Absent Days: ${summary.absent}`);
      console.log(`   On Leave: ${summary.onLeave}`);
      console.log(`   Total Work Hours: ${summary.totalWorkHours}h`);
      console.log(`   Average Hours/Day: ${summary.averageWorkHours}h`);
      console.log(`   Overtime: ${summary.totalOvertime}h`);
      console.log("");
    }
  }
}

// Get department report
async function getDepartmentReport(department) {
  try {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const startDate = firstDay.toISOString().split("T")[0];
    const endDate = today.toISOString().split("T")[0];

    const response = await axios.get(
      `${BASE_URL}/attendance/report/department/${department}?startDate=${startDate}&endDate=${endDate}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching department report:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// Display department reports
async function displayDepartmentReports() {
  console.log("\n📈 Department Attendance Reports");
  console.log("=================================\n");

  const departments = ["IT", "HR", "Finance"];

  for (const dept of departments) {
    const report = await getDepartmentReport(dept);

    if (report && report.summary) {
      console.log(`🏢 ${dept} Department`);
      console.log(`   Total Records: ${report.summary.totalRecords}`);
      console.log(`   Present: ${report.summary.present}`);
      console.log(`   Absent: ${report.summary.absent}`);
      console.log(`   On Leave: ${report.summary.onLeave}`);
      console.log(`   Total Work Hours: ${report.summary.totalWorkHours}h`);
      console.log(`   Total Overtime: ${report.summary.totalOvertime}h`);
      console.log("");
    }
  }
}

// Main function
async function main() {
  console.log("🚀 Starting Attendance System Test Data Creation...");
  console.log("====================================================\n");
  console.log("This script will:");
  console.log("  1. Create attendance records for 5 employees");
  console.log("  2. Generate data for the current month (weekdays only)");
  console.log("  3. Include check-in/check-out times");
  console.log("  4. Simulate leaves and absences");
  console.log("  5. Show attendance summaries and reports\n");

  try {
    // Step 1: Create monthly attendance
    await createMonthlyAttendance();

    // Step 2: Display employee summaries
    await displayAttendanceSummaries();

    // Step 3: Display department reports
    await displayDepartmentReports();

    console.log("\n✨ Attendance Test Data Creation Completed!");
    console.log("\n📝 API Endpoints Used:");
    console.log("   - POST   /api/attendance/check-in");
    console.log("   - POST   /api/attendance/check-out");
    console.log("   - POST   /api/attendance/mark");
    console.log("   - GET    /api/attendance/summary/:employeeId");
    console.log("   - GET    /api/attendance/report/department/:department");
    console.log("\n💡 Tips:");
    console.log(
      "   - All attendance data is stored in Database 5 (Attendance DB)"
    );
    console.log("   - Work hours are calculated automatically");
    console.log("   - Overtime is tracked for hours beyond 8");
    console.log("   - Check http://localhost:5000/health for database status");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the script
main();

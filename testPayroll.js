// Test Payroll Data
// Run this file using: node testPayroll.js

const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

// Sample employee payroll data
const employeesPayroll = [
  {
    employeeId: "IT001",
    employeeName: "John Doe",
    department: "IT",
    baseSalary: 95000,
    allowances: {
      housing: 15000,
      transport: 5000,
      medical: 3000,
      other: 2000,
    },
    deductions: {
      tax: 12000,
      insurance: 2500,
      providentFund: 4750,
      other: 0,
    },
  },
  {
    employeeId: "HR001",
    employeeName: "Sarah Smith",
    department: "HR",
    baseSalary: 82000,
    allowances: {
      housing: 12000,
      transport: 4000,
      medical: 2500,
      other: 1500,
    },
    deductions: {
      tax: 10000,
      insurance: 2000,
      providentFund: 4100,
      other: 0,
    },
  },
  {
    employeeId: "FIN001",
    employeeName: "David Martinez",
    department: "Finance",
    baseSalary: 120000,
    allowances: {
      housing: 20000,
      transport: 6000,
      medical: 4000,
      other: 3000,
    },
    deductions: {
      tax: 18000,
      insurance: 3000,
      providentFund: 6000,
      other: 0,
    },
  },
  {
    employeeId: "IT002",
    employeeName: "Alice Johnson",
    department: "IT",
    baseSalary: 88000,
    allowances: {
      housing: 13000,
      transport: 4500,
      medical: 2800,
      other: 1700,
    },
    deductions: {
      tax: 11000,
      insurance: 2200,
      providentFund: 4400,
      other: 0,
    },
  },
  {
    employeeId: "HR002",
    employeeName: "Michael Brown",
    department: "HR",
    baseSalary: 68000,
    allowances: {
      housing: 10000,
      transport: 3500,
      medical: 2000,
      other: 1000,
    },
    deductions: {
      tax: 8000,
      insurance: 1700,
      providentFund: 3400,
      other: 0,
    },
  },
  {
    employeeId: "FIN002",
    employeeName: "Jennifer Lee",
    department: "Finance",
    baseSalary: 95000,
    allowances: {
      housing: 15000,
      transport: 5000,
      medical: 3000,
      other: 2000,
    },
    deductions: {
      tax: 12000,
      insurance: 2500,
      providentFund: 4750,
      other: 0,
    },
  },
];

// Generate payroll for current month
async function generatePayroll(employeeData, month, year, bonus = 0) {
  try {
    const response = await axios.post(`${BASE_URL}/payroll/generate`, {
      ...employeeData,
      month,
      year,
      bonus,
    });

    return response.data.data;
  } catch (error) {
    console.error(
      `Error generating payroll for ${employeeData.employeeName}:`,
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// Generate payroll for all employees
async function generateMonthlyPayroll() {
  console.log("\n💰 Generating Monthly Payroll...");
  console.log("==================================\n");

  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  let successCount = 0;
  let errorCount = 0;

  for (const employee of employeesPayroll) {
    // Random bonus for some employees (0-5000)
    const bonus = Math.random() < 0.3 ? Math.floor(Math.random() * 5000) : 0;

    const payroll = await generatePayroll(employee, month, year, bonus);

    if (payroll) {
      console.log(`✅ ${employee.employeeName} (${employee.department})`);
      console.log(`   Base Salary: $${payroll.baseSalary.toLocaleString()}`);
      console.log(`   Gross Salary: $${payroll.grossSalary.toLocaleString()}`);
      console.log(
        `   Total Deductions: $${payroll.totalDeductions.toLocaleString()}`
      );
      console.log(`   Net Salary: $${payroll.netSalary.toLocaleString()}`);
      if (bonus > 0) {
        console.log(`   🎁 Bonus: $${bonus.toLocaleString()}`);
      }
      if (payroll.overtimePay > 0) {
        console.log(
          `   ⏰ Overtime Pay: $${payroll.overtimePay.toLocaleString()}`
        );
      }
      console.log(
        `   📊 Attendance: ${payroll.attendanceData.daysPresent}/${payroll.attendanceData.totalWorkingDays} days`
      );
      console.log("");
      successCount++;
    } else {
      errorCount++;
    }

    // Small delay
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log(
    `📊 Summary: ${successCount} payrolls generated, ${errorCount} failed\n`
  );
}

// Get payroll by employee
async function getEmployeePayroll(employeeId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/payroll/employee/${employeeId}`
    );
    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching payroll:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// Update payment status
async function updatePaymentStatus(payrollId, status, method) {
  try {
    const response = await axios.patch(
      `${BASE_URL}/payroll/${payrollId}/payment-status`,
      {
        paymentStatus: status,
        paymentMethod: method,
        paymentDate: new Date(),
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(
      "Error updating payment status:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// Process payments for all payrolls
async function processPayments() {
  console.log("\n💳 Processing Payments...");
  console.log("==========================\n");

  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  try {
    const response = await axios.get(
      `${BASE_URL}/payroll?month=${month}&year=${year}`
    );

    const payrolls = response.data.data;

    if (!payrolls || payrolls.length === 0) {
      console.log("No payrolls found to process.");
      return;
    }

    for (const payroll of payrolls) {
      // Randomly assign payment status
      const statuses = ["processing", "processing", "paid", "paid", "paid"];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const method = status === "paid" ? "bank-transfer" : "none";

      const updated = await updatePaymentStatus(payroll._id, status, method);

      if (updated) {
        const icon = status === "paid" ? "✅" : "⏳";
        console.log(`${icon} ${payroll.employeeName}: ${status.toUpperCase()}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  } catch (error) {
    console.error(
      "Error processing payments:",
      error.response?.data?.message || error.message
    );
  }
}

// Get department payroll report
async function getDepartmentReport(department) {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const response = await axios.get(
      `${BASE_URL}/payroll/report/department/${department}?month=${month}&year=${year}`
    );

    return response.data.data;
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
  console.log("\n\n📈 Department Payroll Reports");
  console.log("==============================\n");

  const departments = ["IT", "HR", "Finance"];

  for (const dept of departments) {
    const report = await getDepartmentReport(dept);

    if (report) {
      console.log(`🏢 ${dept} Department`);
      console.log(`   Total Employees: ${report.totalEmployees}`);
      console.log(
        `   Total Gross Salary: $${report.totalGrossSalary.toLocaleString()}`
      );
      console.log(
        `   Total Deductions: $${report.totalDeductions.toLocaleString()}`
      );
      console.log(
        `   Total Net Salary: $${report.totalNetSalary.toLocaleString()}`
      );
      console.log(`   Total Bonus: $${report.totalBonus.toLocaleString()}`);
      console.log(
        `   Total Overtime Pay: $${report.totalOvertimePay.toLocaleString()}`
      );
      console.log(`   Payment Status:`);
      console.log(`      Pending: ${report.paymentStatus.pending}`);
      console.log(`      Processing: ${report.paymentStatus.processing}`);
      console.log(`      Paid: ${report.paymentStatus.paid}`);
      console.log("");
    }
  }
}

// Get overall statistics
async function getOverallStatistics() {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const response = await axios.get(
      `${BASE_URL}/payroll/report/statistics?month=${month}&year=${year}`
    );

    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching statistics:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// Display overall statistics
async function displayOverallStatistics() {
  console.log("\n📊 Overall Payroll Statistics");
  console.log("==============================\n");

  const stats = await getOverallStatistics();

  if (stats) {
    console.log(`📅 Period: ${stats.period.month}/${stats.period.year}`);
    console.log(`👥 Total Employees: ${stats.totalEmployees}`);
    console.log(
      `💵 Total Gross Salary: $${stats.totalGrossSalary.toLocaleString()}`
    );
    console.log(
      `➖ Total Deductions: $${stats.totalDeductions.toLocaleString()}`
    );
    console.log(
      `💰 Total Net Salary: $${stats.totalNetSalary.toLocaleString()}`
    );
    console.log(
      `📈 Average Gross Salary: $${stats.averageGrossSalary.toLocaleString()}`
    );
    console.log(
      `📉 Average Net Salary: $${stats.averageNetSalary.toLocaleString()}`
    );
    console.log("\n💳 Payment Status:");
    console.log(`   Pending: ${stats.paymentStatus.pending}`);
    console.log(`   Processing: ${stats.paymentStatus.processing}`);
    console.log(`   Paid: ${stats.paymentStatus.paid}`);
    console.log(`   Cancelled: ${stats.paymentStatus.cancelled}`);

    console.log("\n🏢 By Department:");
    Object.keys(stats.byDepartment).forEach((dept) => {
      console.log(
        `   ${dept}: ${
          stats.byDepartment[dept].employees
        } employees, $${stats.byDepartment[
          dept
        ].totalNetSalary.toLocaleString()}`
      );
    });
  }
}

// Main function
async function main() {
  console.log("🚀 Starting Payroll System Test Data Creation...");
  console.log("=================================================\n");
  console.log("This script will:");
  console.log("  1. Generate payroll for 6 employees");
  console.log("  2. Include salary, allowances, and deductions");
  console.log("  3. Calculate based on attendance data");
  console.log("  4. Process payments");
  console.log("  5. Show department and overall statistics\n");

  try {
    // Step 1: Generate monthly payroll
    await generateMonthlyPayroll();

    // Step 2: Process payments
    await processPayments();

    // Step 3: Display department reports
    await displayDepartmentReports();

    // Step 4: Display overall statistics
    await displayOverallStatistics();

    console.log("\n\n✨ Payroll Test Data Creation Completed!");
    console.log("\n📝 API Endpoints Used:");
    console.log("   - POST  /api/payroll/generate");
    console.log("   - GET   /api/payroll/employee/:employeeId");
    console.log("   - PATCH /api/payroll/:id/payment-status");
    console.log("   - GET   /api/payroll/report/department/:department");
    console.log("   - GET   /api/payroll/report/statistics");
    console.log("\n💡 Tips:");
    console.log("   - All payroll data is stored in Database 6 (Payroll DB)");
    console.log("   - Salaries are calculated automatically with attendance");
    console.log("   - Overtime pay is included based on work hours");
    console.log("   - Check http://localhost:5000/health for database status");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the script
main();

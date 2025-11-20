// Test Finance Employee Data
// Run this file using: node testFinanceData.js

const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

// Sample Finance Employees
const financeEmployees = [
  {
    name: "David Martinez",
    email: "david.martinez@company.com",
    position: "Chief Financial Officer",
    salary: 120000,
    experience: 15,
    projects: [
      "Annual Budget Planning 2025",
      "Financial Restructuring",
      "Investment Portfolio Management",
    ],
  },
  {
    name: "Jennifer Lee",
    email: "jennifer.lee@company.com",
    position: "Finance Manager",
    salary: 95000,
    experience: 10,
    projects: [
      "Quarterly Financial Reports",
      "Cost Reduction Initiative",
      "Financial Audit 2025",
    ],
  },
  {
    name: "Robert Chen",
    email: "robert.chen@company.com",
    position: "Senior Accountant",
    salary: 78000,
    experience: 8,
    projects: [
      "Tax Filing and Compliance",
      "Accounts Payable Management",
      "Revenue Recognition Analysis",
    ],
  },
  {
    name: "Maria Garcia",
    email: "maria.garcia@company.com",
    position: "Financial Analyst",
    salary: 72000,
    experience: 6,
    projects: [
      "Market Trend Analysis",
      "Budget Forecasting",
      "Performance Metrics Dashboard",
    ],
  },
  {
    name: "Thomas Wilson",
    email: "thomas.wilson@company.com",
    position: "Accounts Payable Specialist",
    salary: 58000,
    experience: 5,
    projects: [
      "Vendor Payment Processing",
      "Invoice Management System",
      "Payment Reconciliation",
    ],
  },
  {
    name: "Lisa Anderson",
    email: "lisa.anderson@company.com",
    position: "Accounts Receivable Specialist",
    salary: 56000,
    experience: 4,
    projects: [
      "Customer Invoice Tracking",
      "Collections Management",
      "Credit Control",
    ],
  },
  {
    name: "James Taylor",
    email: "james.taylor@company.com",
    position: "Payroll Coordinator",
    salary: 62000,
    experience: 7,
    projects: [
      "Monthly Payroll Processing",
      "Benefits Administration",
      "Tax Withholding Management",
    ],
  },
  {
    name: "Patricia Moore",
    email: "patricia.moore@company.com",
    position: "Budget Analyst",
    salary: 68000,
    experience: 6,
    projects: [
      "Department Budget Allocation",
      "Expense Tracking System",
      "Cost-Benefit Analysis",
    ],
  },
  {
    name: "Kevin Zhang",
    email: "kevin.zhang@company.com",
    position: "Tax Consultant",
    salary: 85000,
    experience: 9,
    projects: [
      "Corporate Tax Strategy",
      "International Tax Compliance",
      "Tax Optimization Planning",
    ],
  },
  {
    name: "Amanda White",
    email: "amanda.white@company.com",
    position: "Internal Auditor",
    salary: 75000,
    experience: 7,
    projects: [
      "Risk Assessment Review",
      "Internal Control Testing",
      "Compliance Audit",
    ],
  },
  {
    name: "Daniel Rodriguez",
    email: "daniel.rodriguez@company.com",
    position: "Treasury Analyst",
    salary: 70000,
    experience: 5,
    projects: [
      "Cash Flow Management",
      "Investment Portfolio Tracking",
      "Foreign Exchange Risk Management",
    ],
  },
  {
    name: "Michelle Kim",
    email: "michelle.kim@company.com",
    position: "Financial Controller",
    salary: 92000,
    experience: 11,
    projects: [
      "Financial Statement Preparation",
      "Month-End Close Process",
      "Financial Controls Implementation",
    ],
  },
];

async function createFinanceEmployees() {
  console.log("\n💰 Creating Finance Employees...");
  console.log("=====================================\n");

  let successCount = 0;
  let errorCount = 0;

  for (const emp of financeEmployees) {
    try {
      const response = await axios.post(`${BASE_URL}/finance-employees`, emp);
      console.log(`✅ Created: ${emp.name} (${emp.position})`);
      console.log(`   - Salary: $${emp.salary.toLocaleString()}`);
      console.log(`   - Experience: ${emp.experience} years`);
      console.log(`   - Projects: ${emp.projects.length}`);
      console.log("");
      successCount++;
    } catch (error) {
      console.log(
        `❌ Error creating ${emp.name}:`,
        error.response?.data?.message || error.message
      );
      errorCount++;
    }
  }

  console.log(`\n📊 Summary: ${successCount} created, ${errorCount} failed\n`);
}

async function fetchAllFinanceEmployees() {
  console.log("\n📋 Fetching All Finance Employees...");
  console.log("====================================\n");

  try {
    const response = await axios.get(`${BASE_URL}/finance-employees`);
    console.log(`Total Finance Employees: ${response.data.count}\n`);

    if (response.data.data.length > 0) {
      // Group by position
      const positions = {};
      response.data.data.forEach((emp) => {
        if (!positions[emp.position]) {
          positions[emp.position] = [];
        }
        positions[emp.position].push(emp);
      });

      console.log("--- BY POSITION ---\n");
      Object.keys(positions).forEach((position) => {
        console.log(`${position}:`);
        positions[position].forEach((emp) => {
          console.log(
            `  - ${emp.name} | $${emp.salary.toLocaleString()} | ${
              emp.experience
            } years exp`
          );
        });
        console.log("");
      });

      // Calculate statistics
      const totalSalary = response.data.data.reduce(
        (sum, emp) => sum + emp.salary,
        0
      );
      const avgSalary = totalSalary / response.data.data.length;
      const avgExperience =
        response.data.data.reduce((sum, emp) => sum + emp.experience, 0) /
        response.data.data.length;

      console.log("--- STATISTICS ---\n");
      console.log(
        `Total Salary Budget: $${totalSalary.toLocaleString()} per year`
      );
      console.log(`Average Salary: $${avgSalary.toFixed(2).toLocaleString()}`);
      console.log(`Average Experience: ${avgExperience.toFixed(1)} years`);
      console.log(
        `Highest Paid: ${
          response.data.data.reduce((max, emp) =>
            emp.salary > max.salary ? emp : max
          ).name
        } - $${response.data.data
          .reduce((max, emp) => (emp.salary > max.salary ? emp : max))
          .salary.toLocaleString()}`
      );
    }
  } catch (error) {
    console.error("❌ Error fetching finance employees:", error.message);
  }
}

async function fetchFinanceEmployeeById() {
  console.log("\n🔍 Fetching Finance Employee by Email...");
  console.log("=========================================\n");

  try {
    const email = "david.martinez@company.com";
    const response = await axios.get(
      `${BASE_URL}/finance-employees?email=${email}`
    );

    if (response.data.data.length > 0) {
      const emp = response.data.data[0];
      console.log(`Name: ${emp.name}`);
      console.log(`Email: ${emp.email}`);
      console.log(`Position: ${emp.position}`);
      console.log(`Salary: $${emp.salary.toLocaleString()}`);
      console.log(`Experience: ${emp.experience} years`);
      console.log(`Join Date: ${new Date(emp.joinDate).toLocaleDateString()}`);
      console.log(`\nProjects:`);
      emp.projects.forEach((project, index) => {
        console.log(`  ${index + 1}. ${project}`);
      });
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function updateFinanceEmployee() {
  console.log("\n✏️ Updating Finance Employee...");
  console.log("================================\n");

  try {
    // First, get the employee
    const email = "jennifer.lee@company.com";
    const getResponse = await axios.get(
      `${BASE_URL}/finance-employees?email=${email}`
    );

    if (getResponse.data.data.length > 0) {
      const emp = getResponse.data.data[0];
      const employeeId = emp._id;

      // Update the employee
      const updateData = {
        salary: 98000,
        projects: [
          ...emp.projects,
          "Q4 Financial Performance Review",
          "Strategic Planning 2026",
        ],
      };

      const updateResponse = await axios.put(
        `${BASE_URL}/finance-employees/${employeeId}`,
        updateData
      );

      console.log(`✅ Updated: ${updateResponse.data.data.name}`);
      console.log(
        `   - New Salary: $${updateResponse.data.data.salary.toLocaleString()}`
      );
      console.log(
        `   - Total Projects: ${updateResponse.data.data.projects.length}`
      );
    }
  } catch (error) {
    console.error("❌ Error:", error.response?.data?.message || error.message);
  }
}

async function searchFinanceEmployees() {
  console.log("\n🔎 Searching Finance Employees...");
  console.log("==================================\n");

  try {
    // Search by salary range (employees earning more than $80,000)
    console.log("High Earners (Salary > $80,000):");
    const response = await axios.get(`${BASE_URL}/finance-employees`);
    const highEarners = response.data.data.filter((emp) => emp.salary > 80000);
    highEarners.forEach((emp) => {
      console.log(`  - ${emp.name}: $${emp.salary.toLocaleString()}`);
    });

    // Search by experience (senior employees with 8+ years)
    console.log("\nSenior Employees (8+ years experience):");
    const seniorEmps = response.data.data.filter((emp) => emp.experience >= 8);
    seniorEmps.forEach((emp) => {
      console.log(`  - ${emp.name}: ${emp.experience} years`);
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function main() {
  console.log("🚀 Starting Finance Employee Test Data Creation...");
  console.log("===================================================\n");
  console.log("This script will:");
  console.log("  1. Create sample finance employees");
  console.log("  2. Fetch and display all finance employees");
  console.log("  3. Demonstrate search and filter operations");
  console.log("  4. Update employee data");
  console.log("  5. Show statistics and analytics\n");

  try {
    // Step 1: Create finance employees
    await createFinanceEmployees();

    // Step 2: Fetch all finance employees
    await fetchAllFinanceEmployees();

    // Step 3: Fetch specific employee
    await fetchFinanceEmployeeById();

    // Step 4: Update employee
    await updateFinanceEmployee();

    // Step 5: Search and filter
    await searchFinanceEmployees();

    console.log("\n\n✨ Finance Employee Test Data Creation Completed!");
    console.log("\n📝 API Endpoints Available:");
    console.log(
      "   - GET    /api/finance-employees - Get all finance employees"
    );
    console.log(
      "   - GET    /api/finance-employees/:id - Get specific employee"
    );
    console.log("   - POST   /api/finance-employees - Create new employee");
    console.log("   - PUT    /api/finance-employees/:id - Update employee");
    console.log("   - DELETE /api/finance-employees/:id - Delete employee");
    console.log("\n💡 Tips:");
    console.log(
      "   - Use query parameters for filtering (e.g., ?email=abc@company.com)"
    );
    console.log("   - All data is stored in Database 4 (Finance DB)");
    console.log("   - Check http://localhost:5000/health for database status");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the script
main();

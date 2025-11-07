// Sample data to test the Employee Management System
// Run this file using: node testData.js

const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

// Sample Departments
const departments = [
  {
    departmentId: "DEPT001",
    departmentName: "Information Technology",
    description: "Manages all IT infrastructure and software development",
    managerId: "IT001",
    location: "Building A, Floor 3",
  },
  {
    departmentId: "DEPT002",
    departmentName: "Human Resources",
    description: "Handles recruitment, training, and employee relations",
    managerId: "HR001",
    location: "Building B, Floor 2",
  },
];

// Sample IT Employees
const itEmployees = [
  {
    employeeId: "IT001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1234567890",
    position: "Senior Full Stack Developer",
    salary: 95000,
    skills: ["JavaScript", "Node.js", "React", "MongoDB", "Express"],
    projectsAssigned: ["EMS Project", "Dashboard System", "Mobile App"],
  },
  {
    employeeId: "IT002",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@company.com",
    phone: "+1234567891",
    position: "DevOps Engineer",
    salary: 88000,
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
    projectsAssigned: ["Infrastructure Setup", "Cloud Migration"],
  },
  {
    employeeId: "IT003",
    firstName: "Bob",
    lastName: "Williams",
    email: "bob.williams@company.com",
    phone: "+1234567892",
    position: "Frontend Developer",
    salary: 75000,
    skills: ["React", "Vue.js", "CSS", "TypeScript", "UI/UX"],
    projectsAssigned: ["Dashboard System", "Client Portal"],
  },
];

// Sample HR Employees
const hrEmployees = [
  {
    employeeId: "HR001",
    firstName: "Sarah",
    lastName: "Smith",
    email: "sarah.smith@company.com",
    phone: "+1234567893",
    position: "HR Manager",
    salary: 82000,
    specialization: "Recruitment",
    certifications: ["SHRM-CP", "PHR", "Certified Recruiter"],
  },
  {
    employeeId: "HR002",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@company.com",
    phone: "+1234567894",
    position: "Training Coordinator",
    salary: 68000,
    specialization: "Training and Development",
    certifications: ["CPTD", "ATD Master Trainer"],
  },
  {
    employeeId: "HR003",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@company.com",
    phone: "+1234567895",
    position: "Payroll Specialist",
    salary: 65000,
    specialization: "Payroll",
    certifications: ["CPP", "Certified Payroll Professional"],
  },
];

async function createDepartments() {
  console.log("\n📁 Creating Departments...");
  for (const dept of departments) {
    try {
      const response = await axios.post(`${BASE_URL}/departments`, dept);
      console.log(`✅ Created: ${dept.departmentName}`);
    } catch (error) {
      console.log(
        `❌ Error creating ${dept.departmentName}:`,
        error.response?.data?.message || error.message
      );
    }
  }
}

async function createITEmployees() {
  console.log("\n👨‍💻 Creating IT Employees...");
  for (const emp of itEmployees) {
    try {
      const response = await axios.post(`${BASE_URL}/it-employees`, emp);
      console.log(
        `✅ Created: ${emp.firstName} ${emp.lastName} (${emp.position})`
      );
    } catch (error) {
      console.log(
        `❌ Error creating ${emp.firstName} ${emp.lastName}:`,
        error.response?.data?.message || error.message
      );
    }
  }
}

async function createHREmployees() {
  console.log("\n👥 Creating HR Employees...");
  for (const emp of hrEmployees) {
    try {
      const response = await axios.post(`${BASE_URL}/hr-employees`, emp);
      console.log(
        `✅ Created: ${emp.firstName} ${emp.lastName} (${emp.position})`
      );
    } catch (error) {
      console.log(
        `❌ Error creating ${emp.firstName} ${emp.lastName}:`,
        error.response?.data?.message || error.message
      );
    }
  }
}

async function fetchAllData() {
  console.log("\n\n📊 Fetching All Data...\n");

  try {
    console.log("--- DEPARTMENTS (DB1) ---");
    const depts = await axios.get(`${BASE_URL}/departments`);
    console.log(`Total Departments: ${depts.data.count}`);
    depts.data.data.forEach((d) =>
      console.log(`  - ${d.departmentName} (${d.departmentId})`)
    );

    console.log("\n--- IT EMPLOYEES (DB2) ---");
    const itEmps = await axios.get(`${BASE_URL}/it-employees`);
    console.log(`Total IT Employees: ${itEmps.data.count}`);
    itEmps.data.data.forEach((e) =>
      console.log(`  - ${e.firstName} ${e.lastName} - ${e.position}`)
    );

    console.log("\n--- HR EMPLOYEES (DB3) ---");
    const hrEmps = await axios.get(`${BASE_URL}/hr-employees`);
    console.log(`Total HR Employees: ${hrEmps.data.count}`);
    hrEmps.data.data.forEach((e) =>
      console.log(`  - ${e.firstName} ${e.lastName} - ${e.position}`)
    );
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

async function main() {
  console.log("🚀 Starting Employee Management System Test Data Creation...");
  console.log("================================================\n");

  try {
    await createDepartments();
    await createITEmployees();
    await createHREmployees();
    await fetchAllData();

    console.log("\n\n✨ Test data creation completed successfully!");
    console.log("\n📝 You can now test the API using:");
    console.log("   - http://localhost:5000/api/departments");
    console.log("   - http://localhost:5000/api/it-employees");
    console.log("   - http://localhost:5000/api/hr-employees");
    console.log("   - http://localhost:5000/health");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the script
main();

// Test Role-Based Access Control with Middleware
// This script tests admin-only and admin/manager access to protected routes

const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

let adminToken = "";
let managerToken = "";
let employeeToken = "";

// Test users
const users = {
  admin: { email: "admin@company.com", password: "admin123" },
  manager: { email: "john.doe@company.com", password: "john123" },
  employee: { email: "alice.smith@company.com", password: "alice123" },
};

// Login and get token
async function login(email, password) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data.data.token;
  } catch (error) {
    console.error(
      `Login failed for ${email}:`,
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// Test without authentication
async function testWithoutAuth() {
  console.log("\n🚫 TEST 1: Access Protected Routes WITHOUT Authentication");
  console.log("=".repeat(60));

  try {
    await axios.get(`${BASE_URL}/departments`);
    console.log("❌ FAIL: Should not access departments without token");
  } catch (error) {
    console.log("✅ PASS: Cannot access departments without token");
    console.log(`   Message: ${error.response?.data?.message}`);
  }

  try {
    await axios.post(`${BASE_URL}/departments`, {
      departmentId: "TEST001",
      departmentName: "Test Department",
    });
    console.log("❌ FAIL: Should not create department without token");
  } catch (error) {
    console.log("✅ PASS: Cannot create department without token");
    console.log(`   Message: ${error.response?.data?.message}`);
  }
}

// Test with employee token (lowest privilege)
async function testWithEmployeeToken() {
  console.log("\n👤 TEST 2: EMPLOYEE Role Access (Lowest Privilege)");
  console.log("=".repeat(60));

  // Can view departments
  try {
    const response = await axios.get(`${BASE_URL}/departments`, {
      headers: { Authorization: `Bearer ${employeeToken}` },
    });
    console.log("✅ PASS: Employee can VIEW departments");
    console.log(`   Found ${response.data.count} departments`);
  } catch (error) {
    console.log("❌ FAIL: Employee should be able to view departments");
  }

  // Cannot create department
  try {
    await axios.post(
      `${BASE_URL}/departments`,
      {
        departmentId: "EMP001",
        departmentName: "Employee Test Department",
      },
      {
        headers: { Authorization: `Bearer ${employeeToken}` },
      }
    );
    console.log("❌ FAIL: Employee should NOT create departments");
  } catch (error) {
    console.log("✅ PASS: Employee CANNOT create departments (Admin only)");
    console.log(`   Message: ${error.response?.data?.message}`);
  }

  // Cannot create IT employee
  try {
    await axios.post(
      `${BASE_URL}/it-employees`,
      {
        employeeId: "EMP001",
        firstName: "Test",
        lastName: "Employee",
        email: "test@company.com",
        position: "Developer",
      },
      {
        headers: { Authorization: `Bearer ${employeeToken}` },
      }
    );
    console.log("❌ FAIL: Employee should NOT create IT employees");
  } catch (error) {
    console.log(
      "✅ PASS: Employee CANNOT create IT employees (Admin/Manager only)"
    );
    console.log(`   Message: ${error.response?.data?.message}`);
  }

  // Can view IT employees
  try {
    const response = await axios.get(`${BASE_URL}/it-employees`, {
      headers: { Authorization: `Bearer ${employeeToken}` },
    });
    console.log("✅ PASS: Employee can VIEW IT employees");
    console.log(`   Found ${response.data.count} IT employees`);
  } catch (error) {
    console.log("❌ FAIL: Employee should be able to view IT employees");
  }
}

// Test with manager token (mid-level privilege)
async function testWithManagerToken() {
  console.log("\n👔 TEST 3: MANAGER Role Access (Mid-Level Privilege)");
  console.log("=".repeat(60));

  // Can view departments
  try {
    const response = await axios.get(`${BASE_URL}/departments`, {
      headers: { Authorization: `Bearer ${managerToken}` },
    });
    console.log("✅ PASS: Manager can VIEW departments");
    console.log(`   Found ${response.data.count} departments`);
  } catch (error) {
    console.log("❌ FAIL: Manager should be able to view departments");
  }

  // Cannot create department
  try {
    await axios.post(
      `${BASE_URL}/departments`,
      {
        departmentId: "MGR001",
        departmentName: "Manager Test Department",
      },
      {
        headers: { Authorization: `Bearer ${managerToken}` },
      }
    );
    console.log("❌ FAIL: Manager should NOT create departments");
  } catch (error) {
    console.log("✅ PASS: Manager CANNOT create departments (Admin only)");
    console.log(`   Message: ${error.response?.data?.message}`);
  }

  // CAN create IT employee
  try {
    const response = await axios.post(
      `${BASE_URL}/it-employees`,
      {
        employeeId: "MGR" + Date.now(),
        firstName: "Manager",
        lastName: "Created",
        email: `manager.test${Date.now()}@company.com`,
        position: "Junior Developer",
        skills: ["JavaScript"],
      },
      {
        headers: { Authorization: `Bearer ${managerToken}` },
      }
    );
    console.log("✅ PASS: Manager CAN create IT employees");
    console.log(
      `   Created: ${response.data.data.firstName} ${response.data.data.lastName}`
    );
    console.log(`   Created by: ${response.data.createdBy}`);
  } catch (error) {
    console.log("❌ FAIL: Manager should be able to create IT employees");
    console.log(`   Error: ${error.response?.data?.message}`);
  }

  // CAN create HR employee
  try {
    const response = await axios.post(
      `${BASE_URL}/hr-employees`,
      {
        employeeId: "MGHR" + Date.now(),
        firstName: "HR",
        lastName: "Manager Created",
        email: `hr.manager${Date.now()}@company.com`,
        position: "HR Assistant",
        specialization: "Recruitment",
      },
      {
        headers: { Authorization: `Bearer ${managerToken}` },
      }
    );
    console.log("✅ PASS: Manager CAN create HR employees");
    console.log(
      `   Created: ${response.data.data.firstName} ${response.data.data.lastName}`
    );
    console.log(`   Created by: ${response.data.createdBy}`);
  } catch (error) {
    console.log("❌ FAIL: Manager should be able to create HR employees");
  }

  // CAN update IT employee
  try {
    const employees = await axios.get(`${BASE_URL}/it-employees`, {
      headers: { Authorization: `Bearer ${managerToken}` },
    });
    if (employees.data.data.length > 0) {
      const empId = employees.data.data[0].employeeId;
      const response = await axios.put(
        `${BASE_URL}/it-employees/${empId}`,
        { position: "Updated by Manager" },
        {
          headers: { Authorization: `Bearer ${managerToken}` },
        }
      );
      console.log("✅ PASS: Manager CAN update IT employees");
      console.log(`   Updated by: ${response.data.updatedBy}`);
    }
  } catch (error) {
    console.log("❌ FAIL: Manager should be able to update IT employees");
  }

  // Cannot delete IT employee
  try {
    const employees = await axios.get(`${BASE_URL}/it-employees`, {
      headers: { Authorization: `Bearer ${managerToken}` },
    });
    if (employees.data.data.length > 0) {
      const empId = employees.data.data[0].employeeId;
      await axios.delete(`${BASE_URL}/it-employees/${empId}`, {
        headers: { Authorization: `Bearer ${managerToken}` },
      });
      console.log("❌ FAIL: Manager should NOT delete IT employees");
    }
  } catch (error) {
    console.log("✅ PASS: Manager CANNOT delete IT employees (Admin only)");
    console.log(`   Message: ${error.response?.data?.message}`);
  }
}

// Test with admin token (full privilege)
async function testWithAdminToken() {
  console.log("\n👑 TEST 4: ADMIN Role Access (Full Privilege)");
  console.log("=".repeat(60));

  // CAN create department
  try {
    const response = await axios.post(
      `${BASE_URL}/departments`,
      {
        departmentId: "ADMIN" + Date.now(),
        departmentName: "Admin Created Department",
        description: "Created by admin for testing",
        location: "HQ Building",
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    console.log("✅ PASS: Admin CAN create departments");
    console.log(`   Created: ${response.data.data.departmentName}`);
    console.log(`   Created by: ${response.data.createdBy}`);
  } catch (error) {
    console.log("❌ FAIL: Admin should be able to create departments");
    console.log(`   Error: ${error.response?.data?.message}`);
  }

  // CAN create IT employee
  try {
    const response = await axios.post(
      `${BASE_URL}/it-employees`,
      {
        employeeId: "ADMIN" + Date.now(),
        firstName: "Admin",
        lastName: "Created",
        email: `admin.test${Date.now()}@company.com`,
        position: "Senior Developer",
        skills: ["Node.js", "React", "MongoDB"],
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    console.log("✅ PASS: Admin CAN create IT employees");
    console.log(
      `   Created: ${response.data.data.firstName} ${response.data.data.lastName}`
    );
    console.log(`   Created by: ${response.data.createdBy}`);
  } catch (error) {
    console.log("❌ FAIL: Admin should be able to create IT employees");
  }

  // CAN update department
  try {
    const departments = await axios.get(`${BASE_URL}/departments`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (departments.data.data.length > 0) {
      const deptId = departments.data.data[0].departmentId;
      const response = await axios.put(
        `${BASE_URL}/departments/${deptId}`,
        { description: "Updated by admin" },
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      console.log("✅ PASS: Admin CAN update departments");
      console.log(`   Updated by: ${response.data.updatedBy}`);
    }
  } catch (error) {
    console.log("❌ FAIL: Admin should be able to update departments");
  }

  // CAN delete IT employee
  try {
    const employees = await axios.get(`${BASE_URL}/it-employees`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminCreated = employees.data.data.filter((e) =>
      e.employeeId.startsWith("ADMIN")
    );
    if (adminCreated.length > 0) {
      const empId = adminCreated[0].employeeId;
      const response = await axios.delete(`${BASE_URL}/it-employees/${empId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      console.log("✅ PASS: Admin CAN delete IT employees");
      console.log(
        `   Deleted: ${response.data.data.firstName} ${response.data.data.lastName}`
      );
      console.log(`   Deleted by: ${response.data.deletedBy}`);
    }
  } catch (error) {
    console.log("❌ FAIL: Admin should be able to delete IT employees");
  }
}

// Main test function
async function main() {
  console.log("\n🔐 ROLE-BASED ACCESS CONTROL TEST");
  console.log("=".repeat(60));
  console.log("Testing middleware authentication and authorization...\n");

  // Login all users
  console.log("📝 Logging in test users...");
  adminToken = await login(users.admin.email, users.admin.password);
  managerToken = await login(users.manager.email, users.manager.password);
  employeeToken = await login(users.employee.email, users.employee.password);

  if (!adminToken || !managerToken || !employeeToken) {
    console.error("❌ Failed to login test users. Make sure they exist.");
    return;
  }

  console.log("✅ All users logged in successfully!\n");

  // Run tests
  await testWithoutAuth();
  await testWithEmployeeToken();
  await testWithManagerToken();
  await testWithAdminToken();

  // Summary
  console.log("\n\n📊 SUMMARY: Role-Based Access Control");
  console.log("=".repeat(60));
  console.log("\n✅ EMPLOYEE Role:");
  console.log("   ✓ Can VIEW departments, employees");
  console.log("   ✗ Cannot CREATE/UPDATE/DELETE anything");

  console.log("\n✅ MANAGER Role:");
  console.log("   ✓ Can VIEW departments, employees");
  console.log("   ✓ Can CREATE/UPDATE IT and HR employees");
  console.log("   ✗ Cannot CREATE/UPDATE/DELETE departments");
  console.log("   ✗ Cannot DELETE IT and HR employees");

  console.log("\n✅ ADMIN Role (Full Access):");
  console.log("   ✓ Can VIEW everything");
  console.log("   ✓ Can CREATE/UPDATE/DELETE departments");
  console.log("   ✓ Can CREATE/UPDATE/DELETE IT employees");
  console.log("   ✓ Can CREATE/UPDATE/DELETE HR employees");

  console.log("\n🎉 All middleware tests completed!\n");
}

// Run the tests
main().catch(console.error);

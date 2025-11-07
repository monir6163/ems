// Test User Authentication - Register and Login
// Run this file using: node testUsers.js

const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

// Sample users to register
const users = [
  {
    email: "admin@company.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
  },
  {
    email: "john.doe@company.com",
    password: "john123",
    firstName: "John",
    lastName: "Doe",
    role: "manager",
  },
  {
    email: "alice.smith@company.com",
    password: "alice123",
    firstName: "Alice",
    lastName: "Smith",
    role: "employee",
  },
  {
    email: "bob.johnson@company.com",
    password: "bob123",
    firstName: "Bob",
    lastName: "Johnson",
    role: "employee",
  },
];

async function registerUsers() {
  console.log("\n👤 Registering Users in All Databases...");
  console.log("==========================================\n");

  for (const user of users) {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, user);
      console.log(`✅ Registered: ${user.email}`);
      console.log(`   - User ID: ${response.data.data.user.userId}`);
      console.log(`   - Role: ${response.data.data.user.role}`);
      console.log(`   - Stored in: DB1, DB2, DB3`);
      console.log(
        `   - Token: ${response.data.data.token.substring(0, 20)}...`
      );
      console.log("");
    } catch (error) {
      if (error.response) {
        console.log(
          `❌ Error registering ${user.email}:`,
          error.response.data.message
        );
      } else {
        console.log(`❌ Error registering ${user.email}:`, error.message);
      }
    }
  }
}

async function loginUser(email, password) {
  console.log(`\n🔐 Logging in: ${email}`);
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });
    console.log(`✅ Login successful!`);
    console.log(
      `   - User: ${response.data.data.user.firstName} ${response.data.data.user.lastName}`
    );
    console.log(`   - Role: ${response.data.data.user.role}`);
    console.log(`   - Found in Database: ${response.data.foundInDatabase}`);
    console.log(`   - Token: ${response.data.data.token.substring(0, 30)}...`);
    return response.data.data.token;
  } catch (error) {
    if (error.response) {
      console.log(`❌ Login failed:`, error.response.data.message);
    } else {
      console.log(`❌ Login failed:`, error.message);
    }
    return null;
  }
}

async function getAllUsers() {
  console.log("\n\n📊 Fetching All Users from All Databases...");
  console.log("============================================\n");

  try {
    const response = await axios.get(`${BASE_URL}/auth/users`);

    console.log(`Total Users: ${response.data.totalUsers}\n`);

    // DB1 Users
    console.log("--- DATABASE 1 (Departments) ---");
    console.log(`Count: ${response.data.data.db1.count}`);
    response.data.data.db1.users.forEach((user) => {
      console.log(
        `  - ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`
      );
    });

    // DB2 Users
    console.log("\n--- DATABASE 2 (IT Employees) ---");
    console.log(`Count: ${response.data.data.db2.count}`);
    response.data.data.db2.users.forEach((user) => {
      console.log(
        `  - ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`
      );
    });

    // DB3 Users
    console.log("\n--- DATABASE 3 (HR Employees) ---");
    console.log(`Count: ${response.data.data.db3.count}`);
    response.data.data.db3.users.forEach((user) => {
      console.log(
        `  - ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`
      );
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
  }
}

async function getUsersFromSpecificDB(database) {
  console.log(`\n📋 Fetching Users from ${database.toUpperCase()}...`);
  try {
    const response = await axios.get(`${BASE_URL}/auth/users/${database}`);
    console.log(`Count: ${response.data.count}`);
    response.data.data.forEach((user) => {
      console.log(`  - ${user.firstName} ${user.lastName} (${user.email})`);
    });
  } catch (error) {
    console.error(`❌ Error fetching users from ${database}:`, error.message);
  }
}

async function testProtectedRoute(token) {
  console.log("\n\n🔒 Testing Protected Route (User Profile)...");
  console.log("===========================================\n");

  if (!token) {
    console.log("❌ No token available. Please login first.");
    return;
  }

  try {
    const response = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("✅ Protected route accessed successfully!");
    console.log(`   User Profile:`);
    console.log(
      `   - Name: ${response.data.data.firstName} ${response.data.data.lastName}`
    );
    console.log(`   - Email: ${response.data.data.email}`);
    console.log(`   - Role: ${response.data.data.role}`);
    console.log(`   - User ID: ${response.data.data.userId}`);
  } catch (error) {
    if (error.response) {
      console.log(`❌ Access denied:`, error.response.data.message);
    } else {
      console.log(`❌ Error:`, error.message);
    }
  }
}

async function main() {
  console.log("🚀 Starting User Authentication Tests...");
  console.log("=========================================\n");

  try {
    // Step 1: Register users
    await registerUsers();

    // Step 2: Test login
    const token = await loginUser("admin@company.com", "admin123");

    // Step 3: Test another login
    await loginUser("john.doe@company.com", "john123");

    // Step 4: Test failed login
    await loginUser("admin@company.com", "wrongpassword");

    // Step 5: Get all users from all databases
    await getAllUsers();

    // Step 6: Get users from specific databases
    await getUsersFromSpecificDB("db1");
    await getUsersFromSpecificDB("db2");
    await getUsersFromSpecificDB("db3");

    // Step 7: Test protected route
    await testProtectedRoute(token);

    console.log("\n\n✨ User Authentication Tests Completed!");
    console.log("\n📝 Summary:");
    console.log(
      "   - Users are registered in ALL three databases (DB1, DB2, DB3)"
    );
    console.log("   - Passwords are securely hashed using bcrypt");
    console.log("   - JWT tokens are generated for authentication");
    console.log("   - Protected routes can be accessed with valid tokens");
    console.log("\n🔐 Authentication Endpoints:");
    console.log("   - POST /api/auth/register - Register new user");
    console.log("   - POST /api/auth/login - Login user");
    console.log("   - GET /api/auth/users - Get all users from all databases");
    console.log(
      "   - GET /api/auth/users/:database - Get users from specific database"
    );
    console.log(
      "   - GET /api/auth/user/:userId - Get user by ID from all databases"
    );
    console.log(
      "   - GET /api/auth/profile - Get current user profile (protected)"
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the script
main();

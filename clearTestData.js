// Clear all attendance and payroll data
// Run this before running test scripts: node clearTestData.js

const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function clearAttendance() {
  console.log("\n🗑️  Clearing Attendance Data...");
  try {
    // You'll need to add a delete all endpoint or do it manually in MongoDB
    console.log("⚠️  Please clear attendance data manually from MongoDB:");
    console.log("   use db5");
    console.log("   db.attendances.deleteMany({})");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function clearPayroll() {
  console.log("\n🗑️  Clearing Payroll Data...");
  try {
    console.log("⚠️  Please clear payroll data manually from MongoDB:");
    console.log("   use db6");
    console.log("   db.payrolls.deleteMany({})");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function main() {
  console.log("🧹 Clear Test Data");
  console.log("==================\n");

  await clearAttendance();
  await clearPayroll();

  console.log("\n✅ Instructions provided above");
  console.log("\nOr connect to MongoDB and run:");
  console.log("  mongo");
  console.log("  use db5");
  console.log("  db.attendances.deleteMany({})");
  console.log("  use db6");
  console.log("  db.payrolls.deleteMany({})");
}

main();

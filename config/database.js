const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_BASE_URL = process.env.MONGODB_BASE_URL;

// Database 1: Departments
const db1 = mongoose.createConnection(
  `${MONGODB_BASE_URL}db1?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

db1.on("connected", () => {
  console.log("✅ DB1 (Departments) connected successfully");
});

db1.on("error", (err) => {
  console.error("❌ DB1 connection error:", err);
});

// Database 2: IT Department Employees
const db2 = mongoose.createConnection(
  `${MONGODB_BASE_URL}db2?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

db2.on("connected", () => {
  console.log("✅ DB2 (IT Employees) connected successfully");
});

db2.on("error", (err) => {
  console.error("❌ DB2 connection error:", err);
});

// Database 3: HR Department Employees
const db3 = mongoose.createConnection(
  `${MONGODB_BASE_URL}db3?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

db3.on("connected", () => {
  console.log("✅ DB3 (HR Employees) connected successfully");
});

db3.on("error", (err) => {
  console.error("❌ DB3 connection error:", err);
});

// Database 4: Finance Department Employees
const db4 = mongoose.createConnection(
  `${MONGODB_BASE_URL}db4?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
db4.on("connected", () => {
  console.log("✅ DB4 (Finance Employees) connected successfully");
});
db4.on("error", (err) => {
  console.error("❌ DB4 connection error:", err);
});

// Database 5: Attendance
const db5 = mongoose.createConnection(
  `${MONGODB_BASE_URL}db5?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
db5.on("connected", () => {
  console.log("✅ DB5 (Attendance) connected successfully");
});
db5.on("error", (err) => {
  console.error("❌ DB5 connection error:", err);
});

// Database 6: Payroll
const db6 = mongoose.createConnection(
  `${MONGODB_BASE_URL}db6?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
db6.on("connected", () => {
  console.log("✅ DB6 (Payroll) connected successfully");
});
db6.on("error", (err) => {
  console.error("❌ DB6 connection error:", err);
});

module.exports = { db1, db2, db3, db4, db5, db6 };

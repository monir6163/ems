const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Import database connections
const { db1, db2, db3, db4 } = require("./config/database");

// Import routes
const departmentRoutes = require("./routes/departments");
const itEmployeeRoutes = require("./routes/itEmployees");
const hrEmployeeRoutes = require("./routes/hrEmployees");
const financeEmployeeRoutes = require("./routes/financeEmployees");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Employee Management System API",
    version: "1.0.0",
    databases: {
      db1: "Departments Database",
      db2: "IT Employees Database",
      db3: "HR Employees Database",
      db4: "Finance Employees Database",
    },
    endpoints: {
      auth: "/api/auth",
      departments: "/api/departments",
      itEmployees: "/api/it-employees",
      hrEmployees: "/api/hr-employees",
      financeEmployees: "/api/finance-employees",
    },
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/it-employees", itEmployeeRoutes);
app.use("/api/hr-employees", hrEmployeeRoutes);
app.use("/api/finance-employees", financeEmployeeRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  const dbStatus = {
    db1: db1.readyState === 1 ? "Connected" : "Disconnected",
    db2: db2.readyState === 1 ? "Connected" : "Disconnected",
    db3: db3.readyState === 1 ? "Connected" : "Disconnected",
    db4: db4.readyState === 1 ? "Connected" : "Disconnected",
  };

  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    databases: dbStatus,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   - Authentication: http://localhost:${PORT}/api/auth`);
  console.log(`   - Departments: http://localhost:${PORT}/api/departments`);
  console.log(`   - IT Employees: http://localhost:${PORT}/api/it-employees`);
  console.log(`   - HR Employees: http://localhost:${PORT}/api/hr-employees`);
  console.log(`   - Finance Employees: http://localhost:${PORT}/api/finance-employees`);
  console.log(`   - Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;

const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required. Please login first.",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token. Please login again.",
      });
    }
    req.user = user; // Attach user info to request
    next();
  });
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required.",
      yourRole: req.user.role,
    });
  }

  next();
};

// Middleware to check if user is admin or manager
const isAdminOrManager = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin" && req.user.role !== "manager") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin or Manager role required.",
      yourRole: req.user.role,
    });
  }

  next();
};

// Middleware to check if user is authenticated (any role)
const isAuthenticated = authenticateToken;

module.exports = {
  authenticateToken,
  isAdmin,
  isAdminOrManager,
  isAuthenticated,
};

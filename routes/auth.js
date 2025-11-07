const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { db1, db2, db3 } = require("../config/database");
const userSchema = require("../models/User");

// Create User models for all three databases
const UserDB1 = db1.model("User", userSchema);
const UserDB2 = db2.model("User", userSchema);
const UserDB3 = db3.model("User", userSchema);

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET;

// Generate User ID
function generateUserId() {
  return "USER" + Date.now() + Math.floor(Math.random() * 1000);
}

// Register new user - Creates user in ALL three databases
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, password, firstName, and lastName",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists in any database
    const existingUserDB1 = await UserDB1.findOne({ email });
    const existingUserDB2 = await UserDB2.findOne({ email });
    const existingUserDB3 = await UserDB3.findOne({ email });

    if (existingUserDB1 || existingUserDB2 || existingUserDB3) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const userId = generateUserId();

    // Prepare user data
    const userData = {
      userId,
      email,
      password,
      firstName,
      lastName,
      role: role || "employee",
    };

    // Create user in all three databases
    const userDB1 = new UserDB1(userData);
    const userDB2 = new UserDB2(userData);
    const userDB3 = new UserDB3(userData);

    // Save to all databases
    await Promise.all([userDB1.save(), userDB2.save(), userDB3.save()]);

    // Generate JWT token
    const token = jwt.sign(
      { userId: userDB1.userId, email: userDB1.email, role: userDB1.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully in all databases",
      databases: {
        db1: "User created in Departments database",
        db2: "User created in IT Employees database",
        db3: "User created in HR Employees database",
      },
      data: {
        user: userDB1.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
});

// Login user - Checks all databases
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user in any of the databases (they should be synced)
    let user = await UserDB1.findOne({ email });
    let foundInDB = "db1";

    if (!user) {
      user = await UserDB2.findOne({ email });
      foundInDB = "db2";
    }

    if (!user) {
      user = await UserDB3.findOne({ email });
      foundInDB = "db3";
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      foundInDatabase: foundInDB,
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
});

// Get all users from a specific database
router.get("/users/:database", async (req, res) => {
  try {
    const { database } = req.params;
    let users;

    switch (database) {
      case "db1":
        users = await UserDB1.find();
        break;
      case "db2":
        users = await UserDB2.find();
        break;
      case "db3":
        users = await UserDB3.find();
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid database. Use db1, db2, or db3",
        });
    }

    res.json({
      success: true,
      database,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
});

// Get all users from all databases
router.get("/users", async (req, res) => {
  try {
    const [usersDB1, usersDB2, usersDB3] = await Promise.all([
      UserDB1.find(),
      UserDB2.find(),
      UserDB3.find(),
    ]);

    res.json({
      success: true,
      data: {
        db1: {
          database: "Departments Database",
          count: usersDB1.length,
          users: usersDB1,
        },
        db2: {
          database: "IT Employees Database",
          count: usersDB2.length,
          users: usersDB2,
        },
        db3: {
          database: "HR Employees Database",
          count: usersDB3.length,
          users: usersDB3,
        },
      },
      totalUsers: usersDB1.length, // Assuming all DBs are synced
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users from all databases",
      error: error.message,
    });
  }
});

// Get user by ID from all databases
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [userDB1, userDB2, userDB3] = await Promise.all([
      UserDB1.findOne({ userId }),
      UserDB2.findOne({ userId }),
      UserDB3.findOne({ userId }),
    ]);

    if (!userDB1 && !userDB2 && !userDB3) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        db1: userDB1 ? userDB1.toJSON() : null,
        db2: userDB2 ? userDB2.toJSON() : null,
        db3: userDB3 ? userDB3.toJSON() : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    req.user = user;
    next();
  });
};

// Protected route example
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await UserDB1.findOne({ userId: req.user.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
});

module.exports = router;

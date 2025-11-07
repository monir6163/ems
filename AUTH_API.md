# 🔐 User Authentication API Documentation

## Overview

The Employee Management System now includes user authentication with email and password. Users are stored in **ALL THREE databases** (DB1, DB2, DB3) simultaneously for complete data fragmentation.

## Authentication Features

✅ **User Registration** - Creates user accounts in all three databases  
✅ **Secure Login** - JWT-based authentication  
✅ **Password Hashing** - bcrypt encryption for security  
✅ **Role-Based Access** - Admin, Manager, Employee roles  
✅ **Protected Routes** - Token-based authorization  
✅ **Multi-Database Sync** - Users stored in DB1, DB2, and DB3

## API Endpoints

### 1. Register New User

**POST** `/api/auth/register`

Creates a new user account in ALL three databases (DB1, DB2, DB3).

**Request Body:**

```json
{
  "email": "user@company.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "employee"
}
```

**Fields:**

- `email` (required): Valid email address
- `password` (required): Minimum 6 characters
- `firstName` (required): User's first name
- `lastName` (required): User's last name
- `role` (optional): "admin", "manager", or "employee" (default: "employee")

**Response (Success - 201):**

```json
{
  "success": true,
  "message": "User registered successfully in all databases",
  "databases": {
    "db1": "User created in Departments database",
    "db2": "User created in IT Employees database",
    "db3": "User created in HR Employees database"
  },
  "data": {
    "user": {
      "userId": "USER1699380000123",
      "email": "user@company.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "employee",
      "isActive": true,
      "createdAt": "2025-11-07T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@company.com",
    "password": "john123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "manager"
  }'
```

---

### 2. Login User

**POST** `/api/auth/login`

Authenticates user and returns JWT token.

**Request Body:**

```json
{
  "email": "user@company.com",
  "password": "password123"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Login successful",
  "foundInDatabase": "db1",
  "data": {
    "user": {
      "userId": "USER1699380000123",
      "email": "user@company.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "employee",
      "lastLogin": "2025-11-07T10:15:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@company.com",
    "password": "john123"
  }'
```

---

### 3. Get All Users (All Databases)

**GET** `/api/auth/users`

Retrieves all users from all three databases.

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "db1": {
      "database": "Departments Database",
      "count": 4,
      "users": [...]
    },
    "db2": {
      "database": "IT Employees Database",
      "count": 4,
      "users": [...]
    },
    "db3": {
      "database": "HR Employees Database",
      "count": 4,
      "users": [...]
    }
  },
  "totalUsers": 4
}
```

**cURL Example:**

```bash
curl http://localhost:5000/api/auth/users
```

---

### 4. Get Users from Specific Database

**GET** `/api/auth/users/:database`

Retrieves users from a specific database (db1, db2, or db3).

**Parameters:**

- `database`: "db1", "db2", or "db3"

**Response (Success - 200):**

```json
{
  "success": true,
  "database": "db1",
  "count": 4,
  "data": [
    {
      "userId": "USER1699380000123",
      "email": "user@company.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "employee"
    }
  ]
}
```

**cURL Examples:**

```bash
# Get users from DB1 (Departments)
curl http://localhost:5000/api/auth/users/db1

# Get users from DB2 (IT Employees)
curl http://localhost:5000/api/auth/users/db2

# Get users from DB3 (HR Employees)
curl http://localhost:5000/api/auth/users/db3
```

---

### 5. Get User by ID

**GET** `/api/auth/user/:userId`

Retrieves a specific user from all three databases.

**Parameters:**

- `userId`: User's unique ID

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "db1": {
      "userId": "USER1699380000123",
      "email": "user@company.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "db2": {
      "userId": "USER1699380000123",
      "email": "user@company.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "db3": {
      "userId": "USER1699380000123",
      "email": "user@company.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

**cURL Example:**

```bash
curl http://localhost:5000/api/auth/user/USER1699380000123
```

---

### 6. Get User Profile (Protected)

**GET** `/api/auth/profile`

Retrieves the authenticated user's profile. Requires JWT token.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "userId": "USER1699380000123",
    "email": "user@company.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "employee",
    "isActive": true,
    "createdAt": "2025-11-07T10:00:00.000Z"
  }
}
```

**cURL Example:**

```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Database Storage

### User Data is Stored in ALL Three Databases:

**DB1 (Departments Database)**

- Collection: `users`
- Purpose: User authentication for department management

**DB2 (IT Employees Database)**

- Collection: `users`
- Purpose: User authentication for IT employee management

**DB3 (HR Employees Database)**

- Collection: `users`
- Purpose: User authentication for HR employee management

---

## Security Features

### Password Hashing

- **Algorithm**: bcrypt
- **Salt Rounds**: 10
- **Storage**: Only hashed passwords are stored, never plain text

### JWT Tokens

- **Algorithm**: HS256
- **Expiration**: 7 days
- **Payload**: userId, email, role

### Authentication Flow

1. User registers → Password hashed → Stored in DB1, DB2, DB3
2. User logs in → Password compared → JWT token issued
3. Protected routes → Token verified → Access granted

---

## User Roles

| Role         | Description                        |
| ------------ | ---------------------------------- |
| **admin**    | Full system access                 |
| **manager**  | Department and employee management |
| **employee** | Basic access                       |

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Please provide email, password, firstName, and lastName"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Testing with Postman

### Step 1: Register a User

1. Method: **POST**
2. URL: `http://localhost:5000/api/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):

```json
{
  "email": "test@company.com",
  "password": "test123",
  "firstName": "Test",
  "lastName": "User",
  "role": "employee"
}
```

### Step 2: Login

1. Method: **POST**
2. URL: `http://localhost:5000/api/auth/login`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):

```json
{
  "email": "test@company.com",
  "password": "test123"
}
```

5. **Copy the token from response**

### Step 3: Access Protected Route

1. Method: **GET**
2. URL: `http://localhost:5000/api/auth/profile`
3. Headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer <paste-token-here>`

---

## Quick Test Script

Run the test script to create sample users:

```bash
node testUsers.js
```

This will:

- Register 4 sample users (admin, managers, employees)
- Test login functionality
- Retrieve users from all databases
- Test protected routes

---

## Database Verification

Check MongoDB Atlas to verify users are created in all three databases:

1. Go to https://cloud.mongodb.com/
2. Navigate to your cluster
3. Browse Collections:
   - **db1** → users collection
   - **db2** → users collection
   - **db3** → users collection
4. All three should contain identical user records

---

## Important Notes

⚠️ **Security Reminders:**

- Change `JWT_SECRET` in `.env` for production
- Use HTTPS in production
- Implement rate limiting for login attempts
- Add refresh token mechanism for better security

✅ **Data Consistency:**

- Users are created in all three databases simultaneously
- If one database fails, the entire operation rolls back
- All databases stay in sync

---

## Complete API Endpoint Summary

| Method | Endpoint                    | Description                  | Auth Required |
| ------ | --------------------------- | ---------------------------- | ------------- |
| POST   | `/api/auth/register`        | Register new user in all DBs | No            |
| POST   | `/api/auth/login`           | Login and get JWT token      | No            |
| GET    | `/api/auth/users`           | Get all users from all DBs   | No            |
| GET    | `/api/auth/users/:database` | Get users from specific DB   | No            |
| GET    | `/api/auth/user/:userId`    | Get user by ID from all DBs  | No            |
| GET    | `/api/auth/profile`         | Get current user profile     | Yes           |

---

**Ready to use!** Your Employee Management System now has complete user authentication across all three databases! 🎉

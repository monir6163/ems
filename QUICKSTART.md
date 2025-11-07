# 🚀 Quick Start Guide - Employee Management System

## ✅ Project Successfully Created!

Your Employee Management System with Database Fragmentation is ready to use!

## 📁 Project Structure

```
f:\ems\
├── config/
│   └── database.js          # Three MongoDB connections (db1, db2, db3)
├── models/
│   ├── Department.js        # Department schema
│   ├── ITEmployee.js        # IT Employee schema
│   └── HREmployee.js        # HR Employee schema
├── routes/
│   ├── departments.js       # Department API routes
│   ├── itEmployees.js       # IT Employee API routes
│   └── hrEmployees.js       # HR Employee API routes
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── dashboard.html          # Visual dashboard (open in browser)
├── package.json            # Project dependencies
├── README.md               # Full documentation
├── server.js               # Main server file
└── testData.js             # Sample data creation script
```

## 🎯 Database Architecture

- **DB1 (db1)**: Stores Department data only
- **DB2 (db2)**: Stores IT Department employees only
- **DB3 (db3)**: Stores HR Department employees only

Each database is completely separate for true fragmentation!

## 🚀 How to Run

### 1. Start the Server

```bash
npm start
# or for development with auto-restart
npm run dev
```

### 2. Test with Sample Data

```bash
node testData.js
```

### 3. View Dashboard

Open `dashboard.html` in your browser or visit:

- http://localhost:5000 - API info
- http://localhost:5000/health - System health check

## 📡 API Endpoints

### Departments (DB1)

- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get specific department
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### IT Employees (DB2)

- `GET /api/it-employees` - Get all IT employees
- `GET /api/it-employees/:id` - Get specific IT employee
- `POST /api/it-employees` - Create IT employee
- `PUT /api/it-employees/:id` - Update IT employee
- `DELETE /api/it-employees/:id` - Delete IT employee
- `GET /api/it-employees/search/skills?skill=JavaScript` - Search by skill

### HR Employees (DB3)

- `GET /api/hr-employees` - Get all HR employees
- `GET /api/hr-employees/:id` - Get specific HR employee
- `POST /api/hr-employees` - Create HR employee
- `PUT /api/hr-employees/:id` - Update HR employee
- `DELETE /api/hr-employees/:id` - Delete HR employee
- `GET /api/hr-employees/search/specialization?spec=Recruitment` - Search by specialization

## 🧪 Quick Test Commands

### Using cURL (Windows Git Bash):

**Create a Department:**

```bash
curl -X POST http://localhost:5000/api/departments \
  -H "Content-Type: application/json" \
  -d '{
    "departmentId": "DEPT001",
    "departmentName": "Information Technology",
    "description": "IT Department",
    "location": "Building A"
  }'
```

**Get All Departments:**

```bash
curl http://localhost:5000/api/departments
```

**Create IT Employee:**

```bash
curl -X POST http://localhost:5000/api/it-employees \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "IT001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "position": "Developer",
    "skills": ["JavaScript", "Node.js"]
  }'
```

### Using PowerShell:

**Get All IT Employees:**

```powershell
Invoke-RestMethod -Uri http://localhost:5000/api/it-employees -Method Get
```

## 🔍 Verify Installation

Run these commands to verify everything is working:

```bash
# Check if server is running
curl http://localhost:5000/health

# Populate with sample data
node testData.js

# Check departments
curl http://localhost:5000/api/departments

# Check IT employees
curl http://localhost:5000/api/it-employees

# Check HR employees
curl http://localhost:5000/api/hr-employees
```

## 📊 MongoDB Atlas

Your databases will be created automatically:

- Database: `db1` (Departments)
- Database: `db2` (IT Employees)
- Database: `db3` (HR Employees)

You can view them in MongoDB Atlas dashboard at:
https://cloud.mongodb.com/

## 💡 Next Steps

1. **Populate with sample data:** Run `node testData.js`
2. **Test the API:** Use Postman, cURL, or the browser
3. **View dashboard:** Open `dashboard.html` in your browser
4. **Customize:** Modify models and routes as needed

## 🆘 Troubleshooting

**Server not starting?**

- Make sure port 5000 is not in use
- Check .env file has correct MongoDB URL

**Database connection errors?**

- Verify MongoDB Atlas credentials
- Check network connectivity
- Ensure IP is whitelisted in MongoDB Atlas

**Module errors?**

- Run `npm install` again
- Delete `node_modules` and run `npm install`

## 🎉 You're All Set!

Your Employee Management System is ready to use with proper database fragmentation!

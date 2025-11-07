# Employee Management System with Database Fragmentation

A Node.js-based Employee Management System that implements database fragmentation across three separate MongoDB databases for efficient data organization and management.

## 🗄️ Database Architecture

The system uses **database fragmentation** to separate data logically:

- **DB1 (Departments)**: Stores all department information
- **DB2 (IT Employees)**: Stores IT department employee data
- **DB3 (HR Employees)**: Stores HR department employee data

## 🚀 Features

- **Department Management** (DB1)

  - Create, Read, Update, Delete departments
  - Track department details, managers, and locations

- **IT Employee Management** (DB2)

  - Manage IT department employees
  - Track skills, projects, and positions
  - Search employees by skills

- **HR Employee Management** (DB3)
  - Manage HR department employees
  - Track specializations and certifications
  - Search employees by specialization

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or MongoDB instance
- npm or yarn package manager

## 🛠️ Installation

1. **Clone or navigate to the project directory:**

   ```bash
   cd f:\ems
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   The `.env` file is already created with the MongoDB connection string.

4. **Start the server:**

   ```bash
   npm start
   ```

   For development with auto-restart:

   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Base URL

```
http://localhost:5000
```

### Departments API (DB1)

| Method | Endpoint               | Description           |
| ------ | ---------------------- | --------------------- |
| GET    | `/api/departments`     | Get all departments   |
| GET    | `/api/departments/:id` | Get department by ID  |
| POST   | `/api/departments`     | Create new department |
| PUT    | `/api/departments/:id` | Update department     |
| DELETE | `/api/departments/:id` | Delete department     |

**Sample Department Request Body:**

```json
{
  "departmentId": "DEPT001",
  "departmentName": "Information Technology",
  "description": "IT Department handling all technical operations",
  "managerId": "MGR001",
  "location": "Building A, Floor 3"
}
```

### IT Employees API (DB2)

| Method | Endpoint                                        | Description            |
| ------ | ----------------------------------------------- | ---------------------- |
| GET    | `/api/it-employees`                             | Get all IT employees   |
| GET    | `/api/it-employees/:id`                         | Get IT employee by ID  |
| POST   | `/api/it-employees`                             | Create new IT employee |
| PUT    | `/api/it-employees/:id`                         | Update IT employee     |
| DELETE | `/api/it-employees/:id`                         | Delete IT employee     |
| GET    | `/api/it-employees/search/skills?skill=<skill>` | Search by skills       |

**Sample IT Employee Request Body:**

```json
{
  "employeeId": "IT001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "phone": "+1234567890",
  "position": "Senior Developer",
  "salary": 85000,
  "skills": ["JavaScript", "Node.js", "MongoDB", "React"],
  "projectsAssigned": ["Project A", "Project B"]
}
```

### HR Employees API (DB3)

| Method | Endpoint                                              | Description              |
| ------ | ----------------------------------------------------- | ------------------------ |
| GET    | `/api/hr-employees`                                   | Get all HR employees     |
| GET    | `/api/hr-employees/:id`                               | Get HR employee by ID    |
| POST   | `/api/hr-employees`                                   | Create new HR employee   |
| PUT    | `/api/hr-employees/:id`                               | Update HR employee       |
| DELETE | `/api/hr-employees/:id`                               | Delete HR employee       |
| GET    | `/api/hr-employees/search/specialization?spec=<spec>` | Search by specialization |

**Sample HR Employee Request Body:**

```json
{
  "employeeId": "HR001",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@company.com",
  "phone": "+1234567891",
  "position": "HR Manager",
  "salary": 75000,
  "specialization": "Recruitment",
  "certifications": ["SHRM-CP", "PHR"]
}
```

### Health Check

| Method | Endpoint  | Description                      |
| ------ | --------- | -------------------------------- |
| GET    | `/health` | Check server and database status |

## 🧪 Testing the API

### Using cURL:

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

**Create an IT Employee:**

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

**Get All Departments:**

```bash
curl http://localhost:5000/api/departments
```

## 📁 Project Structure

```
f:\ems\
├── config/
│   └── database.js          # Database connections (db1, db2, db3)
├── models/
│   ├── Department.js        # Department schema
│   ├── ITEmployee.js        # IT Employee schema
│   └── HREmployee.js        # HR Employee schema
├── routes/
│   ├── departments.js       # Department routes
│   ├── itEmployees.js       # IT Employee routes
│   └── hrEmployees.js       # HR Employee routes
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies
└── server.js               # Main server file
```

## 🔒 Environment Variables

```env
PORT=5000
MONGODB_BASE_URL=mongodb+srv://<username>:<password>@cluster0.r1nyd.mongodb.net/
```

## 💡 Key Features Explained

### Database Fragmentation

- **Horizontal Fragmentation**: Data is split across multiple databases based on department type
- **Benefits**:
  - Better scalability
  - Improved query performance
  - Logical data separation
  - Independent database management

### Connection Management

Each database has its own mongoose connection:

- `db1`: Departments database
- `db2`: IT Employees database
- `db3`: HR Employees database

## 🐛 Troubleshooting

1. **Connection Issues:**

   - Verify MongoDB connection string in `.env`
   - Check network connectivity
   - Ensure MongoDB Atlas IP whitelist includes your IP

2. **Port Already in Use:**

   - Change the PORT in `.env` file
   - Or stop the process using port 5000

3. **Module Not Found:**
   - Run `npm install` to install dependencies

## 📝 License

ISC

## 👥 Contributing

Feel free to submit issues and enhancement requests!

---

**Note:** This system demonstrates database fragmentation concepts where different types of data are stored in separate databases for better organization and scalability.

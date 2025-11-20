# Attendance and Payroll API Documentation

## Overview

The Employee Management System now includes comprehensive attendance tracking and payroll management functionality with two new databases (db5 for Attendance and db6 for Payroll).

---

## Attendance System

### Base URL: `/api/attendance`

### Endpoints

#### 1. Check-In

**POST** `/api/attendance/check-in`

Mark employee check-in for the current day.

**Authentication Required:** Yes

**Request Body:**

```json
{
  "employeeId": "EMP001",
  "employeeName": "John Doe",
  "department": "IT",
  "location": "Office",
  "isRemote": false
}
```

**Response:**

```json
{
  "success": true,
  "message": "Check-in successful",
  "data": {
    "_id": "...",
    "employeeId": "EMP001",
    "employeeName": "John Doe",
    "department": "IT",
    "date": "2025-11-17T00:00:00.000Z",
    "checkIn": "2025-11-17T08:30:00.000Z",
    "status": "present",
    "location": "Office",
    "isRemote": false
  }
}
```

---

#### 2. Check-Out

**POST** `/api/attendance/check-out`

Mark employee check-out and automatically calculate work hours.

**Authentication Required:** Yes

**Request Body:**

```json
{
  "employeeId": "EMP001"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Check-out successful",
  "data": {
    "_id": "...",
    "employeeId": "EMP001",
    "checkIn": "2025-11-17T08:30:00.000Z",
    "checkOut": "2025-11-17T17:45:00.000Z",
    "workHours": 9.25,
    "overtime": 1.25,
    "status": "present"
  }
}
```

---

#### 3. Mark Attendance (Manual)

**POST** `/api/attendance/mark`

Manually mark attendance (admin/manager only).

**Authentication Required:** Yes (admin/manager roles)

**Request Body:**

```json
{
  "employeeId": "EMP001",
  "employeeName": "John Doe",
  "department": "IT",
  "date": "2025-11-15",
  "status": "on-leave",
  "leaveType": "sick",
  "notes": "Medical appointment"
}
```

---

#### 4. Get Employee Attendance

**GET** `/api/attendance/employee/:employeeId?startDate=2025-11-01&endDate=2025-11-30&page=1&limit=30`

Retrieve attendance records for a specific employee.

**Authentication Required:** Yes

**Query Parameters:**

- `startDate` (optional): Start date for filtering
- `endDate` (optional): End date for filtering
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 30)

**Response:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 22,
    "page": 1,
    "limit": 30,
    "pages": 1
  }
}
```

---

#### 5. Get Today's Attendance

**GET** `/api/attendance/today/:employeeId`

Get current day's attendance status for an employee.

**Authentication Required:** Yes

---

#### 6. Get Attendance Summary

**GET** `/api/attendance/summary/:employeeId?month=11&year=2025`

Get monthly attendance summary for an employee.

**Authentication Required:** Yes

**Response:**

```json
{
  "success": true,
  "data": {
    "month": 11,
    "year": 2025,
    "totalDays": 22,
    "present": 18,
    "absent": 2,
    "late": 1,
    "halfDay": 0,
    "onLeave": 1,
    "totalWorkHours": 162.5,
    "totalOvertime": 8.5,
    "averageWorkHours": "9.03"
  }
}
```

---

#### 7. Get Department Attendance Report

**GET** `/api/attendance/report/department/:department?startDate=2025-11-01&endDate=2025-11-30`

Get attendance report for an entire department (admin/manager only).

**Authentication Required:** Yes (admin/manager roles)

**Response:**

```json
{
  "success": true,
  "data": [...],
  "summary": {
    "totalRecords": 220,
    "present": 180,
    "absent": 15,
    "late": 10,
    "halfDay": 5,
    "onLeave": 10,
    "totalWorkHours": 1620,
    "totalOvertime": 85
  }
}
```

---

#### 8. Update Attendance

**PUT** `/api/attendance/:id`

Update attendance record (admin/manager only).

**Authentication Required:** Yes (admin/manager roles)

---

#### 9. Delete Attendance

**DELETE** `/api/attendance/:id`

Delete attendance record (admin only).

**Authentication Required:** Yes (admin role)

---

## Payroll System

### Base URL: `/api/payroll`

### Endpoints

#### 1. Generate Payroll

**POST** `/api/payroll/generate`

Generate monthly payroll for an employee with automatic attendance integration.

**Authentication Required:** Yes (admin/manager roles)

**Request Body:**

```json
{
  "employeeId": "EMP001",
  "employeeName": "John Doe",
  "department": "IT",
  "month": 11,
  "year": 2025,
  "baseSalary": 5000,
  "allowances": {
    "housing": 1000,
    "transport": 500,
    "medical": 300,
    "other": 200
  },
  "bonus": 500,
  "deductions": {
    "tax": 800,
    "insurance": 200,
    "providentFund": 250,
    "other": 0
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payroll generated successfully",
  "data": {
    "_id": "...",
    "employeeId": "EMP001",
    "employeeName": "John Doe",
    "department": "IT",
    "month": 11,
    "year": 2025,
    "baseSalary": 5000,
    "allowances": {...},
    "bonus": 500,
    "overtimePay": 125.50,
    "deductions": {...},
    "attendanceData": {
      "totalWorkingDays": 30,
      "daysPresent": 22,
      "daysAbsent": 2,
      "daysOnLeave": 1,
      "totalWorkHours": 176,
      "totalOvertime": 8.5
    },
    "grossSalary": 7625.50,
    "totalDeductions": 1250,
    "netSalary": 6375.50,
    "paymentStatus": "pending"
  }
}
```

---

#### 2. Get All Payrolls

**GET** `/api/payroll?page=1&limit=20&month=11&year=2025&department=IT`

Get all payroll records with filtering (admin/manager only).

**Authentication Required:** Yes (admin/manager roles)

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 20)
- `month` (optional): Filter by month
- `year` (optional): Filter by year
- `department` (optional): Filter by department

---

#### 3. Get Employee Payroll History

**GET** `/api/payroll/employee/:employeeId?page=1&limit=12`

Get payroll history for a specific employee.

**Authentication Required:** Yes

---

#### 4. Get Specific Payroll

**GET** `/api/payroll/:id`

Get detailed payroll information by ID.

**Authentication Required:** Yes

---

#### 5. Update Payroll

**PUT** `/api/payroll/:id`

Update payroll record (admin/manager only).

**Authentication Required:** Yes (admin/manager roles)

**Request Body:**

```json
{
  "bonus": 1000,
  "deductions": {
    "tax": 900
  },
  "notes": "Performance bonus added"
}
```

---

#### 6. Update Payment Status

**PATCH** `/api/payroll/:id/payment-status`

Update payment status for a payroll (admin/manager only).

**Authentication Required:** Yes (admin/manager roles)

**Request Body:**

```json
{
  "paymentStatus": "paid",
  "paymentMethod": "bank-transfer",
  "paymentDate": "2025-11-30"
}
```

**Payment Status Options:**

- `pending`
- `processing`
- `paid`
- `cancelled`

**Payment Method Options:**

- `bank-transfer`
- `cash`
- `cheque`
- `none`

---

#### 7. Get Department Payroll Report

**GET** `/api/payroll/report/department/:department?month=11&year=2025`

Get payroll summary for a department (admin/manager only).

**Authentication Required:** Yes (admin/manager roles)

**Response:**

```json
{
  "success": true,
  "data": {
    "department": "IT",
    "month": 11,
    "year": 2025,
    "totalEmployees": 10,
    "totalGrossSalary": 75000,
    "totalDeductions": 12500,
    "totalNetSalary": 62500,
    "totalBonus": 5000,
    "totalOvertimePay": 1250,
    "paymentStatus": {
      "pending": 2,
      "processing": 3,
      "paid": 5,
      "cancelled": 0
    }
  },
  "payrolls": [...]
}
```

---

#### 8. Get Overall Payroll Statistics

**GET** `/api/payroll/report/statistics?month=11&year=2025`

Get overall payroll statistics (admin only).

**Authentication Required:** Yes (admin role)

**Response:**

```json
{
  "success": true,
  "data": {
    "period": {
      "month": 11,
      "year": 2025
    },
    "totalEmployees": 50,
    "totalGrossSalary": 375000,
    "totalDeductions": 62500,
    "totalNetSalary": 312500,
    "averageGrossSalary": 7500,
    "averageNetSalary": 6250,
    "byDepartment": {
      "IT": {
        "employees": 10,
        "totalNetSalary": 62500
      },
      "HR": {
        "employees": 8,
        "totalNetSalary": 50000
      },
      "Finance": {
        "employees": 12,
        "totalNetSalary": 75000
      }
    },
    "paymentStatus": {
      "pending": 10,
      "processing": 15,
      "paid": 25,
      "cancelled": 0
    }
  }
}
```

---

#### 9. Delete Payroll

**DELETE** `/api/payroll/:id`

Delete payroll record (admin only).

**Authentication Required:** Yes (admin role)

---

## Attendance Status Options

- `present`: Full day attendance (≥8 hours)
- `absent`: No attendance
- `late`: Arrived late
- `half-day`: Partial attendance (4-8 hours)
- `on-leave`: Approved leave

## Leave Type Options

- `sick`: Sick leave
- `casual`: Casual leave
- `annual`: Annual/vacation leave
- `unpaid`: Unpaid leave
- `none`: Not on leave

---

## Features

### Attendance System

✅ Automatic check-in/check-out with timestamp
✅ Automatic work hours calculation
✅ Overtime tracking (hours beyond 8)
✅ Manual attendance marking for admins
✅ Leave management
✅ Remote work tracking
✅ Monthly and custom date range reports
✅ Department-wise reports
✅ Real-time attendance status

### Payroll System

✅ Automatic salary calculation based on attendance
✅ Multiple allowance types (housing, transport, medical, etc.)
✅ Bonus and overtime pay integration
✅ Tax and other deduction management
✅ Attendance-based salary adjustments
✅ Payment status tracking
✅ Department and overall statistics
✅ Monthly payroll generation
✅ Comprehensive reporting

---

## Database Structure

### Database 5 (Attendance)

- Collection: `attendances`
- Tracks daily employee attendance
- Stores check-in/check-out times
- Calculates work hours and overtime

### Database 6 (Payroll)

- Collection: `payrolls`
- Stores monthly payroll records
- Links to attendance data
- Manages salary calculations and payments

---

## Notes

- All dates are stored in UTC
- Work hours are calculated automatically on check-out
- Standard workday is 8 hours
- Overtime rate is 1.5x hourly rate
- Absent days automatically reduce net salary
- Payroll cannot be generated twice for the same employee/month/year combination
- All amounts are rounded to 2 decimal places

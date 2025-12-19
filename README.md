# Web and Android-Based Childhood Care Management System

A comprehensive child care management system for Ethiopian Electric Utility Southern Region (EEUSR) Child Care Center. This system provides web and mobile interfaces for managing children, attendance, evaluations, notifications, and generating reports.

## Features

- **User Management**: Support for multiple roles (Admin, Manager, Guardian, Family)
- **Child Management**: Register, update, and track children
- **Attendance Tracking**: Daily attendance with check-in/check-out
- **Child Evaluations**: Track developmental progress across different categories
- **Notifications**: Real-time notifications between staff and parents
- **Reports**: Weekly and monthly reports generation
- **Role-Based Access Control**: Secure access based on user roles
- **RESTful API**: Clean API design for web and Android clients

## Technology Stack

- **Backend**: Node.js with TypeScript
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Runtime**: Node.js

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Business logic controllers
├── middleware/      # Express middleware
├── models/          # MongoDB models
├── routes/          # API routes
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── index.ts         # Application entry point
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd eeusr-childcare-management
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eeusr_childcare
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=24h
SERVER_URL=http://localhost:3000
```

4. Start MongoDB (if running locally):
```bash
mongod
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Users
- `GET /api/users` - Get all users (Admin only)
- `POST /api/users/create` - Create new account (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/employees` - Get all employees (Admin only)

### Children
- `POST /api/children/register` - Register new child (Manager/Admin)
- `GET /api/children/all` - Get all children
- `GET /api/children/my-children` - Get my children
- `GET /api/children/:id` - Get child by ID
- `PUT /api/children/:id` - Update child (Manager/Admin)
- `PUT /api/children/:id/delete` - Deactivate child (Manager/Admin)

### Attendance
- `POST /api/attendance/mark` - Mark attendance (Manager/Guardian)
- `PUT /api/attendance/:id` - Update attendance (Manager/Guardian)
- `GET /api/attendance/child/:childId` - Get attendance by child
- `GET /api/attendance/daily` - Get daily attendance
- `GET /api/attendance` - Get all attendance records

### Notifications
- `POST /api/notifications/send` - Send notification
- `GET /api/notifications/my` - Get my notifications
- `GET /api/notifications/sent` - Get sent notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `GET /api/notifications/unread/count` - Get unread count
- `DELETE /api/notifications/:id` - Delete notification

### Evaluations
- `POST /api/evaluations/create` - Create evaluation (Manager/Guardian)
- `GET /api/evaluations/child/:childId` - Get evaluations by child
- `GET /api/evaluations/all` - Get all evaluations
- `GET /api/evaluations/:id` - Get evaluation by ID
- `PUT /api/evaluations/:id` - Update evaluation
- `DELETE /api/evaluations/:id` - Delete evaluation

### Reports
- `GET /api/reports/statistics` - Get system statistics
- `POST /api/reports/weekly` - Generate weekly report (Manager/Admin)
- `POST /api/reports/monthly` - Generate monthly report (Manager/Admin)
- `GET /api/reports/child/:childId` - Get reports by child
- `GET /api/reports` - Get all reports

## User Roles

1. **ADMIN**: Full system access, user management, account management
2. **MANAGER**: Child management, attendance control, evaluation, reports
3. **GUARDIAN**: Daily child care, attendance marking, evaluations
4. **FAMILY**: View their children, receive notifications, view reports

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Sample API Usage

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

### Register Child (with token)
```bash
curl -X POST http://localhost:3000/api/children/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "2020-01-15",
    "gender": "MALE",
    "registrationNumber": "REG001",
    "parentId": "parent-id-here",
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Mother",
      "phoneNumber": "+251911234567"
    }
  }'
```

## Database Models

- **User**: System users with roles and authentication
- **Child**: Child profiles with medical info and emergency contacts
- **Attendance**: Daily attendance records
- **Notification**: Messages between users
- **Evaluation**: Child development evaluations
- **Report**: Generated reports (weekly/monthly)

## Development

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

## Contributing

This is a senior project by Wolaita Sodo University CS students:
- Samrawit Sisay
- Hamelmal Mathewos
- Asfaw Tunta
- Zewdinnhe Mathewos
- Yohannes Sorsa

Advisor: Tekle Dargaso (MSc.)

## License

This project is developed for academic purposes.

## Support

For issues or questions, please contact the development team.


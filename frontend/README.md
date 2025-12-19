# EEUSR Childcare Management System - Frontend

A modern React dashboard built with TypeScript, Tailwind CSS, and the latest web technologies for managing the EEUSR Childcare Management System.

## Features

- 🎨 **Modern UI**: Built with Tailwind CSS for a beautiful, responsive design
- 🔐 **Authentication**: JWT-based authentication with protected routes
- 📊 **Dashboard**: Real-time statistics and quick actions
- 👥 **User Management**: Complete CRUD operations for users (Admin only)
- 👶 **Children Management**: Register, view, and manage children profiles
- 📅 **Attendance Tracking**: Mark and track daily attendance
- 🔔 **Notifications**: Send and receive notifications between users
- 📝 **Evaluations**: Track child development across multiple categories
- 📈 **Reports**: Generate weekly and monthly reports
- 🎯 **Role-Based Access**: Different views and permissions based on user roles

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query (TanStack Query)** - Data fetching and caching
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **date-fns** - Date formatting

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend API running on `http://localhost:3000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional, defaults are set):
```env
VITE_API_URL=http://localhost:3000/api
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Layout/        # Layout components (Sidebar, Header, etc.)
│   │   └── Modals/        # Modal components
│   ├── contexts/          # React contexts (Auth)
│   ├── pages/             # Page components
│   ├── services/          # API service layer
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main app component with routing
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind config
└── vite.config.ts         # Vite config
```

## User Roles

### ADMIN
- Full system access
- User management
- All features

### MANAGER
- Child management
- Attendance control
- Evaluations
- Reports generation

### GUARDIAN
- Mark attendance
- Create evaluations
- Send/receive notifications
- View assigned children

### FAMILY
- View own children
- Receive notifications
- View attendance records
- View evaluations and reports

## API Integration

The frontend communicates with the backend API through service files in `src/services/`:

- `api.ts` - Axios instance with interceptors
- `authService.ts` - Authentication endpoints
- `userService.ts` - User management
- `childService.ts` - Child management
- `attendanceService.ts` - Attendance tracking
- `notificationService.ts` - Notifications
- `evaluationService.ts` - Evaluations
- `reportService.ts` - Reports

## Key Features

### Authentication
- Login page with form validation
- JWT token storage in localStorage
- Automatic token refresh
- Protected routes based on roles

### Dashboard
- Statistics cards showing:
  - Total children
  - Total users
  - Today's attendance
  - Unread notifications
- Quick actions
- Recent activity feed

### User Management (Admin Only)
- View all users in a table
- Create new users
- Edit user details
- Activate/deactivate users
- Delete users

### Children Management
- View children in card grid
- Register new children
- Edit child information
- Deactivate children
- View child details

### Attendance Tracking
- Mark daily attendance
- View attendance by date
- Filter by date
- Check-in/check-out times
- Status indicators (Present, Absent, Late)

### Notifications
- Send notifications to users
- View received notifications
- Filter by read/unread
- Mark as read
- Delete notifications

### Evaluations
- Create evaluations for children
- Filter by category
- View evaluation history
- Edit/delete evaluations

### Reports
- Generate weekly reports (per child)
- Generate monthly reports
- View report history
- Download reports

## Styling

The application uses Tailwind CSS with a custom color scheme. The primary color is defined in `tailwind.config.js` and can be customized.

Custom utility classes are defined in `src/index.css`:
- `.btn` - Button base styles
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-danger` - Danger button
- `.input` - Input field styles
- `.card` - Card container
- `.badge` - Badge component

## Development

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add a route in `src/App.tsx`
3. Add navigation item in `src/components/Layout/Sidebar.tsx` (if needed)

### Adding New API Endpoints

1. Add method to appropriate service file in `src/services/`
2. Use in components with React Query hooks

### Customization

- **Colors**: Edit `tailwind.config.js`
- **Fonts**: Add to `index.html` and `tailwind.config.js`
- **Layout**: Modify `DashboardLayout.tsx`

## Troubleshooting

### API Connection Issues
- Ensure backend is running on `http://localhost:3000`
- Check `.env` file for correct API URL
- Verify CORS settings on backend

### Authentication Issues
- Clear localStorage and login again
- Check JWT token expiration
- Verify backend authentication endpoints

### Build Issues
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version (16+ required)

## License

Developed for academic purposes at Wolaita Sodo University (2025)


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Baby,
  Bell,
  BarChart3,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.GUARDIAN, UserRole.FAMILY] },
  { name: 'Users', path: '/users', icon: Users, roles: [UserRole.ADMIN] },
  { name: 'Children', path: '/children', icon: Baby, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.GUARDIAN, UserRole.FAMILY] },
  { name: 'Attendance', path: '/attendance', icon: Users, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.GUARDIAN] },
  { name: 'Evaluations', path: '/evaluations', icon: BarChart3, roles: [UserRole.ADMIN, UserRole.MANAGER] },
  { name: 'Notifications', path: '/notifications', icon: Bell, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.GUARDIAN, UserRole.FAMILY] },
  { name: 'Reports', path: '/reports', icon: BarChart3, roles: [UserRole.ADMIN, UserRole.MANAGER] },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter((item) => item.roles.includes(user?.role || UserRole.FAMILY));

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-primary-600">EEUSR Childcare</h1>
        <p className="text-sm text-gray-500 mt-1">Management System</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${isActive
                ? 'bg-primary-100 text-primary-700 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="mb-4 px-4 py-2 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-800">{user?.fullName}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role.toLowerCase()}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;


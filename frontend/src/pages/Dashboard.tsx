import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Baby, Calendar, Bell, TrendingUp, FileText } from 'lucide-react';
import { reportService } from '../services/reportService';
import { evaluationService } from '../services/evaluationService';
import { notificationService } from '../services/notificationService';
import { Statistics, UserRole, Evaluation, Notification, Child } from '../types';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Statistics Query
  const { data: statistics, isLoading: statsLoading } = useQuery<Statistics>({
    queryKey: ['statistics'],
    queryFn: reportService.getStatistics,
  });

  // Recent Evaluations Query
  const { data: evaluations = [] } = useQuery<Evaluation[]>({
    queryKey: ['recent-evaluations'],
    queryFn: () => evaluationService.getAll(),
  });

  // Recent Notifications Query
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['recent-notifications'],
    queryFn: () => notificationService.getMy(),
  });

  const stats = [
    {
      name: 'Total Children',
      value: statistics?.totalChildren || 0,
      icon: Baby,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      name: 'Total Users',
      value: statistics?.totalUsers || 0,
      icon: Users,
      color: 'bg-green-500',
      change: '+5%',
    },
    {
      name: "Today's Attendance",
      value: statistics?.totalAttendanceToday || 0,
      icon: Calendar,
      color: 'bg-purple-500',
      change: '+8%',
    },
    {
      name: 'Unread Notifications',
      value: statistics?.unreadNotifications || 0,
      icon: Bell,
      color: 'bg-orange-500',
      change: '-3%',
    },
  ];

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Slice data to show only recent items (e.g., last 5)
  const recentEvaluations = evaluations.slice(0, 5);
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to EEUSR Childcare Management System</p>
        <p className="text-sm text-gray-500 mt-1">Last updated: {format(new Date(), 'PPpp')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats
          .filter((stat) => {
            if (user?.role === UserRole.ADMIN && stat.name === 'Total Children') return false;
            if (user?.role === UserRole.GUARDIAN && stat.name === 'Total Users') return false;
            return true;
          })
          .map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {user?.role === UserRole.ADMIN && (
              <>
                <a href="/users" className="w-full btn btn-primary text-left block text-center">
                  Manage Users
                </a>
                <a href="/reports" className="w-full btn btn-secondary text-left block text-center">
                  View Reports
                </a>
                <a
                  href="/notifications"
                  className="w-full btn btn-secondary text-left block text-center"
                >
                  Send Notification
                </a>
              </>
            )}

            {user?.role === UserRole.MANAGER && (
              <>
                <a
                  href="/attendance"
                  className="w-full btn btn-primary text-left block text-center"
                >
                  Control Attendance
                </a>
                <a
                  href="/evaluations"
                  className="w-full btn btn-secondary text-left block text-center"
                >
                  Child Evaluations
                </a>
                <a
                  href="/notifications"
                  className="w-full btn btn-secondary text-left block text-center"
                >
                  Send Notification
                </a>
              </>
            )}

            {user?.role === UserRole.GUARDIAN && (
              <>
                <a
                  href="/attendance"
                  className="w-full btn btn-primary text-left block text-center"
                >
                  Mark Attendance
                </a>
                <a href="/children" className="w-full btn btn-secondary text-left block text-center">
                  My Children
                </a>
                <a
                  href="/notifications"
                  className="w-full btn btn-secondary text-left block text-center"
                >
                  Notifications
                </a>
              </>
            )}

            {user?.role === UserRole.FAMILY && (
              <>
                <a href="/children" className="w-full btn btn-primary text-left block text-center">
                  My Children
                </a>
                <a
                  href="/notifications"
                  className="w-full btn btn-secondary text-left block text-center"
                >
                  Notifications
                </a>
                <a
                  href="/notifications"
                  className="w-full btn btn-secondary text-left block text-center"
                >
                  Send Notification
                </a>
              </>
            )}
          </div>
        </div>

        {/* --- REPLACED: Updated with Recent Evaluations & Notifications --- */}
        <div className="space-y-6">
          {/* Recent Notifications */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              Recent Notifications
            </h2>
            <div className="space-y-3">
              {recentNotifications.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No new notifications</p>
              ) : (
                recentNotifications.map((notif) => (
                  <div key={notif._id} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-1">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1 text-right">
                      {notif.createdAt && format(new Date(notif.createdAt), 'MMM dd, HH:mm')}
                    </p>
                  </div>
                ))
              )}
              <a href="/notifications" className="text-sm text-primary-600 hover:text-primary-700 font-medium block text-center mt-2">
                View All Notifications
              </a>
            </div>
          </div>

          {/* Recent Evaluations */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              Recent Evaluations
            </h2>
            <div className="space-y-3">
              {recentEvaluations.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No recent evaluations</p>
              ) : (
                recentEvaluations.map((evalItem) => (
                  <div key={evalItem._id} className="p-3 bg-purple-50 rounded-lg border border-purple-100 flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {typeof evalItem.childId === 'object'
                          ? `${(evalItem.childId as Child).firstName} ${(evalItem.childId as Child).lastName}`
                          : 'Unknown Child'
                        }
                      </p>
                      <p className="text-xs text-purple-700 mt-0.5 font-medium">{evalItem.category}</p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1">{evalItem.observation}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {evalItem.createdAt && format(new Date(evalItem.createdAt), 'MMM dd')}
                    </span>
                  </div>
                ))
              )}
              <a href="/evaluations" className="text-sm text-primary-600 hover:text-primary-700 font-medium block text-center mt-2">
                View All Evaluations
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Trash2, Mail, MailOpen } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import toast from 'react-hot-toast';
import NotificationModal from '../components/Modals/NotificationModal';
import { format } from 'date-fns';
import { Notification } from '../types';

const Notifications: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'sent'>('all');
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', filter],
    queryFn: async () => {
      const sentPromise = notificationService.getSent();

      if (filter === 'sent') {
        const sent = await sentPromise;
        return sent.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      }

      const receivedPromise = filter === 'unread'
        ? notificationService.getMy(false)
        : filter === 'read'
          ? notificationService.getMy(true)
          : notificationService.getMy(); // 'all'

      const [received, sent] = await Promise.all([receivedPromise, sentPromise]);

      let filteredSent = sent;
      if (filter === 'unread') filteredSent = sent.filter(n => !n.isRead);
      else if (filter === 'read') filteredSent = sent.filter(n => n.isRead);

      const notifications = [...received, ...filteredSent];

      // Deduplicate by ID and sort by date
      const uniqueNotifications = Array.from(
        new Map(notifications.map(n => [n._id, n])).values()
      );

      return uniqueNotifications.sort((a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
      toast.success('Notification marked as read');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: notificationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification deleted');
    },
  });

  const handleSend = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">View and manage your notifications</p>
        </div>
        <button onClick={handleSend} className="btn btn-primary flex items-center space-x-2">
          <Send className="w-5 h-5" />
          <span>Send Notification</span>
        </button>
      </div>

      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'unread'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'read'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Read
          </button>
          <button
            onClick={() => setFilter('sent')}
            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'sent'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Sent
          </button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg border-2 ${notification.isRead
                ? 'bg-gray-50 border-gray-200'
                : 'bg-blue-50 border-blue-200'
                }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {notification.isRead ? (
                      <MailOpen className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Mail className="w-4 h-4 text-blue-600" />
                    )}
                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    {!notification.isRead && (
                      <span className="badge bg-blue-100 text-blue-800">New</span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{notification.message}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>
                      {typeof notification.receiverId === 'object' && notification.receiverId
                        ? `To: ${(notification.receiverId as any).fullName}`
                        : `From: ${typeof notification.senderId === 'object' && notification.senderId
                          ? (notification.senderId as any).fullName
                          : notification.sender?.fullName || 'System'
                        }`}
                    </span>
                    <span>
                      {notification.createdAt
                        ? format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')
                        : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsReadMutation.mutate(notification._id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Mark as read"
                    >
                      <MailOpen className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this notification?')) {
                        deleteMutation.mutate(notification._id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No notifications found</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <NotificationModal
          onClose={handleClose}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            handleClose();
          }}
        />
      )}
    </div>
  );
};

export default Notifications;


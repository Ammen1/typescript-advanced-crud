import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { notificationService, SendNotificationData } from '../../services/notificationService';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

interface NotificationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ onClose, onSuccess }) => {
  const { user: currentUser } = useAuth();
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendNotificationData>();

  const createMutation = useMutation({
    mutationFn: notificationService.send,
    onSuccess: () => {
      toast.success('Notification sent successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send notification');
    },
  });

  const onSubmit = (data: SendNotificationData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Send Notification</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <select
              {...register('receiverId', { required: 'Receiver is required' })}
              className="input"
            >
              <option value="">Select user</option>
              {users
                .filter((u) => u._id !== currentUser?._id && u.role !== currentUser?.role)
                .map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.fullName} ({user.role})
                  </option>
                ))}
            </select>
            {errors.receiverId && (
              <p className="text-sm text-red-600 mt-1">{errors.receiverId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="input"
              placeholder="Enter notification title"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              {...register('message', { required: 'Message is required' })}
              className="input"
              rows={5}
              placeholder="Enter notification message"
            ></textarea>
            {errors.message && (
              <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn btn-primary"
            >
              {createMutation.isPending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationModal;


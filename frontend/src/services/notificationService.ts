import api from './api';
import { Notification, ApiResponse } from '../types';

export interface SendNotificationData {
  receiverId: string;
  title: string;
  message: string;
}

export const notificationService = {
  send: async (data: SendNotificationData): Promise<Notification> => {
    const response = await api.post<ApiResponse<Notification>>('/notifications/send', data);
    return response.data.data!;
  },

  getMy: async (isRead?: boolean): Promise<Notification[]> => {
    const params = isRead !== undefined ? `?isRead=${isRead}` : '';
    const response = await api.get<ApiResponse<Notification[]>>(`/notifications/my${params}`);
    return response.data.data || [];
  },

  getSent: async (): Promise<Notification[]> => {
    const response = await api.get<ApiResponse<Notification[]>>('/notifications/sent');
    return response.data.data || [];
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<ApiResponse<number>>('/notifications/unread/count');
    return response.data.data || 0;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};


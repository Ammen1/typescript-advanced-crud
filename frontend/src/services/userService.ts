import api from './api';
import { User, ApiResponse } from '../types';

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: string;
  phoneNumber: string;
}

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/users');
    return response.data.data || [];
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data!;
  },

  create: async (data: CreateUserData): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/users/create', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<CreateUserData>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  updateStatus: async (id: string, isActive: boolean): Promise<void> => {
    await api.put(`/users/${id}/status`, { isActive });
  },

  getEmployees: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/users/employees');
    return response.data.data || [];
  },
};


import api from './api';
import { Child, ApiResponse } from '../types';

export interface CreateChildData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  registrationNumber: string;
  parentId: string;
  guardianId?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    specialNeeds?: string;
  };
}

export const childService = {
  getAll: async (): Promise<Child[]> => {
    const response = await api.get<ApiResponse<Child[]>>('/children/all');
    return response.data.data || [];
  },

  getMyChildren: async (): Promise<Child[]> => {
    const response = await api.get<ApiResponse<Child[]>>('/children/my-children');
    return response.data.data || [];
  },

  getById: async (id: string): Promise<Child> => {
    const response = await api.get<ApiResponse<Child>>(`/children/${id}`);
    return response.data.data!;
  },

  getByRegistrationNumber: async (registrationNumber: string): Promise<Child> => {
    const response = await api.get<ApiResponse<Child>>(`/children/registration/${registrationNumber}`);
    return response.data.data!;
  },

  register: async (data: CreateChildData): Promise<Child> => {
    const response = await api.post<ApiResponse<Child>>('/children/register', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<CreateChildData>): Promise<Child> => {
    const response = await api.put<ApiResponse<Child>>(`/children/${id}`, data);
    return response.data.data!;
  },

  deactivate: async (id: string): Promise<void> => {
    await api.put(`/children/${id}/delete`);
  },
};


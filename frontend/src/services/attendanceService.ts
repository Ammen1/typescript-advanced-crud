import api from './api';
import { Attendance, ApiResponse } from '../types';

export interface MarkAttendanceData {
  childId: string;
  date: string;
  checkInTime?: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  notes?: string;
}

export interface UpdateAttendanceData {
  checkOutTime?: string;
  status?: 'PRESENT' | 'ABSENT' | 'LATE';
  notes?: string;
}

export const attendanceService = {
  mark: async (data: MarkAttendanceData): Promise<Attendance> => {
    const response = await api.post<ApiResponse<Attendance>>('/attendance/mark', data);
    return response.data.data!;
  },

  update: async (id: string, data: UpdateAttendanceData): Promise<Attendance> => {
    const response = await api.put<ApiResponse<Attendance>>(`/attendance/${id}`, data);
    return response.data.data!;
  },

  getByChild: async (childId: string, startDate?: string, endDate?: string): Promise<Attendance[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get<ApiResponse<Attendance[]>>(`/attendance/child/${childId}?${params}`);
    return response.data.data || [];
  },

  getDaily: async (date: string): Promise<Attendance[]> => {
    const response = await api.get<ApiResponse<Attendance[]>>(`/attendance/daily?date=${date}`);
    return response.data.data || [];
  },

  getAll: async (): Promise<Attendance[]> => {
    const response = await api.get<ApiResponse<Attendance[]>>('/attendance');
    return response.data.data || [];
  },
};


import api from './api';
import { Report, Statistics, ApiResponse } from '../types';

export interface GenerateWeeklyReportData {
  childId: string;
  startDate: string;
  endDate: string;
}

export interface GenerateMonthlyReportData {
  startDate: string;
  endDate: string;
}

export const reportService = {
  getStatistics: async (): Promise<Statistics> => {
    const response = await api.get<ApiResponse<Statistics>>('/reports/statistics');
    return response.data.data!;
  },

  generateWeekly: async (data: GenerateWeeklyReportData): Promise<Report> => {
    const response = await api.post<ApiResponse<Report>>('/reports/weekly', data);
    return response.data.data!;
  },

  generateMonthly: async (data: GenerateMonthlyReportData): Promise<Report> => {
    const response = await api.post<ApiResponse<Report>>('/reports/monthly', data);
    return response.data.data!;
  },

  getByChild: async (childId: string): Promise<Report[]> => {
    const response = await api.get<ApiResponse<Report[]>>(`/reports/child/${childId}`);
    return response.data.data || [];
  },

  getAll: async (type?: string): Promise<Report[]> => {
    const params = type ? `?type=${type}` : '';
    const response = await api.get<ApiResponse<Report[]>>(`/reports${params}`);
    return response.data.data || [];
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/reports/${id}`);
  },

  update: async (id: string, data: Partial<Report>): Promise<Report> => {
    const response = await api.patch<ApiResponse<Report>>(`/reports/${id}`, data);
    return response.data.data!;
  },

  // Simulated download since no backend endpoint was specified
  download: async (report: Report): Promise<void> => {
    // In a real app, this might be: await api.get(`/reports/${report._id}/download`, { responseType: 'blob' });
    // For now, we create a text file on the client side
    const content = `
EEUSR Childcare Management System
Report Details
--------------------------------
Type: ${report.type}
Period: ${new Date(report.period.startDate).toDateString()} - ${new Date(report.period.endDate).toDateString()}
Created: ${new Date(report.createdAt).toDateString()}
--------------------------------
Statistics:
Attendance:
  Total Days: ${report.data?.attendance?.totalDays ?? 0}
  Present: ${report.data?.attendance?.presentDays ?? 0}
  Absent: ${report.data?.attendance?.absentDays ?? 0}
  Late: ${report.data?.attendance?.lateArrivals ?? 0}

Evaluations: ${report.data?.evaluations?.length ?? 0} entries
Activities: ${report.data?.activities?.length ?? 0} entries
Health Incidents: ${report.data?.healthIncidents?.length ?? 0} entries

Raw Data:
${JSON.stringify(report.data, null, 2)}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${report.type}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};


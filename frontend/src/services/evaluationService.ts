import api from './api';
import { Evaluation, ApiResponse } from '../types';

export interface CreateEvaluationData {
  childId: string;
  category: 'PHYSICAL' | 'COGNITIVE' | 'SOCIAL' | 'EMOTIONAL' | 'LANGUAGE' | 'OTHER';
  observation: string;
  recommendation?: string;
  attachments?: string[];
}

export const evaluationService = {
  create: async (data: CreateEvaluationData): Promise<Evaluation> => {
    const response = await api.post<ApiResponse<Evaluation>>('/evaluations/create', data);
    return response.data.data!;
  },

  getByChild: async (childId: string, category?: string): Promise<Evaluation[]> => {
    const params = category ? `?category=${category}` : '';
    const response = await api.get<ApiResponse<Evaluation[]>>(`/evaluations/child/${childId}${params}`);
    return response.data.data || [];
  },

  getAll: async (category?: string, startDate?: string, endDate?: string): Promise<Evaluation[]> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get<ApiResponse<Evaluation[]>>(`/evaluations/all?${params}`);
    return response.data.data || [];
  },

  getById: async (id: string): Promise<Evaluation> => {
    const response = await api.get<ApiResponse<Evaluation>>(`/evaluations/${id}`);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<CreateEvaluationData>): Promise<Evaluation> => {
    const response = await api.put<ApiResponse<Evaluation>>(`/evaluations/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/evaluations/${id}`);
  },
};


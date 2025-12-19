import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import {
  reportService,
  GenerateWeeklyReportData,
  GenerateMonthlyReportData,
} from '../../services/reportService';
import { childService } from '../../services/childService';
import toast from 'react-hot-toast';

interface ReportModalProps {
  type: 'weekly' | 'monthly';
  onClose: () => void;
  onSuccess: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ type, onClose, onSuccess }) => {
  const { data: children = [] } = useQuery({
    queryKey: ['children'],
    queryFn: childService.getAll,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateWeeklyReportData & GenerateMonthlyReportData>({
    defaultValues: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    },
  });

  const weeklyMutation = useMutation({
    mutationFn: reportService.generateWeekly,
    onSuccess: () => {
      toast.success('Weekly report generated successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to generate report');
    },
  });

  const monthlyMutation = useMutation({
    mutationFn: reportService.generateMonthly,
    onSuccess: () => {
      toast.success('Monthly report generated successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to generate report');
    },
  });

  const onSubmit = (data: GenerateWeeklyReportData & GenerateMonthlyReportData) => {
    if (type === 'weekly') {
      if (!data.childId) {
        toast.error('Child is required for weekly reports');
        return;
      }
      weeklyMutation.mutate({
        childId: data.childId,
        startDate: data.startDate,
        endDate: data.endDate,
      });
    } else {
      monthlyMutation.mutate({
        startDate: data.startDate,
        endDate: data.endDate,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Generate {type === 'weekly' ? 'Weekly' : 'Monthly'} Report
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {type === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Child</label>
              <select
                {...register('childId', { required: type === 'weekly' ? 'Child is required' : false })}
                className="input"
              >
                <option value="">Select child</option>
                {children
                  .filter((c) => c.status === 'ACTIVE')
                  .map((child) => (
                    <option key={child._id} value={child._id}>
                      {child.firstName} {child.lastName}
                    </option>
                  ))}
              </select>
              {errors.childId && (
                <p className="text-sm text-red-600 mt-1">{errors.childId.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              {...register('startDate', { required: 'Start date is required' })}
              className="input"
            />
            {errors.startDate && (
              <p className="text-sm text-red-600 mt-1">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              {...register('endDate', { required: 'End date is required' })}
              className="input"
            />
            {errors.endDate && (
              <p className="text-sm text-red-600 mt-1">{errors.endDate.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={weeklyMutation.isPending || monthlyMutation.isPending}
              className="btn btn-primary"
            >
              {weeklyMutation.isPending || monthlyMutation.isPending
                ? 'Generating...'
                : 'Generate Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;


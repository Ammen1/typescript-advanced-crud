import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { attendanceService, MarkAttendanceData } from '../../services/attendanceService';
import { childService } from '../../services/childService';
import toast from 'react-hot-toast';

interface AttendanceModalProps {
  date: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({ date, onClose, onSuccess }) => {
  const { data: children = [] } = useQuery({
    queryKey: ['children'],
    queryFn: childService.getAll,
  });

  const todayStr = new Date().toISOString().slice(0, 10);
  const initialDate = date < todayStr ? todayStr : date;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<MarkAttendanceData & { checkInTime?: string }>({
    defaultValues: {
      date: initialDate,
      status: 'PRESENT',
      checkInTime: new Date().toISOString().slice(0, 16),
    },
  });

  const createMutation = useMutation({
    mutationFn: attendanceService.mark,
    onSuccess: () => {
      toast.success('Attendance marked successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    },
  });

  const onSubmit = (data: MarkAttendanceData & { checkInTime?: string }) => {
    const submitData: MarkAttendanceData = {
      childId: data.childId,
      date: data.date,
      status: data.status,
      notes: data.notes,
      checkInTime: data.checkInTime ? new Date(data.checkInTime).toISOString() : undefined,
    };
    createMutation.mutate(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Mark Attendance</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Child</label>
            <select
              {...register('childId', { required: 'Child is required' })}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              {...register('date', {
                required: 'Date is required',
                validate: (value) => value >= todayStr || 'Date cannot be in the past',
              })}
              className="input"
              min={todayStr}
            />
            {errors.date && (
              <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              {...register('status', { required: 'Status is required' })}
              className="input"
            >
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="LATE">Late</option>
            </select>
            {errors.status && (
              <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check In Time</label>
            <input
              type="datetime-local"
              {...register('checkInTime')}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              {...register('notes')}
              className="input"
              rows={3}
              placeholder="Add any notes about attendance..."
            ></textarea>
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
              {createMutation.isPending ? 'Saving...' : 'Mark Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceModal;


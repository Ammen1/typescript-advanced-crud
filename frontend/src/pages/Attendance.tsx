import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { attendanceService } from '../services/attendanceService';
import AttendanceModal from '../components/Modals/AttendanceModal';
import { format } from 'date-fns';

const Attendance: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const queryClient = useQueryClient();

  const { data: attendance = [], isLoading } = useQuery({
    queryKey: ['attendance', selectedDate],
    queryFn: () => attendanceService.getDaily(selectedDate),
  });

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return (
          <span className="badge bg-green-100 text-green-800 flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Present</span>
          </span>
        );
      case 'ABSENT':
        return (
          <span className="badge bg-red-100 text-red-800 flex items-center space-x-1">
            <XCircle className="w-3 h-3" />
            <span>Absent</span>
          </span>
        );
      case 'LATE':
        return (
          <span className="badge bg-yellow-100 text-yellow-800 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Late</span>
          </span>
        );
      default:
        return <span className="badge bg-gray-100 text-gray-800">{status}</span>;
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">Track daily attendance records</p>
        </div>
        <button onClick={handleAdd} className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Mark Attendance</span>
        </button>
      </div>

      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <label className="text-sm font-medium text-gray-700">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input w-auto"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Child Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Check In</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Check Out</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Notes</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {typeof record.childId === 'object' && record.childId
                      ? `${(record.childId as any).firstName} ${(record.childId as any).lastName}`
                      : record.child
                        ? `${record.child.firstName} ${record.child.lastName}`
                        : 'N/A'}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                  <td className="py-3 px-4">
                    {record.checkInTime
                      ? format(new Date(record.checkInTime), 'HH:mm')
                      : '-'}
                  </td>
                  <td className="py-3 px-4">
                    {record.checkOutTime
                      ? format(new Date(record.checkOutTime), 'HH:mm')
                      : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{record.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {attendance.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No attendance records for this date</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AttendanceModal
          date={selectedDate}
          onClose={handleClose}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['attendance'] });
            handleClose();
          }}
        />
      )}
    </div>
  );
};

export default Attendance;


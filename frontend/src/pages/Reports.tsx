import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Download, Calendar, Trash2, Edit2, Save, X, CheckSquare } from 'lucide-react';
import { reportService } from '../services/reportService';
import { Child, Report } from '../types';

import toast from 'react-hot-toast';
import ReportModal from '../components/Modals/ReportModal';
import { format } from 'date-fns';

const Reports: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');
  const [editingId, setEditingId] = useState<string | null>(null);

  // State for mock editing since we don't have fields to edit in the current UI
  // In a real app, this would be form state
  const [editNotes, setEditNotes] = useState<string>('');

  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => reportService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: reportService.delete,
    onSuccess: () => {
      toast.success('Report deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: () => {
      toast.error('Failed to delete report');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Report> }) =>
      reportService.update(id, data),
    onSuccess: () => {
      toast.success('Report updated successfully');
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: () => {
      toast.error('Failed to update report');
    },
  });

  const handleGenerate = (type: 'weekly' | 'monthly') => {
    setReportType(type);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleDownload = async (report: Report) => {
    try {
      await reportService.download(report);
      toast.success('Report downloaded');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  const handleDelete = (report: Report) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      deleteMutation.mutate(report._id);
    }
  };

  const handleStartEdit = (report: Report) => {
    setEditingId(report._id);
    // Initialize edit state with current mock value or actual field
    setEditNotes('Report verified');
  };

  const handleSaveEdit = (id: string) => {
    // In a real app we'd pass the actual edited fields
    updateMutation.mutate({ id, data: { generatedBy: editNotes } });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and view system reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleGenerate('weekly')}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Weekly Report</span>
          </button>
          <button
            onClick={() => handleGenerate('monthly')}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Monthly Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report._id} className="card hover:shadow-lg transition-shadow relative group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-primary-600" />
                <span className="badge bg-primary-100 text-primary-800">{report.type}</span>
              </div>
              {/* Action Icons */}
              <div className="flex space-x-1">
                {editingId === report._id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(report._id)}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors flex items-center gap-1"
                      title="Save Update"
                    >
                      <Save className="w-4 h-4" />
                      <span className="text-xs font-medium">Update</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-xs font-medium">Cancel</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleStartEdit(report)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center gap-1"
                      title="Edit Report"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="text-xs font-medium">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(report)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-xs font-medium">Delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {report.childId && typeof report.childId === 'object' && (
                <div className="flex items-center text-gray-600">
                  <span className="font-medium w-24">Child:</span>
                  <span>
                    {(report.childId as Child).firstName} {(report.childId as Child).lastName}
                  </span>
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-24">Period:</span>
                <span>
                  {format(new Date(report.period.startDate), 'MMM dd')} -{' '}
                  {format(new Date(report.period.endDate), 'MMM dd, yyyy')}
                </span>
              </div>
              {report.createdAt && (
                <div className="flex items-center text-gray-600">
                  <span className="font-medium w-24">Created:</span>
                  <span>{format(new Date(report.createdAt), 'MMM dd, yyyy')}</span>
                </div>
              )}
              {editingId === report._id && (
                <div className="mt-2 p-2 bg-yellow-50 text-yellow-800 rounded text-xs border border-yellow-200">
                  Editing Mode Active...
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => handleDownload(report)}
                className="btn btn-secondary w-full text-sm py-2 flex items-center justify-center gap-2 group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="card text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No reports found</p>
          <p className="text-sm text-gray-400 mt-2">Generate a report to get started</p>
        </div>
      )}

      {isModalOpen && (
        <ReportModal
          type={reportType}
          onClose={handleClose}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            handleClose();
          }}
        />
      )}
    </div>
  );
};

export default Reports;

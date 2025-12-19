import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { evaluationService } from '../services/evaluationService';
import { Evaluation } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import toast from 'react-hot-toast';
import EvaluationModal from '../components/Modals/EvaluationModal';
import { format } from 'date-fns';

const Evaluations: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: evaluations = [], isLoading } = useQuery({
    queryKey: ['evaluations', categoryFilter],
    queryFn: () => evaluationService.getAll(categoryFilter),
  });

  const deleteMutation = useMutation({
    mutationFn: evaluationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluations'] });
      toast.success('Evaluation deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete evaluation');
    },
  });

  const handleEdit = (evaluation: Evaluation) => {
    setEditingEvaluation(evaluation);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingEvaluation(null);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingEvaluation(null);
  };

  const canEdit = user?.role === UserRole.MANAGER || user?.role === UserRole.GUARDIAN;

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'PHYSICAL':
        return 'bg-blue-100 text-blue-800';
      case 'COGNITIVE':
        return 'bg-purple-100 text-purple-800';
      case 'SOCIAL':
        return 'bg-green-100 text-green-800';
      case 'EMOTIONAL':
        return 'bg-yellow-100 text-yellow-800';
      case 'LANGUAGE':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this evaluation?')) {
      deleteMutation.mutate(id);
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
          <h1 className="text-3xl font-bold text-gray-900">Evaluations</h1>
          <p className="text-gray-600 mt-1">Track child development evaluations</p>
        </div>
        {canEdit && (
          <button onClick={handleAdd} className="btn btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create Evaluation</span>
          </button>
        )}
      </div>

      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <label className="text-sm font-medium text-gray-700">Filter by Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="">All Categories</option>
            <option value="PHYSICAL">Physical</option>
            <option value="COGNITIVE">Cognitive</option>
            <option value="SOCIAL">Social</option>
            <option value="EMOTIONAL">Emotional</option>
            <option value="LANGUAGE">Language</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="space-y-4">
          {evaluations.map((evaluation) => (
            <div key={evaluation._id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">
                      {typeof evaluation.childId === 'object' && evaluation.childId
                        ? `${(evaluation.childId as any).firstName} ${(evaluation.childId as any).lastName}`
                        : evaluation.child
                          ? `${evaluation.child.firstName} ${evaluation.child.lastName}`
                          : 'Unknown Child'}
                    </h3>
                    <span className={`badge ${getCategoryBadgeColor(evaluation.category)}`}>
                      {evaluation.category}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{evaluation.observation}</p>
                  {evaluation.recommendation && (
                    <p className="text-sm text-gray-600 italic">
                      Recommendation: {evaluation.recommendation}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <span>
                      By:{' '}
                      {typeof evaluation.evaluatorId === 'object' && evaluation.evaluatorId
                        ? (evaluation.evaluatorId as any).fullName
                        : evaluation.evaluator?.fullName || 'Unknown'}
                    </span>
                    <span>
                      {evaluation.createdAt
                        ? format(new Date(evaluation.createdAt), 'MMM dd, yyyy')
                        : ''}
                    </span>
                  </div>
                </div>
                {canEdit && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(evaluation)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit Evaluation"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(evaluation._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Delete Evaluation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {evaluations.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No evaluations found</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <EvaluationModal
          evaluation={editingEvaluation}
          onClose={handleClose}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['evaluations'] });
            handleClose();
          }}
        />
      )}
    </div>
  );
};

export default Evaluations;


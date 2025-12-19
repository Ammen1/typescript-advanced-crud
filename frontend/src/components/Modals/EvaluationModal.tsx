import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { evaluationService, CreateEvaluationData } from '../../services/evaluationService';
import { Evaluation } from '../../types';
import { childService } from '../../services/childService';
import toast from 'react-hot-toast';

interface EvaluationModalProps {
  evaluation: Evaluation | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EvaluationModal: React.FC<EvaluationModalProps> = ({ evaluation, onClose, onSuccess }) => {
  const { data: children = [] } = useQuery({
    queryKey: ['children'],
    queryFn: childService.getAll,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateEvaluationData>({
    defaultValues: evaluation
      ? {
        childId: typeof evaluation.childId === 'object' ? (evaluation.childId as any)._id : evaluation.childId as string,
        category: evaluation.category,
        observation: evaluation.observation,
        recommendation: evaluation.recommendation,
      }
      : undefined,
  });

  const createMutation = useMutation({
    mutationFn: evaluationService.create,
    onSuccess: () => {
      toast.success('Evaluation created successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create evaluation');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateEvaluationData>) =>
      evaluationService.update(evaluation!._id, data),
    onSuccess: () => {
      toast.success('Evaluation updated successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update evaluation');
    },
  });

  useEffect(() => {
    if (evaluation) {
      reset({
        childId: typeof evaluation.childId === 'object' ? (evaluation.childId as any)._id : evaluation.childId,
        category: evaluation.category,
        observation: evaluation.observation,
        recommendation: evaluation.recommendation,
      });
    }
  }, [evaluation, reset]);

  const onSubmit = (data: CreateEvaluationData) => {
    if (evaluation) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {evaluation ? 'Edit Evaluation' : 'Create Evaluation'}
          </h2>
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
              disabled={!!evaluation}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="input"
            >
              <option value="">Select category</option>
              <option value="PHYSICAL">Physical</option>
              <option value="COGNITIVE">Cognitive</option>
              <option value="SOCIAL">Social</option>
              <option value="EMOTIONAL">Emotional</option>
              <option value="LANGUAGE">Language</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.category && (
              <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observation</label>
            <textarea
              {...register('observation', { required: 'Observation is required' })}
              className="input"
              rows={5}
              placeholder="Enter your observation..."
            ></textarea>
            {errors.observation && (
              <p className="text-sm text-red-600 mt-1">{errors.observation.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recommendation (Optional)
            </label>
            <textarea
              {...register('recommendation')}
              className="input"
              rows={3}
              placeholder="Enter recommendations..."
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="btn btn-primary"
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : evaluation
                  ? 'Update'
                  : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluationModal;


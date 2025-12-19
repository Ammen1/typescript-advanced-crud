import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { childService, CreateChildData } from '../../services/childService';
import { Child } from '../../types';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

interface ChildModalProps {
  child: Child | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ChildModal: React.FC<ChildModalProps> = ({ child, onClose, onSuccess }) => {
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  });

  const parents = users.filter((u) => u.role === 'FAMILY');
  const guardians = users.filter((u) => u.role === 'GUARDIAN' || u.role === 'MANAGER');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateChildData & { allergies?: string; medications?: string }>({
    defaultValues: child
      ? {
        firstName: child.firstName,
        lastName: child.lastName,
        dateOfBirth: child.dateOfBirth.split('T')[0],
        gender: child.gender,
        registrationNumber: child.registrationNumber,
        parentId: child.parentId,
        guardianId: child.guardianId,
        emergencyContact: child.emergencyContact,
        medicalInfo: {
          allergies: child.medicalInfo?.allergies || [],
          medications: child.medicalInfo?.medications || [],
          specialNeeds: child.medicalInfo?.specialNeeds || '',
        },
        allergies: child.medicalInfo?.allergies?.join(', ') || '',
        medications: child.medicalInfo?.medications?.join(', ') || '',
      }
      : undefined,
  });

  const createMutation = useMutation({
    mutationFn: childService.register,
    onSuccess: () => {
      toast.success('Child registered successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to register child');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateChildData>) => childService.update(child!._id, data),
    onSuccess: () => {
      toast.success('Child updated successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update child');
    },
  });

  useEffect(() => {
    if (child) {
      reset({
        firstName: child.firstName,
        lastName: child.lastName,
        dateOfBirth: child.dateOfBirth.split('T')[0],
        gender: child.gender,
        registrationNumber: child.registrationNumber,
        parentId: child.parentId,
        guardianId: child.guardianId,
        emergencyContact: child.emergencyContact,
        allergies: child.medicalInfo?.allergies?.join(', ') || '',
        medications: child.medicalInfo?.medications?.join(', ') || '',
      });
    }
  }, [child, reset]);

  const onSubmit = (data: CreateChildData & { allergies?: string; medications?: string }) => {
    const { allergies, medications, ...submitData } = data;
    const medicalInfo = {
      allergies: allergies ? allergies.split(',').map((a) => a.trim()).filter(Boolean) : [],
      medications: medications ? medications.split(',').map((m) => m.trim()).filter(Boolean) : [],
      specialNeeds: data.medicalInfo?.specialNeeds || '',
    };

    const finalData: any = {
      ...submitData,
      medicalInfo,
    };

    // Remove guardianId if it's an empty string (optional field)
    if (!finalData.guardianId || finalData.guardianId === '') {
      delete finalData.guardianId;
    }

    if (child) {
      updateMutation.mutate(finalData);
    } else {
      createMutation.mutate(finalData as CreateChildData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {child ? 'Edit Child' : 'Register New Child'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                {...register('firstName', { required: 'First name is required' })}
                className="input"
              />
              {errors.firstName && (
                <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                {...register('lastName', { required: 'Last name is required' })}
                className="input"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                max={new Date().toISOString().split('T')[0]}
                {...register('dateOfBirth', {
                  required: 'Date of birth is required',
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return selectedDate <= today || 'Birth date cannot be in the future';
                  }
                })}
                className="input"
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                {...register('gender', { required: 'Gender is required' })}
                className="input"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              {errors.gender && (
                <p className="text-sm text-red-600 mt-1">{errors.gender.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Number
            </label>
            <input
              type="text"
              {...register('registrationNumber', { required: 'Registration number is required' })}
              className="input"
            />
            {errors.registrationNumber && (
              <p className="text-sm text-red-600 mt-1">{errors.registrationNumber.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent</label>
              <select
                {...register('parentId', { required: 'Parent is required' })}
                className="input"
              >
                <option value="">Select parent</option>
                {parents.map((parent) => (
                  <option key={parent._id} value={parent._id}>
                    {parent.fullName}
                  </option>
                ))}
              </select>
              {errors.parentId && (
                <p className="text-sm text-red-600 mt-1">{errors.parentId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guardian (Optional)</label>
              <select {...register('guardianId')} className="input">
                <option value="">Select guardian</option>
                {guardians.map((guardian) => (
                  <option key={guardian._id} value={guardian._id}>
                    {guardian.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Emergency Contact</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  {...register('emergencyContact.name', { required: 'Contact name is required' })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                <input
                  type="text"
                  {...register('emergencyContact.relationship', {
                    required: 'Relationship is required',
                  })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  {...register('emergencyContact.phoneNumber', {
                    required: 'Phone number is required',
                  })}
                  className="input"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Medical Information (Optional)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies (comma-separated)
                </label>
                <input type="text" {...register('allergies')} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medications (comma-separated)
                </label>
                <input type="text" {...register('medications')} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Needs</label>
                <textarea
                  {...register('medicalInfo.specialNeeds')}
                  className="input"
                  rows={3}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
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
                : child
                  ? 'Update'
                  : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChildModal;


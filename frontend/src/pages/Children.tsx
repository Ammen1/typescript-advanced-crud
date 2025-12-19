import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { childService, CreateChildData } from '../services/childService';
import { Child } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import toast from 'react-hot-toast';
import ChildModal from '../components/Modals/ChildModal';
import { format } from 'date-fns';

const Children: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [searchId, setSearchId] = useState('');
  const [searchedChild, setSearchedChild] = useState<Child | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const queryClient = useQueryClient();

  const { data: children = [], isLoading } = useQuery({
    queryKey: ['children'],
    queryFn: user?.role === UserRole.FAMILY ? childService.getMyChildren : childService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: childService.deactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
      toast.success('Child deactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to deactivate child');
    },
  });

  const handleEdit = (child: Child) => {
    setEditingChild(child);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingChild(null);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingChild(null);
  };

  const handleSearchById = async () => {
    if (!searchId.trim()) {
      toast.error('Please enter a registration number');
      return;
    }

    setIsSearching(true);
    try {
      const child = await childService.getByRegistrationNumber(searchId.trim());
      setSearchedChild(child);
      toast.success('Child found!');
    } catch (error: any) {
      setSearchedChild(null);
      toast.error(error.response?.data?.message || 'Child not found');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchId('');
    setSearchedChild(null);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      case 'GRADUATED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Admin and Manager can register or edit children
  const canEdit = user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER;

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
          <h1 className="text-3xl font-bold text-gray-900">Children</h1>
          <p className="text-gray-600 mt-1">Manage children profiles and information</p>
        </div>
        {canEdit && (
          <button
            onClick={handleAdd}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Register Child</span>
          </button>
        )}
      </div>

      {/* Search by Registration Number Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Child by Registration Number</h2>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearchById();
                }
              }}
              placeholder="Enter Registration Number (e.g., REG001, 6543223)"
              className="input"
            />
          </div>
          <button
            onClick={handleSearchById}
            disabled={isSearching}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>{isSearching ? 'Searching...' : 'Search'}</span>
          </button>
          {searchedChild && (
            <button
              onClick={handleClearSearch}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <X className="w-5 h-5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Display Searched Child */}
        {searchedChild && (
          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {searchedChild.firstName} {searchedChild.lastName}
                </h3>
                <p className="text-sm text-gray-500">ID: {searchedChild._id}</p>
                <p className="text-sm text-gray-500">Reg: {searchedChild.registrationNumber}</p>
              </div>
              <span className={`badge ${getStatusBadgeColor(searchedChild.status)}`}>
                {searchedChild.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Date of Birth:</span>
                <p className="text-gray-900">
                  {format(new Date(searchedChild.dateOfBirth), 'MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Gender:</span>
                <p className="text-gray-900 capitalize">{searchedChild.gender.toLowerCase()}</p>
              </div>
              {searchedChild.emergencyContact && (
                <>
                  <div>
                    <span className="font-medium text-gray-700">Emergency Contact:</span>
                    <p className="text-gray-900">{searchedChild.emergencyContact.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-900">{searchedChild.emergencyContact.phoneNumber}</p>
                  </div>
                </>
              )}
              {searchedChild.medicalInfo && (
                <>
                  {searchedChild.medicalInfo.allergies && searchedChild.medicalInfo.allergies.length > 0 && (
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">Allergies:</span>
                      <p className="text-gray-900">{searchedChild.medicalInfo.allergies.join(', ')}</p>
                    </div>
                  )}
                  {searchedChild.medicalInfo.medications && searchedChild.medicalInfo.medications.length > 0 && (
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">Medications:</span>
                      <p className="text-gray-900">{searchedChild.medicalInfo.medications.join(', ')}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {canEdit && (
              <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
                <button
                  onClick={() => handleEdit(searchedChild)}
                  className="flex-1 btn btn-secondary text-sm py-2"
                >
                  <Edit className="w-4 h-4 inline mr-1" />
                  Edit
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child) => (
          <div key={child._id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {child.firstName} {child.lastName}
                </h3>
                <p className="text-sm text-gray-500">Reg: {child.registrationNumber}</p>
              </div>
              <span className={`badge ${getStatusBadgeColor(child.status)}`}>
                {child.status}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-24">DOB:</span>
                <span>{format(new Date(child.dateOfBirth), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-24">Gender:</span>
                <span className="capitalize">{child.gender.toLowerCase()}</span>
              </div>
              {child.emergencyContact && (
                <div className="flex items-center text-gray-600">
                  <span className="font-medium w-24">Contact:</span>
                  <span>{child.emergencyContact.phoneNumber}</span>
                </div>
              )}
            </div>

            {canEdit && (
              <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
                <button
                  onClick={() => handleEdit(child)}
                  className="flex-1 btn btn-secondary text-sm py-2"
                >
                  <Edit className="w-4 h-4 inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to deactivate this child?')) {
                      deleteMutation.mutate(child._id);
                    }
                  }}
                  className="flex-1 btn btn-danger text-sm py-2"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Deactivate
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {children.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500">No children found</p>
        </div>
      )}

      {isModalOpen && (
        <ChildModal
          child={editingChild}
          onClose={handleClose}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['children'] });
            handleClose();
          }}
        />
      )}
    </div>
  );
};

export default Children;


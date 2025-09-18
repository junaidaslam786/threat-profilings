import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppDispatch } from '../../Redux/hooks';
import { 
  openApplicationModal, 
  setSelectedApplication 
} from '../../Redux/slices/applicationsSlice';
import { 
  useUpdateApplicationMutation, 
  useDeleteApplicationMutation 
} from '../../Redux/api/applicationsApi';
import Button from '../Common/Button';
import { useUser } from '../../hooks/useUser';
import type { Application } from '../../Redux/slices/types/applicationTypes';

interface ApplicationCardProps {
  application: Application;
  className?: string;
  showActions?: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ 
  application, 
  className = "",
  showActions = true 
}) => {
  const dispatch = useAppDispatch();
  const { isOrgAdmin, isLEAdmin } = useUser();
  
  const [updateApplication] = useUpdateApplicationMutation();
  const [deleteApplication] = useDeleteApplicationMutation();
  
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Check user permissions - use role checking functions from useUser
  const canEdit = isOrgAdmin || isLEAdmin;
  const canDelete = isOrgAdmin || isLEAdmin;

  const handleEditStart = (field: string, currentValue: string) => {
    if (!canEdit) return;
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleEditSave = async () => {
    if (!editingField || !canEdit) return;

    try {
      await updateApplication({
        appId: application.app_id,
        data: {
          [editingField]: editValue.trim()
        }
      }).unwrap();
      
      toast.success('Application updated successfully');
      setEditingField(null);
      setEditValue('');
    } catch (error: unknown) {
      console.error('Error updating application:', error);
      
      // Handle different types of errors
      if (error && typeof error === 'object' && 'data' in error) {
        const apiError = error as { data?: { message?: string; error?: string } };
        if (apiError.data?.message) {
          toast.error(apiError.data.message);
        } else if (apiError.data?.error) {
          toast.error(apiError.data.error);
        } else {
          toast.error('Failed to update application');
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const standardError = error as { message: string };
        toast.error(standardError.message);
      } else {
        toast.error('Failed to update application');
      }
    }
  };

  const handleDelete = async () => {
    if (!canDelete || !window.confirm(`Are you sure you want to archive "${application.app_name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteApplication(application.app_id).unwrap();
      toast.success('Application archived successfully');
    } catch (error: unknown) {
      console.error('Error deleting application:', error);
      
      // Handle different types of errors
      if (error && typeof error === 'object' && 'data' in error) {
        const apiError = error as { data?: { message?: string; error?: string } };
        if (apiError.data?.message) {
          toast.error(apiError.data.message);
        } else if (apiError.data?.error) {
          toast.error(apiError.data.error);
        } else {
          toast.error('Failed to archive application');
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const standardError = error as { message: string };
        toast.error(standardError.message);
      } else {
        toast.error('Failed to archive application');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewDetails = () => {
    dispatch(setSelectedApplication(application));
    dispatch(openApplicationModal({ mode: 'view', application }));
  };

  const handleEditModal = () => {
    dispatch(setSelectedApplication(application));
    dispatch(openApplicationModal({ mode: 'edit', application }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'under_review': return 'bg-secondary-100 text-secondary-800 border-secondary-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getThreatScoreColor = (score?: number) => {
    if (score === undefined || score === null) return 'text-gray-400';
    if (score >= 7) return 'text-red-400';
    if (score >= 4) return 'text-yellow-400';
    return 'text-green-400';
  };

  const renderEditableField = (
    field: string, 
    value: string, 
    label: string, 
    isTextArea = false
  ) => {
    const isEditing = editingField === field;
    
    if (isEditing) {
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">{label}</label>
          {isTextArea ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full p-2 rounded border border-secondary-600 bg-secondary-700 text-white text-sm resize-none"
              rows={3}
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full p-2 rounded border border-secondary-600 bg-secondary-700 text-white text-sm"
              autoFocus
            />
          )}
          <div className="flex gap-2">
            <button
              onClick={handleEditSave}
              className="px-3 py-1 bg-secondary-600 text-white rounded text-xs hover:bg-secondary-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleEditCancel}
              className="px-3 py-1 bg-secondary-600 text-white rounded text-xs hover:bg-secondary-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="group">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <div className="flex items-center justify-between">
          <span className="text-white text-sm break-all">
            {value || <span className="text-gray-400 italic">Not set</span>}
          </span>
          {canEdit && (
            <button
              onClick={() => handleEditStart(field, value)}
              className="ml-2 p-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              title={`Edit ${label}`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-lg border border-secondary-700/50 p-6 hover:border-secondary-600 transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2 break-words">
            {application.app_name}
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(application.status)}`}>
              {application.status.replace('_', ' ')}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(application.priority)}`}>
              {application.priority}
            </span>
            <span className="px-2 py-1 text-xs font-medium rounded-full border bg-secondary-100 text-secondary-800 border-secondary-200">
              {application.app_type}
            </span>
          </div>
        </div>
        
        {showActions && (
          <div className="flex gap-2 ml-4">
            <Button
              onClick={handleViewDetails}
              variant="secondary"
              className="text-xs"
            >
              View
            </Button>
            {canEdit && (
              <Button
                onClick={handleEditModal}
                variant="primary"
                className="text-xs"
              >
                Edit
              </Button>
            )}
            {canDelete && (
              <Button
                onClick={handleDelete}
                variant="danger"
                className="text-xs"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Archive'}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Description */}
        {renderEditableField(
          'description', 
          application.description || '', 
          'Description',
          true
        )}

        {/* Technologies */}
        <div>
          <label className="text-sm font-medium text-gray-300">Technologies</label>
          <div className="flex flex-wrap gap-1 mt-1">
            {application.technologies.length > 0 ? (
              application.technologies.map((tech: string, index: number) => (
                <span
                  key={`${tech}-${index}`}
                  className="px-2 py-1 bg-secondary-700 text-secondary-200 text-xs rounded-md border border-secondary-600"
                >
                  {tech}
                </span>
              ))
            ) : (
              <span className="text-gray-400 italic text-sm">No technologies specified</span>
            )}
          </div>
        </div>

        {/* URLs and Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderEditableField(
            'repository_url', 
            application.repository_url || '', 
            'Repository URL'
          )}
          
          {renderEditableField(
            'deployment_url', 
            application.deployment_url || '', 
            'Deployment URL'
          )}
          
          {renderEditableField(
            'contact_email', 
            application.contact_email || '', 
            'Contact Email'
          )}
        </div>

        {/* Security Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-secondary-700">
          <div>
            <label className="text-sm font-medium text-gray-300">Threat Score</label>
            <div className={`text-lg font-bold ${getThreatScoreColor(application.threat_score)}`}>
              {application.threat_score !== undefined && application.threat_score !== null 
                ? application.threat_score.toFixed(1) 
                : 'N/A'}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-300">Scan Count</label>
            <div className="text-lg font-bold text-white">
              {application.scan_count || 0}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-300">Compliance</label>
            <div className="text-sm text-white">
              {application.compliance_status || 'Not assessed'}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-300">Last Scan</label>
            <div className="text-sm text-white">
              {application.last_scan_date 
                ? new Date(application.last_scan_date).toLocaleDateString()
                : 'Never'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-secondary-700 text-xs text-gray-400">
          <span>Created: {new Date(application.created_at).toLocaleDateString()}</span>
          <span>Updated: {new Date(application.updated_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { 
  Application, 
  ApplicationSummary, 
  OrganizationAppData, 
  ApplicationStatistics,
  ApplicationFormData,
  ApplicationFormErrors 
} from "./types/applicationTypes";

export interface ApplicationState {
  // Current organization applications
  applications: Application[];
  applicationSummary: ApplicationSummary | null;
  
  // User's applications across all organizations
  userApplications: OrganizationAppData[];
  userApplicationsTotal: number;
  
  // Application statistics
  applicationStatistics: ApplicationStatistics | null;
  
  // UI State
  selectedApplication: Application | null;
  isApplicationModalOpen: boolean;
  modalMode: 'create' | 'edit' | 'view';
  
  // Form state
  applicationForm: ApplicationFormData;
  applicationFormErrors: ApplicationFormErrors;
  
  // Loading states
  loading: {
    applications: boolean;
    userApplications: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    statistics: boolean;
  };
  
  // Error states
  error: {
    applications: string | null;
    userApplications: string | null;
    create: string | null;
    update: string | null;
    delete: string | null;
    statistics: string | null;
  };
  
  // Filters and search
  filters: {
    status: string[];
    appType: string[];
    priority: string[];
    searchTerm: string;
  };
  
  // Pagination
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
  };
}

const initialApplicationForm: ApplicationFormData = {
  appName: '',
  description: '',
  appType: 'web',
  technologies: [],
  repositoryUrl: '',
  deploymentUrl: '',
  contactEmail: '',
  priority: 'medium',
};

const initialState: ApplicationState = {
  applications: [],
  applicationSummary: null,
  userApplications: [],
  userApplicationsTotal: 0,
  applicationStatistics: null,
  selectedApplication: null,
  isApplicationModalOpen: false,
  modalMode: 'create',
  applicationForm: initialApplicationForm,
  applicationFormErrors: {},
  loading: {
    applications: false,
    userApplications: false,
    creating: false,
    updating: false,
    deleting: false,
    statistics: false,
  },
  error: {
    applications: null,
    userApplications: null,
    create: null,
    update: null,
    delete: null,
    statistics: null,
  },
  filters: {
    status: [],
    appType: [],
    priority: [],
    searchTerm: '',
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
  },
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    // Applications actions
    setApplications: (state, action: PayloadAction<Application[]>) => {
      state.applications = action.payload;
      state.pagination.totalItems = action.payload.length;
    },
    
    setApplicationSummary: (state, action: PayloadAction<ApplicationSummary>) => {
      state.applicationSummary = action.payload;
    },
    
    addApplication: (state, action: PayloadAction<Application>) => {
      state.applications.unshift(action.payload);
      state.pagination.totalItems += 1;
    },
    
    updateApplication: (state, action: PayloadAction<Application>) => {
      const index = state.applications.findIndex(app => app.appId === action.payload.appId);
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
      if (state.selectedApplication?.appId === action.payload.appId) {
        state.selectedApplication = action.payload;
      }
    },
    
    removeApplication: (state, action: PayloadAction<string>) => {
      state.applications = state.applications.filter(app => app.appId !== action.payload);
      state.pagination.totalItems -= 1;
      if (state.selectedApplication?.appId === action.payload) {
        state.selectedApplication = null;
      }
    },
    
    // User applications actions
    setUserApplications: (state, action: PayloadAction<{ appsByOrganization: OrganizationAppData[], totalApps: number }>) => {
      state.userApplications = action.payload.appsByOrganization;
      state.userApplicationsTotal = action.payload.totalApps;
    },
    
    // Statistics actions
    setApplicationStatistics: (state, action: PayloadAction<ApplicationStatistics>) => {
      state.applicationStatistics = action.payload;
    },
    
    // Selected application actions
    setSelectedApplication: (state, action: PayloadAction<Application | null>) => {
      state.selectedApplication = action.payload;
    },
    
    // Modal actions
    openApplicationModal: (state, action: PayloadAction<{ mode: 'create' | 'edit' | 'view', application?: Application }>) => {
      state.isApplicationModalOpen = true;
      state.modalMode = action.payload.mode;
      
      if (action.payload.application) {
        state.selectedApplication = action.payload.application;
        if (action.payload.mode === 'edit') {
          state.applicationForm = {
            appName: action.payload.application.appName,
            description: action.payload.application.description || '',
            appType: action.payload.application.appType,
            technologies: [...action.payload.application.technologies],
            repositoryUrl: action.payload.application.repositoryUrl || '',
            deploymentUrl: action.payload.application.deploymentUrl || '',
            contactEmail: action.payload.application.contactEmail || '',
            priority: action.payload.application.priority,
          };
        }
      } else {
        state.selectedApplication = null;
        state.applicationForm = initialApplicationForm;
      }
      
      state.applicationFormErrors = {};
    },
    
    closeApplicationModal: (state) => {
      state.isApplicationModalOpen = false;
      state.selectedApplication = null;
      state.applicationForm = initialApplicationForm;
      state.applicationFormErrors = {};
      state.modalMode = 'create';
    },
    
    // Form actions
    updateApplicationForm: (state, action: PayloadAction<Partial<ApplicationFormData>>) => {
      state.applicationForm = { ...state.applicationForm, ...action.payload };
    },
    
    setApplicationFormErrors: (state, action: PayloadAction<ApplicationFormErrors>) => {
      state.applicationFormErrors = action.payload;
    },
    
    clearApplicationFormErrors: (state) => {
      state.applicationFormErrors = {};
    },
    
    resetApplicationForm: (state) => {
      state.applicationForm = initialApplicationForm;
      state.applicationFormErrors = {};
    },
    
    // Loading actions
    setApplicationsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.applications = action.payload;
      if (action.payload) {
        state.error.applications = null;
      }
    },
    
    setUserApplicationsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.userApplications = action.payload;
      if (action.payload) {
        state.error.userApplications = null;
      }
    },
    
    setCreatingLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.creating = action.payload;
      if (action.payload) {
        state.error.create = null;
      }
    },
    
    setUpdatingLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.updating = action.payload;
      if (action.payload) {
        state.error.update = null;
      }
    },
    
    setDeletingLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.deleting = action.payload;
      if (action.payload) {
        state.error.delete = null;
      }
    },
    
    setStatisticsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.statistics = action.payload;
      if (action.payload) {
        state.error.statistics = null;
      }
    },
    
    // Error actions
    setApplicationsError: (state, action: PayloadAction<string>) => {
      state.error.applications = action.payload;
      state.loading.applications = false;
    },
    
    setUserApplicationsError: (state, action: PayloadAction<string>) => {
      state.error.userApplications = action.payload;
      state.loading.userApplications = false;
    },
    
    setCreateError: (state, action: PayloadAction<string>) => {
      state.error.create = action.payload;
      state.loading.creating = false;
    },
    
    setUpdateError: (state, action: PayloadAction<string>) => {
      state.error.update = action.payload;
      state.loading.updating = false;
    },
    
    setDeleteError: (state, action: PayloadAction<string>) => {
      state.error.delete = action.payload;
      state.loading.deleting = false;
    },
    
    setStatisticsError: (state, action: PayloadAction<string>) => {
      state.error.statistics = action.payload;
      state.loading.statistics = false;
    },
    
    // Filter actions
    setApplicationFilters: (state, action: PayloadAction<Partial<typeof state.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearApplicationFilters: (state) => {
      state.filters = {
        status: [],
        appType: [],
        priority: [],
        searchTerm: '',
      };
    },
    
    // Pagination actions
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.currentPage = 1; // Reset to first page
    },
    
    // Utility actions
    clearAllApplicationData: () => {
      return { ...initialState };
    },
    
    clearApplicationErrors: (state) => {
      state.error = {
        applications: null,
        userApplications: null,
        create: null,
        update: null,
        delete: null,
        statistics: null,
      };
    },
  },
});

export const {
  // Applications actions
  setApplications,
  setApplicationSummary,
  addApplication,
  updateApplication,
  removeApplication,
  
  // User applications actions
  setUserApplications,
  
  // Statistics actions
  setApplicationStatistics,
  
  // Selected application actions
  setSelectedApplication,
  
  // Modal actions
  openApplicationModal,
  closeApplicationModal,
  
  // Form actions
  updateApplicationForm,
  setApplicationFormErrors,
  clearApplicationFormErrors,
  resetApplicationForm,
  
  // Loading actions
  setApplicationsLoading,
  setUserApplicationsLoading,
  setCreatingLoading,
  setUpdatingLoading,
  setDeletingLoading,
  setStatisticsLoading,
  
  // Error actions
  setApplicationsError,
  setUserApplicationsError,
  setCreateError,
  setUpdateError,
  setDeleteError,
  setStatisticsError,
  
  // Filter actions
  setApplicationFilters,
  clearApplicationFilters,
  
  // Pagination actions
  setCurrentPage,
  setItemsPerPage,
  
  // Utility actions
  clearAllApplicationData,
  clearApplicationErrors,
} = applicationsSlice.actions;

export default applicationsSlice.reducer;
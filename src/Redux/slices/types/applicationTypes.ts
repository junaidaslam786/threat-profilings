// App Management Types and Interfaces
export type AppType = 'web' | 'mobile' | 'api' | 'desktop' | 'other';
export type AppPriority = 'low' | 'medium' | 'high' | 'critical';
export type AppStatus = 'active' | 'inactive' | 'archived' | 'under_review';
export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface CreateApplicationRequest {
  appName: string;
  description?: string;
  appType?: AppType;
  technologies?: string[];
  repositoryUrl?: string;
  deploymentUrl?: string;
  contactEmail?: string;
  priority?: AppPriority;
}

export interface UpdateApplicationRequest {
  appName?: string;
  description?: string;
  appType?: AppType;
  technologies?: string[];
  repositoryUrl?: string;
  deploymentUrl?: string;
  contactEmail?: string;
  priority?: AppPriority;
  status?: AppStatus;
  lastScanDate?: string;
  scanStatus?: ScanStatus;
}

export interface Application {
  app_id: string;
  client_name: string;
  app_name: string;
  description?: string;
  app_type: AppType;
  technologies: string[];
  repository_url?: string;
  deployment_url?: string;
  contact_email?: string;
  priority: AppPriority;
  status: AppStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_scan_date?: string;
  scan_status?: ScanStatus;
  scan_count: number;
  threat_score?: number;
  compliance_status?: string;
  canEdit?: boolean;
  canDelete?: boolean;
  scanAllowed?: boolean;
}

export interface ApplicationSummary {
  total_apps: number;
  active_apps: number;
  archived_apps: number;
  recent_scans: number;
  average_threat_score: number;
}

export interface ApplicationLimits {
  currentApps: number;
  maxApps: number;
  canCreateMore: boolean;
}

export interface OrganizationAppData {
  clientName: string;
  organizationName: string;
  userRole: string;
  apps: Application[];
  appLimits: ApplicationLimits;
}

export interface UserApplicationsResponse {
  appsByOrganization: OrganizationAppData[];
  totalApps: number;
}

export interface OrganizationAppsResponse {
  success: boolean;
  organization: string;
  apps: Application[];
  summary: ApplicationSummary;
}

export interface CreateApplicationResponse {
  success: boolean;
  message: string;
  app: Application;
  usageSummary?: Record<string, unknown>;
}

export interface UpdateApplicationResponse {
  success: boolean;
  message: string;
  app: Application;
}

export interface DeleteApplicationResponse {
  success: boolean;
  message: string;
}

export interface ApplicationStatistics {
  totalApps: number;
  appsByStatus: {
    active: number;
    archived: number;
    underReview: number;
  };
  appsByType: Record<string, number>;
  recentActivity: {
    appsCreatedLast30Days: number;
    appsScannedLast30Days: number;
  };
  organizationsSummary: Array<{
    clientName: string;
    organizationName: string;
    appCount: number;
    subscriptionTier: string;
    usagePercentage: number;
  }>;
}

export interface ScanResultUpdate {
  threatScore?: number;
  complianceStatus?: string;
  scanStatus: 'completed' | 'failed';
  scanDetails?: Record<string, unknown>;
}

// Form validation interfaces
export interface ApplicationFormData {
  appName: string;
  description: string;
  appType: AppType;
  technologies: string[];
  repositoryUrl: string;
  deploymentUrl: string;
  contactEmail: string;
  priority: AppPriority;
}

export interface ApplicationFormErrors {
  appName?: string;
  description?: string;
  appType?: string;
  technologies?: string;
  repositoryUrl?: string;
  deploymentUrl?: string;
  contactEmail?: string;
  priority?: string;
}

// Constants for dropdowns and validation
export const APP_TYPES: { value: AppType; label: string }[] = [
  { value: 'web', label: 'Web Application' },
  { value: 'mobile', label: 'Mobile Application' },
  { value: 'api', label: 'API Service' },
  { value: 'desktop', label: 'Desktop Application' },
  { value: 'other', label: 'Other' },
];

export const APP_PRIORITIES: { value: AppPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export const APP_STATUSES: { value: AppStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
  { value: 'under_review', label: 'Under Review' },
];

export const COMMON_TECHNOLOGIES = [
  'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Django', 'Flask',
  'Spring Boot', 'ASP.NET', 'Ruby on Rails', 'Laravel', 'WordPress',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'Google Cloud', 'TypeScript', 'JavaScript', 'Python',
  'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin'
];
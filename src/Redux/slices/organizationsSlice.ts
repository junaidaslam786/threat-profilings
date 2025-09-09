import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThreatLevel = "low" | "medium" | "high" | "critical";

export type AssessmentStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "approved"
  | "rejected";

export type ComplianceFramework =
  | "ISM"
  | "NIST"
  | "ISO27001"
  | "SOC2"
  | "GDPR"
  | "E8"
  | "ACSC_ESSENTIAL_EIGHT";

export type ControlStatus =
  | "not_implemented"
  | "partially_implemented"
  | "fully_implemented"
  | "not_applicable";

export interface ThreatActor {
  id: string;
  name: string;
  type:
    | "nation_state"
    | "cybercriminal"
    | "insider"
    | "hacktivist"
    | "terrorist";
  sophistication: "low" | "medium" | "high" | "expert";
  motivation: string[];
  capabilities: string[];
}

export interface Vulnerability {
  id: string;
  cve_id?: string;
  title: string;
  description: string;
  severity: ThreatLevel;
  cvss_score?: number;
  affected_components: string[];
  mitigation_status: "open" | "in_progress" | "mitigated" | "accepted";
  remediation_steps?: string[];
}

export interface ThreatScenario {
  id: string;
  title: string;
  description: string;
  threat_actors: string[];
  attack_vectors: string[];
  likelihood: ThreatLevel;
  impact: ThreatLevel;
  risk_level: ThreatLevel;
  mitigation_controls: string[];
}

export interface RiskMetrics {
  total_risks: number;
  critical_risks: number;
  high_risks: number;
  medium_risks: number;
  low_risks: number;
  mitigated_risks: number;
  accepted_risks: number;
  residual_risk_score: number;
}

export interface ThreatProfilingReport {
  report_id: string;
  version: string;
  generated_at: string;
  generated_by: string;
  executive_summary: {
    overview: string;
    key_findings: string[];
    recommendations: string[];
    risk_posture: ThreatLevel;
  };
  organization_context: {
    business_model: string;
    critical_assets: string[];
    regulatory_requirements: ComplianceFramework[];
    threat_landscape: string;
  };
  threat_analysis: {
    threat_actors: ThreatActor[];
    threat_scenarios: ThreatScenario[];
    vulnerabilities: Vulnerability[];
    attack_surface: {
      external_facing_assets: string[];
      internal_systems: string[];
      third_party_dependencies: string[];
    };
  };
  risk_assessment: {
    methodology: string;
    risk_metrics: RiskMetrics;
    risk_matrix: {
      likelihood_scale: string[];
      impact_scale: string[];
      risk_levels: Record<string, ThreatLevel>;
    };
    top_risks: Array<{
      id: string;
      title: string;
      description: string;
      likelihood: ThreatLevel;
      impact: ThreatLevel;
      risk_level: ThreatLevel;
      business_impact: string;
    }>;
  };
  controls_assessment: {
    frameworks_assessed: ComplianceFramework[];
    control_effectiveness: Record<
      string,
      {
        control_id: string;
        control_name: string;
        status: ControlStatus;
        effectiveness_rating: number;
        gaps_identified: string[];
        recommendations: string[];
      }
    >;
  };
  recommendations: {
    immediate_actions: Array<{
      priority: "critical" | "high" | "medium" | "low";
      recommendation: string;
      rationale: string;
      estimated_effort: string;
      expected_impact: string;
    }>;
    strategic_initiatives: Array<{
      initiative: string;
      timeline: string;
      resources_required: string;
      expected_outcomes: string[];
    }>;
  };
  compliance_status: Record<
    ComplianceFramework,
    {
      overall_compliance: number;
      compliant_controls: number;
      non_compliant_controls: number;
      gaps: Array<{
        control_id: string;
        gap_description: string;
        remediation_steps: string[];
      }>;
    }
  >;
  appendices?: {
    methodology_details?: string;
    threat_intelligence_sources?: string[];
    glossary?: Record<string, string>;
    references?: string[];
  };
}

export interface SecurityAssessment {
  assessment_id: string;
  assessment_type: "initial" | "periodic" | "targeted" | "compliance";
  status: AssessmentStatus;
  metadata: {
    created_at: string;
    updated_at: string;
    created_by: string;
    assessed_by?: string;
    approved_by?: string;
    assessment_period: {
      start_date: string;
      end_date: string;
    };
    scope: string[];
    exclusions?: string[];
  };
  methodology: {
    framework: ComplianceFramework[];
    assessment_approach:
      | "questionnaire"
      | "interview"
      | "technical_review"
      | "hybrid";
    evidence_requirements: string[];
    scoring_criteria: Record<string, unknown>;
  };
  results: {
    overall_score: number;
    maturity_level:
      | "initial"
      | "developing"
      | "defined"
      | "managed"
      | "optimizing";

    domain_scores: Record<
      string,
      {
        domain_name: string;
        score: number;
        max_score: number;
        percentage: number;
        findings: string[];
        recommendations: string[];
      }
    >;

    control_assessments: Record<
      string,
      {
        control_id: string;
        control_name: string;
        requirement: string;
        implementation_status: ControlStatus;
        evidence_provided: string[];
        evidence_quality: "insufficient" | "adequate" | "comprehensive";
        assessor_notes: string;
        score: number;
        max_score: number;
      }
    >;
  };

  findings: {
    strengths: string[];
    weaknesses: string[];
    critical_gaps: Array<{
      gap_id: string;
      title: string;
      description: string;
      affected_controls: string[];
      risk_level: ThreatLevel;
      remediation_priority:
        | "immediate"
        | "short_term"
        | "medium_term"
        | "long_term";
    }>;
  };
  action_plan: {
    remediation_roadmap: Array<{
      item_id: string;
      action: string;
      responsible_party: string;
      due_date: string;
      status: "not_started" | "in_progress" | "completed" | "overdue";
      dependencies?: string[];
      resources_required: string[];
    }>;

    quick_wins: string[];
    strategic_improvements: string[];
  };
  quality_assurance?: {
    reviewed_by?: string;
    review_date?: string;
    review_comments?: string;
    approved_by?: string;
    approval_date?: string;
  };
}

export interface OrgApp {
  app_name: string;
  app_profile: string;
  app_url?: string;
  app_additional_details?: string;
}

export interface OrgSubscription {
  subscription_level: string;
  run_quota: number;
  run_number: number;
  runs_remaining: number | string;
  max_edits: number;
  max_apps: number;
  progress: number;
  subscription_status: string;
  created_at: string;
}

export interface OrgAppsInfo {
  total_apps: number;
  apps_limit: number;
  apps_remaining: number | string;
  recent_apps: Record<string, unknown>[];
  has_apps_table: boolean;
}

export interface OrgUsageStats {
  total_runs: number;
  total_scans: number;
  quota_usage_percentage: number;
  apps_usage_percentage: number;
  last_activity: string;
}

export interface OrgAccessPermissions {
  can_create_apps: boolean;
  can_run_scans: boolean;
  can_edit: boolean;
  can_manage_users: boolean;
}

export interface ClientDataDto {
  client_name: string;
  created_at: string;
  email?: string;
  name?: string;
  organization_name: string;
  owner_email?: string;
  partner_code?: string | null;
  sector?: string;
  website_url?: string;
  countries_of_operation?: string[];
  home_url?: string;
  about_us_url?: string;
  additional_details?: string;
  apps?: Array<{
    app_name: string;
    app_profile: string;
    app_url?: string;
    app_additional_details?: string;
  }>;
  user_ids?: string[];
  report?: ThreatProfilingReport;
  assessment?: SecurityAssessment;
  controls_accepted_implemented?: {
    controls_implemented?: Record<string, { comment: string }>;
    controls_risk_accepted?: Record<string, { comment: string }>;
  };
  org_domain?: string;
  user_type?: "standard" | "LE" | "client";
  le_master?: boolean | string;
  managed_orgs?: string[];
  admins?: string[];
  viewers?: string[];
  runners?: string[];
  created_by?: string;
  type?: string;
  updated_at?: string;

  user_role?: string;
  is_le_master?: boolean;
  managed_orgs_count?: number;
  subscription?: OrgSubscription | null;
  apps_info?: OrgAppsInfo;
  usage?: OrgUsageStats;
  access?: OrgAccessPermissions;
}

export interface CreateOrgDto {
  orgName: string;
  orgDomain: string;
  sector?: string;
  websiteUrl?: string;
  countriesOfOperation?: string[];
  homeUrl?: string;
  aboutUsUrl?: string;
  additionalDetails?: string;
}

export interface LeCreateOrgDto {
  org_name: string;
  org_domain: string;
  industry: string;
  org_size: "1-10" | "11-50" | "51-100" | "101-500" | "500+";
  websiteUrl?: string;
  countriesOfOperation?: string[];
  homeUrl?: string;
  aboutUsUrl?: string;
  additionalDetails?: string;
}

export interface UpdateOrgDto {
  orgName?: string;
  sector?: string;
  websiteUrl?: string;
  countriesOfOperation?: string[];
  homeUrl?: string;
  aboutUsUrl?: string;
  additionalDetails?: string;
}

export interface CreateOrgResponse {
  clientName: string;
  user_type: "standard" | "LE";
  le_master?: boolean;
}

export interface LeCreateOrgResponse {
  clientName: string;
  le_master: string;
}

export interface SwitchOrgResponse {
  switchedTo: string;
  organization_name: string;
  user_role: string;
  org_type: string;
  is_le_master: boolean;
  le_master: string | null;
}

export interface UpdateOrgResponse {
  updated: boolean;
}

export interface DeleteOrgResponse {
  deleted: boolean;
  client_name: string;
}

interface OrganizationsState {
  organizations: ClientDataDto[];
  selectedOrg: ClientDataDto | null;
  leOrganizations: {
    le_master: ClientDataDto | null;
    managed_orgs: ClientDataDto[];
    total_managed: number;
  } | null;
  allOrgs: ClientDataDto[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrganizationsState = {
  organizations: [],
  selectedOrg: null,
  leOrganizations: null,
  allOrgs: [],
  isLoading: false,
  error: null,
};

const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    setOrganizations: (state, action: PayloadAction<ClientDataDto[]>) => {
      state.organizations = action.payload;
      state.isLoading = false;
    },
    setSelectedOrg: (state, action: PayloadAction<ClientDataDto | null>) => {
      state.selectedOrg = action.payload;
    },
    setLeOrganizations: (
      state,
      action: PayloadAction<{
        le_master: ClientDataDto | null;
        managed_orgs: ClientDataDto[];
        total_managed: number;
      }>
    ) => {
      state.leOrganizations = action.payload;
      state.isLoading = false;
    },
    setAllOrgs: (state, action: PayloadAction<ClientDataDto[]>) => {
      state.allOrgs = action.payload;
      state.isLoading = false;
    },
    setOrgLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrgError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    addOrganization: (state, action: PayloadAction<ClientDataDto>) => {
      state.organizations.push(action.payload);
    },
    updateOrganization: (state, action: PayloadAction<ClientDataDto>) => {
      const index = state.organizations.findIndex(
        (org) => org.client_name === action.payload.client_name
      );
      if (index !== -1) {
        state.organizations[index] = action.payload;
      }
    },
    removeOrganization: (state, action: PayloadAction<string>) => {
      state.organizations = state.organizations.filter(
        (org) => org.client_name !== action.payload
      );
      state.allOrgs = state.allOrgs.filter(
        (org) => org.client_name !== action.payload
      );
    },
  },
});

export const {
  setOrganizations,
  setSelectedOrg,
  setLeOrganizations,
  setAllOrgs,
  setOrgLoading,
  setOrgError,
  addOrganization,
  updateOrganization,
  removeOrganization,
} = organizationsSlice.actions;

export default organizationsSlice.reducer;

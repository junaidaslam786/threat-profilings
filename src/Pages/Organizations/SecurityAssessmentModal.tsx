import { useState } from "react";
import Button from "../../components/Common/Button";
import Modal from "../../components/Common/Modal";
import type { 
  SecurityAssessment, 
  AssessmentStatus,
  ComplianceFramework
} from "../../Redux/slices/organizationsSlice";

interface SecurityAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assessment: SecurityAssessment) => void;
  editingAssessment?: SecurityAssessment | null;
}

export default function SecurityAssessmentModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingAssessment = null 
}: SecurityAssessmentModalProps) {
  const [fields, setFields] = useState({
    assessment_id: editingAssessment?.assessment_id || `assessment_${Date.now()}`,
    assessment_type: editingAssessment?.assessment_type || "initial" as "initial" | "periodic" | "targeted" | "compliance",
    status: editingAssessment?.status || "draft" as AssessmentStatus,
    
    // Metadata
    created_by: editingAssessment?.metadata?.created_by || "",
    assessed_by: editingAssessment?.metadata?.assessed_by || "",
    approved_by: editingAssessment?.metadata?.approved_by || "",
    start_date: editingAssessment?.metadata?.assessment_period?.start_date || "",
    end_date: editingAssessment?.metadata?.assessment_period?.end_date || "",
    scope: editingAssessment?.metadata?.scope?.join(", ") || "",
    exclusions: editingAssessment?.metadata?.exclusions?.join(", ") || "",
    
    // Methodology
    frameworks: editingAssessment?.methodology?.framework?.join(", ") || "",
    assessment_approach: editingAssessment?.methodology?.assessment_approach || "hybrid" as "questionnaire" | "interview" | "technical_review" | "hybrid",
    evidence_requirements: editingAssessment?.methodology?.evidence_requirements?.join(", ") || "",
    
    // Results
    overall_score: editingAssessment?.results?.overall_score || 0,
    maturity_level: editingAssessment?.results?.maturity_level || "initial" as "initial" | "developing" | "defined" | "managed" | "optimizing",
    
    // Findings
    strengths: editingAssessment?.findings?.strengths?.join(", ") || "",
    weaknesses: editingAssessment?.findings?.weaknesses?.join(", ") || "",
    
    // Action Plan
    quick_wins: editingAssessment?.action_plan?.quick_wins?.join(", ") || "",
    strategic_improvements: editingAssessment?.action_plan?.strategic_improvements?.join(", ") || "",
  });
  
  const [currentSection, setCurrentSection] = useState(0);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!fields.assessment_id || !fields.created_by) {
      setError("Assessment ID and created by are required.");
      return;
    }

    try {
      const currentDate = new Date().toISOString();
      
      const assessment: SecurityAssessment = {
        assessment_id: fields.assessment_id,
        assessment_type: fields.assessment_type,
        status: fields.status,
        
        metadata: {
          created_at: editingAssessment?.metadata?.created_at || currentDate,
          updated_at: currentDate,
          created_by: fields.created_by,
          assessed_by: fields.assessed_by || undefined,
          approved_by: fields.approved_by || undefined,
          assessment_period: {
            start_date: fields.start_date || currentDate,
            end_date: fields.end_date || currentDate,
          },
          scope: fields.scope.split(",").map(s => s.trim()).filter(s => s),
          exclusions: fields.exclusions.split(",").map(s => s.trim()).filter(s => s),
        },
        
        methodology: {
          framework: fields.frameworks.split(",").map(s => s.trim()).filter(s => s) as ComplianceFramework[],
          assessment_approach: fields.assessment_approach,
          evidence_requirements: fields.evidence_requirements.split(",").map(s => s.trim()).filter(s => s),
          scoring_criteria: {},
        },
        
        results: {
          overall_score: fields.overall_score,
          maturity_level: fields.maturity_level,
          domain_scores: {},
          control_assessments: {},
        },
        
        findings: {
          strengths: fields.strengths.split(",").map(s => s.trim()).filter(s => s),
          weaknesses: fields.weaknesses.split(",").map(s => s.trim()).filter(s => s),
          critical_gaps: [],
        },
        
        action_plan: {
          remediation_roadmap: [],
          quick_wins: fields.quick_wins.split(",").map(s => s.trim()).filter(s => s),
          strategic_improvements: fields.strategic_improvements.split(",").map(s => s.trim()).filter(s => s),
        },
      };

      onSave(assessment);
      onClose();
    } catch {
      setError("Failed to save security assessment");
    }
  };

  const inputClasses = "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary-500";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  const sections = [
    "Basic Information",
    "Metadata", 
    "Methodology",
    "Results",
    "Findings",
    "Action Plan"
  ];

  const renderSection = () => {
    switch (currentSection) {
      case 0: // Basic Information
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Assessment ID *</label>
                <input
                  type="text"
                  name="assessment_id"
                  value={fields.assessment_id}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Assessment Type</label>
                <select
                  name="assessment_type"
                  value={fields.assessment_type}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="initial">Initial</option>
                  <option value="periodic">Periodic</option>
                  <option value="targeted">Targeted</option>
                  <option value="compliance">Compliance</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClasses}>Status</label>
              <select
                name="status"
                value={fields.status}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="draft">Draft</option>
                <option value="in_progress">In Progress</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        );

      case 1: // Metadata
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClasses}>Created By *</label>
                <input
                  type="text"
                  name="created_by"
                  value={fields.created_by}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Assessed By</label>
                <input
                  type="text"
                  name="assessed_by"
                  value={fields.assessed_by}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Approved By</label>
                <input
                  type="text"
                  name="approved_by"
                  value={fields.approved_by}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Assessment Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={fields.start_date.split('T')[0]}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Assessment End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={fields.end_date.split('T')[0]}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Scope (comma-separated)</label>
              <input
                type="text"
                name="scope"
                value={fields.scope}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Web applications, Network infrastructure, Physical security"
              />
            </div>
            <div>
              <label className={labelClasses}>Exclusions (comma-separated)</label>
              <input
                type="text"
                name="exclusions"
                value={fields.exclusions}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Production databases, Legacy systems"
              />
            </div>
          </div>
        );

      case 2: // Methodology
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Frameworks (comma-separated)</label>
              <input
                type="text"
                name="frameworks"
                value={fields.frameworks}
                onChange={handleChange}
                className={inputClasses}
                placeholder="ISM, NIST, ISO27001, SOC2, GDPR"
              />
            </div>
            <div>
              <label className={labelClasses}>Assessment Approach</label>
              <select
                name="assessment_approach"
                value={fields.assessment_approach}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="questionnaire">Questionnaire</option>
                <option value="interview">Interview</option>
                <option value="technical_review">Technical Review</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Evidence Requirements (comma-separated)</label>
              <textarea
                name="evidence_requirements"
                value={fields.evidence_requirements}
                onChange={handleChange}
                rows={3}
                className={inputClasses}
                placeholder="Policies and procedures, Technical configurations, Screenshots"
              />
            </div>
          </div>
        );

      case 3: // Results
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Overall Score (0-100)</label>
                <input
                  type="number"
                  name="overall_score"
                  value={fields.overall_score}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Maturity Level</label>
                <select
                  name="maturity_level"
                  value={fields.maturity_level}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="initial">Initial</option>
                  <option value="developing">Developing</option>
                  <option value="defined">Defined</option>
                  <option value="managed">Managed</option>
                  <option value="optimizing">Optimizing</option>
                </select>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h4 className="text-md font-medium text-secondary-200 mb-3">
                Assessment Details
              </h4>
              <p className="text-gray-400 text-sm">
                Domain scores and control assessments can be managed in detailed assessment pages.
              </p>
            </div>
          </div>
        );

      case 4: // Findings
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Strengths (comma-separated)</label>
              <textarea
                name="strengths"
                value={fields.strengths}
                onChange={handleChange}
                rows={3}
                className={inputClasses}
                placeholder="Strong access controls, Regular backups, Security awareness"
              />
            </div>
            <div>
              <label className={labelClasses}>Weaknesses (comma-separated)</label>
              <textarea
                name="weaknesses"
                value={fields.weaknesses}
                onChange={handleChange}
                rows={3}
                className={inputClasses}
                placeholder="Outdated systems, Lack of monitoring, Insufficient training"
              />
            </div>
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h4 className="text-md font-medium text-secondary-200 mb-3">
                Critical Gaps
              </h4>
              <p className="text-gray-400 text-sm">
                Critical gaps with detailed remediation steps can be managed separately.
              </p>
            </div>
          </div>
        );

      case 5: // Action Plan
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Quick Wins (comma-separated)</label>
              <textarea
                name="quick_wins"
                value={fields.quick_wins}
                onChange={handleChange}
                rows={3}
                className={inputClasses}
                placeholder="Enable MFA, Update passwords, Install patches"
              />
            </div>
            <div>
              <label className={labelClasses}>Strategic Improvements (comma-separated)</label>
              <textarea
                name="strategic_improvements"
                value={fields.strategic_improvements}
                onChange={handleChange}
                rows={3}
                className={inputClasses}
                placeholder="Implement SIEM, Security training program, Risk management framework"
              />
            </div>
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h4 className="text-md font-medium text-secondary-200 mb-3">
                Remediation Roadmap
              </h4>
              <p className="text-gray-400 text-sm">
                Detailed remediation roadmap with timelines and responsibilities can be managed separately.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <div className="text-white max-h-[80vh] overflow-auto scrollbar-hide">
        <h2 className="text-2xl font-bold text-secondary-300 mb-6">
          {editingAssessment ? "Edit Security Assessment" : "Create Security Assessment"}
        </h2>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {sections.map((section, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSection(index)}
              className={`px-3 py-1 rounded text-sm ${
                currentSection === index 
                  ? 'bg-secondary-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <h3 className="text-lg font-semibold text-secondary-300 mb-4">
              {sections[currentSection]}
            </h3>
            {renderSection()}
          </div>

          {/* Navigation and Form Actions */}
          <div className="flex justify-between items-center pt-4">
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
                disabled={currentSection === sections.length - 1}
              >
                Next
              </Button>
            </div>
            
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingAssessment ? "Update Assessment" : "Create Assessment"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}

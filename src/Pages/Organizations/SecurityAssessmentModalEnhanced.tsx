import { useState } from "react";
import Button from "../../components/Common/Button";
import Modal from "../../components/Common/Modal";
import PaymentSection from "../../components/Common/PaymentSection";
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

export default function SecurityAssessmentModalEnhanced({ 
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
    const { name, value, type } = e.target;
    setFields(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
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
    } catch (error) {
      console.error("Failed to save assessment:", error);
      setError("Failed to create security assessment.");
    }
  };

  const sections = [
    { title: "Basic Information", fields: ["assessment_id", "assessment_type", "status"] },
    { title: "Metadata", fields: ["created_by", "assessed_by", "approved_by", "start_date", "end_date"] },
    { title: "Scope", fields: ["scope", "exclusions"] },
    { title: "Methodology", fields: ["frameworks", "assessment_approach", "evidence_requirements"] },
    { title: "Results", fields: ["overall_score", "maturity_level"] },
    { title: "Findings", fields: ["strengths", "weaknesses"] },
    { title: "Action Plan", fields: ["quick_wins", "strategic_improvements"] },
  ];

  const currentSectionFields = sections[currentSection]?.fields || [];

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <div className="text-white max-h-[90vh] overflow-auto scrollbar-hide">
        <h2 className="text-xl font-bold text-blue-300 mb-4">
          {editingAssessment ? "Edit Security Assessment" : "Create Security Assessment"}
        </h2>
        
        {/* Section Navigation */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {sections.map((section, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSection(index)}
              className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
                currentSection === index 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Current Section Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-300 mb-4">
              {sections[currentSection]?.title}
            </h3>
            
            {currentSectionFields.map((fieldName) => {
              const isTextArea = fieldName.includes('scope') || fieldName.includes('exclusions') || 
                               fieldName.includes('evidence_requirements') || fieldName.includes('strengths') ||
                               fieldName.includes('weaknesses') || fieldName.includes('quick_wins') ||
                               fieldName.includes('strategic_improvements');
              const isSelect = fieldName.includes('type') || fieldName.includes('status') || 
                              fieldName.includes('approach') || fieldName.includes('maturity_level');
              const isNumber = fieldName.includes('score');
              const isDate = fieldName.includes('date');

              const getSelectOptions = () => {
                if (fieldName === 'assessment_type') {
                  return ["initial", "periodic", "targeted", "compliance"];
                }
                if (fieldName === 'status') {
                  return ["draft", "in_progress", "review", "completed", "approved"];
                }
                if (fieldName === 'assessment_approach') {
                  return ["questionnaire", "interview", "technical_review", "hybrid"];
                }
                if (fieldName === 'maturity_level') {
                  return ["initial", "developing", "defined", "managed", "optimizing"];
                }
                return [];
              };

              return (
                <div key={fieldName} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 capitalize">
                    {fieldName.replace(/_/g, ' ')}
                    {["assessment_id", "created_by"].includes(fieldName) && " *"}
                  </label>
                  {isTextArea ? (
                    <textarea
                      name={fieldName}
                      value={fields[fieldName as keyof typeof fields] as string}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 border border-blue-900 text-white min-h-[100px]"
                      placeholder={`Enter ${fieldName.replace(/_/g, ' ')}`}
                    />
                  ) : isSelect ? (
                    <select
                      name={fieldName}
                      value={fields[fieldName as keyof typeof fields] as string}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 border border-blue-900 text-white"
                    >
                      {getSelectOptions().map((option) => (
                        <option key={option} value={option}>
                          {option.replace(/_/g, ' ').charAt(0).toUpperCase() + option.replace(/_/g, ' ').slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={isNumber ? "number" : isDate ? "datetime-local" : "text"}
                      name={fieldName}
                      value={fields[fieldName as keyof typeof fields]}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 border border-blue-900 text-white"
                      placeholder={`Enter ${fieldName.replace(/_/g, ' ')}`}
                      required={["assessment_id", "created_by"].includes(fieldName)}
                      min={isNumber ? 0 : undefined}
                      max={isNumber ? 100 : undefined}
                      step={isNumber ? 0.1 : undefined}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center space-x-4 border-t border-gray-700 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 0}
            >
              Previous
            </Button>
            
            <span className="text-gray-400 text-sm">
              {currentSection + 1} of {sections.length}
            </span>
            
            {currentSection === sections.length - 1 ? (
              <div className="flex space-x-2">
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
            ) : (
              <Button
                type="button"
                onClick={nextSection}
              >
                Next
              </Button>
            )}
          </div>

          {/* Payment Section - Only show on the last section */}
          {currentSection === sections.length - 1 && (
            <div className="mt-6 border-t border-gray-700 pt-6">
              <PaymentSection
                paymentData={{
                  amount: 299.99,
                  client_name: "admin",
                  tier: "L1",
                  payment_type: "registration",
                  partner_code: "CYBER20",
                }}
                title="Payment Required - Security Assessment"
                description="Complete your payment to perform the comprehensive security assessment. This evaluation will provide detailed insights into your organization's security posture."
                onPaymentSuccess={() => {
                  console.log("Payment successful for security assessment");
                  // You could trigger the assessment creation here or show a success message
                }}
              />
            </div>
          )}
        </form>
      </div>
    </Modal>
  );
}

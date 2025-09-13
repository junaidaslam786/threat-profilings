export interface ComplianceFramework {
  value: string;
  label: string;
  description?: string;
}

export const COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  // Australian/Asia-Pacific
  { value: "ISM", label: "ISM - Information Security Manual", description: "Australian Government Information Security Manual" },
  { value: "ACSC_ESSENTIAL_EIGHT", label: "ACSC Essential Eight", description: "Australian Cyber Security Centre Essential Eight" },
  // { value: "ASD_TOP_4", label: "ASD Top 4", description: "Australian Signals Directorate Top 4 Strategies" },
  // { value: "PRIVACY_ACT_1988", label: "Privacy Act 1988 (Australia)", description: "Australian Privacy Act 1988" },
  
  // // US Standards
  // { value: "NIST", label: "NIST Cybersecurity Framework", description: "National Institute of Standards and Technology" },
  // { value: "NIST_800_53", label: "NIST SP 800-53", description: "Security and Privacy Controls for Information Systems" },
  // { value: "NIST_800_171", label: "NIST SP 800-171", description: "Controlled Unclassified Information" },
  // { value: "FedRAMP", label: "FedRAMP", description: "Federal Risk and Authorization Management Program" },
  // { value: "FISMA", label: "FISMA", description: "Federal Information Security Management Act" },
  // { value: "HIPAA", label: "HIPAA", description: "Health Insurance Portability and Accountability Act" },
  // { value: "SOX", label: "SOX", description: "Sarbanes-Oxley Act" },
  // { value: "GLBA", label: "GLBA", description: "Gramm-Leach-Bliley Act" },
  // { value: "FFIEC", label: "FFIEC", description: "Federal Financial Institutions Examination Council" },
  
  // // International Standards
  // { value: "ISO27001", label: "ISO 27001", description: "Information Security Management Systems" },
  // { value: "ISO27002", label: "ISO 27002", description: "Code of Practice for Information Security Controls" },
  // { value: "ISO27017", label: "ISO 27017", description: "Cloud Security" },
  // { value: "ISO27018", label: "ISO 27018", description: "Cloud Privacy" },
  // { value: "ISO22301", label: "ISO 22301", description: "Business Continuity Management" },
  
  // // SOC Frameworks
  // { value: "SOC1", label: "SOC 1", description: "Service Organization Control 1" },
  // { value: "SOC2", label: "SOC 2", description: "Service Organization Control 2" },
  // { value: "SOC3", label: "SOC 3", description: "Service Organization Control 3" },
  
  // // Privacy Regulations
  // { value: "GDPR", label: "GDPR", description: "General Data Protection Regulation (EU)" },
  // { value: "CCPA", label: "CCPA", description: "California Consumer Privacy Act" },
  // { value: "PIPEDA", label: "PIPEDA", description: "Personal Information Protection and Electronic Documents Act (Canada)" },
  // { value: "LGPD", label: "LGPD", description: "Lei Geral de Proteção de Dados (Brazil)" },
  
  // // Industry-Specific
  // { value: "PCI_DSS", label: "PCI DSS", description: "Payment Card Industry Data Security Standard" },
  // { value: "SWIFT_CSP", label: "SWIFT CSP", description: "SWIFT Customer Security Programme" },
  // { value: "NERC_CIP", label: "NERC CIP", description: "North American Electric Reliability Corporation Critical Infrastructure Protection" },
  // { value: "IEC_62443", label: "IEC 62443", description: "Industrial Communication Networks - Network and System Security" },
  
  // // Cloud & Technology
  // { value: "CSA_CCM", label: "CSA CCM", description: "Cloud Security Alliance Cloud Controls Matrix" },
  // { value: "CSA_STAR", label: "CSA STAR", description: "Cloud Security Alliance Security Trust Assurance and Risk" },
  // { value: "AWS_SOC", label: "AWS SOC", description: "Amazon Web Services SOC Compliance" },
  // { value: "AZURE_SOC", label: "Azure SOC", description: "Microsoft Azure SOC Compliance" },
  // { value: "GCP_SOC", label: "GCP SOC", description: "Google Cloud Platform SOC Compliance" },
  
  // // European Standards
  // { value: "ENISA", label: "ENISA", description: "European Union Agency for Cybersecurity" },
  // { value: "NIS_DIRECTIVE", label: "NIS Directive", description: "Network and Information Systems Directive (EU)" },
  // { value: "CYBER_ESSENTIALS", label: "Cyber Essentials (UK)", description: "UK Government Cyber Essentials Scheme" },
  
  // // Other Regional
  // { value: "MTCS", label: "MTCS", description: "Multi-Tier Cloud Security (Singapore)" },
  // { value: "K_ISMS", label: "K-ISMS", description: "Korea Information Security Management System" },
  // { value: "JIS_Q_27001", label: "JIS Q 27001", description: "Japanese Industrial Standards Information Security" },
  
  // // Defense & Government
  // { value: "DISA_STIG", label: "DISA STIG", description: "Defense Information Systems Agency Security Technical Implementation Guide" },
  // { value: "CJIS", label: "CJIS", description: "Criminal Justice Information Services" },
  // { value: "ITAR", label: "ITAR", description: "International Traffic in Arms Regulations" },
  // { value: "EAR", label: "EAR", description: "Export Administration Regulations" },
  
  // // Specialized Frameworks
  // { value: "COBIT", label: "COBIT", description: "Control Objectives for Information and Related Technologies" },
  // { value: "COSO", label: "COSO", description: "Committee of Sponsoring Organizations of the Treadway Commission" },
  // { value: "ITIL", label: "ITIL", description: "Information Technology Infrastructure Library" },
  // { value: "TOGAF", label: "TOGAF", description: "The Open Group Architecture Framework" },
  
  // // Emerging Standards
  // { value: "ZERO_TRUST", label: "Zero Trust Architecture", description: "NIST Zero Trust Architecture" },
  // { value: "MITRE_ATTACK", label: "MITRE ATT&CK", description: "MITRE Adversarial Tactics, Techniques & Common Knowledge" },
  // { value: "CIS_CONTROLS", label: "CIS Controls", description: "Center for Internet Security Critical Security Controls" },
  
  // // Custom/Other
  // { value: "E8", label: "E8", description: "Essential Eight (Alternative)" },
  // { value: "CUSTOM", label: "Custom Framework", description: "Organization-specific compliance framework" }
];

// Helper function to get framework by value
export const getFrameworkByValue = (value: string): ComplianceFramework | undefined => {
  return COMPLIANCE_FRAMEWORKS.find(framework => framework.value === value);
};

// Helper function to get multiple frameworks by values
export const getFrameworksByValues = (values: string[]): ComplianceFramework[] => {
  return values.map(value => getFrameworkByValue(value)).filter(Boolean) as ComplianceFramework[];
};

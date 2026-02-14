import { useState, useEffect } from 'react';
import { X, Mail, Send, CheckCircle, AlertCircle, User, Building, MapPin, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { industriesData } from '../lib/industries-data';
import type { Violation } from '../lib/types';

interface AutomatedActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  violation: Violation | null;
}

type EmailTone = 'formal' | 'urgent' | 'diplomatic';

export function AutomatedActionModal({ isOpen, onClose, violation }: AutomatedActionModalProps) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [emailTone, setEmailTone] = useState<EmailTone>('formal');
  const [generating, setGenerating] = useState(false);
  const [emailContent, setEmailContent] = useState<string>('');

  // Find company email from industries data
  const getCompanyInfo = () => {
    if (!violation) return null;
    const industry = industriesData.find(ind => ind.companyName === violation.industry);
    return industry ? {
      email: industry.email,
      contactPerson: industry.contactPerson,
      phone: industry.phone
    } : null;
  };

  const companyInfo = getCompanyInfo();

  // Authority details based on violation severity
  const getAuthority = () => {
    if (!violation) return null;
    switch (violation.severity) {
      case 'critical':
        return {
          name: 'State Pollution Control Board',
          email: 'cpcb.chhattisgarh@gov.in',
          designation: 'Chief Environmental Officer',
          department: 'Chhattisgarh Environment Conservation Board'
        };
      case 'high':
        return {
          name: 'District Industrial Officer',
          email: 'dio.raipur@cgstate.gov.in',
          designation: 'District Industrial Officer',
          department: 'Industries Department, Raipur'
        };
      default:
        return {
          name: 'Industrial Area Supervisor',
          email: 'supervisor.industrial@cgstate.gov.in',
          designation: 'Area Supervisor',
          department: 'Industrial Monitoring Cell, Naya Raipur'
        };
    }
  };

  const authority = getAuthority();

  // AI-Powered Email Content Generator with Unique Content
  const generateAIEmail = (tone: EmailTone) => {
    if (!violation || !authority) return '';
    
    const violationType = violation.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    // Generate unique timestamp and reference
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const uniqueRef = `CG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    // Randomized AI variations for natural language
    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    
    // AI-generated varied greetings
    const getGreeting = () => {
      const greetings = {
        formal: [
          `Dear ${authority.designation},`,
          `Respected ${authority.designation},`,
          `To: ${authority.designation}`,
          `Attention: ${authority.designation}`,
        ],
        urgent: [
          `🚨 URGENT ALERT - ${authority.designation}`,
          `⚠️ IMMEDIATE ATTENTION REQUIRED - ${authority.designation}`,
          `PRIORITY ALERT for ${authority.designation}`,
          `CRITICAL NOTIFICATION - ${authority.designation}`,
        ],
        diplomatic: [
          `Honoured ${authority.designation},`,
          `Dear Respected ${authority.designation},`,
          `With warm regards to ${authority.designation},`,
          `Esteemed ${authority.designation},`,
        ]
      };
      return getRandom(greetings[tone]);
    };

    // AI-generated varied introductions
    const getIntroduction = () => {
      const intros = {
        formal: [
          `This notification is being sent from the Chhattisgarh Industrial Land Monitoring System regarding a compliance matter that requires your attention.`,
          `We are writing to inform you about a compliance violation detected through our satellite-based monitoring infrastructure.`,
          `Our automated monitoring system has identified a compliance issue that necessitates your immediate review and action.`,
          `This communication serves to notify you of a land use violation flagged by our GIS monitoring platform.`,
        ],
        urgent: [
          `Our monitoring system has detected a critical violation requiring IMMEDIATE regulatory intervention.`,
          `An urgent compliance breach has been identified that demands your prompt attention and swift action.`,
          `TIME-SENSITIVE ALERT: A serious violation has been detected that requires urgent response.`,
          `PRIORITY MATTER: Critical non-compliance detected requiring immediate action to prevent escalation.`,
        ],
        diplomatic: [
          `We hope this message finds you in good health. We are reaching out regarding a matter that has come to our attention through our monitoring system.`,
          `We trust this finds you well. We would like to bring to your kind notice a compliance matter that may benefit from your expert guidance.`,
          `It is with great respect that we write to share information about a monitoring alert that may require your valuable attention.`,
          `We value our collaborative relationship and wish to inform you about a matter detected by our monitoring infrastructure.`,
        ]
      };
      return getRandom(intros[tone]);
    };

    // AI-generated unique recommendations with variations
    const getDetailedRecommendations = () => {
      const actions = {
        'boundary-encroachment': [
          `• Deploy certified survey team with GPS equipment within 24-48 hours\n• Conduct precise boundary demarcation using Total Station\n• Issue formal notice to industry management citing specific deviations\n• Schedule joint inspection with industry representatives\n• Prepare detailed survey report with photographic evidence`,
          `• Initiate immediate ground verification with licensed surveyors\n• Compare current boundaries against approved layout plans\n• Document encroachment extent with geo-tagged photographs\n• Issue show-cause notice under relevant sections\n• Recommend corrective action timeline of 15-30 days`,
          `• Arrange urgent site inspection with district surveyor\n• Verify plot boundaries against registered documents\n• Prepare encroachment assessment report\n• Coordinate with revenue department for records verification\n• Initiate compliance proceedings as per industrial policy`,
        ],
        'unauthorized-construction': [
          `• Issue immediate stop-work order for unauthorized structures\n• Conduct structural safety assessment by certified engineer\n• Verify construction against approved building plans\n• Inspect environmental and safety compliance\n• Initiate penalty proceedings under relevant sections`,
          `• Deploy inspection team for immediate site assessment\n• Document unauthorized construction with measurements\n• Review building permission records and approvals\n• Issue show-cause notice with photographic evidence\n• Consider temporary operations suspension if risks identified`,
          `• Arrange emergency site visit with building inspectors\n• Assess structural integrity and safety compliance\n• Compare built-up area versus approved plans\n• Issue formal violation notice with rectification timeline\n• Monitor for immediate cessation of unauthorized work`,
        ],
        'land-use-change': [
          `• Verify current land usage against industrial classification\n• Review environmental clearance and NOC compliance\n• Inspect for unauthorized activity not covered in license\n• Issue notice for land use verification\n• Recommend EIA update if activity changed substantially`,
          `• Conduct comprehensive land use audit\n• Compare current operations with approved industrial category\n• Review zoning compliance and permitted activities\n• Coordinate with pollution control board for clearances\n• Initiate corrective measures or re-approval process`,
          `• Schedule detailed site inspection for activity verification\n• Cross-check operations against approved project report\n• Assess environmental impact of current usage\n• Review all statutory clearances and permissions\n• Issue compliance notice with evidence documentation`,
        ],
        'environmental': [
          `• Coordinate immediate inspection with State Pollution Control Board\n• Conduct air, water, and soil quality assessment\n• Review waste management and disposal practices\n• Document environmental violations with laboratory analysis\n• Initiate penalty proceedings and remediation orders`,
          `• Deploy environmental monitoring team urgently\n• Collect samples for comprehensive laboratory testing\n• Inspect effluent treatment and waste disposal systems\n• Review environmental management plan compliance\n• Issue immediate corrective action directives`,
          `• Arrange joint inspection with CPCB officials\n• Assess environmental impact and pollution levels\n• Verify compliance with consent to operate conditions\n• Document breaches with photographic and video evidence\n• Recommend temporary closure if severe violations found`,
        ]
      };
      
      const type = violation.type as keyof typeof actions;
      const recommendations = actions[type] || actions['boundary-encroachment'];
      return getRandom(recommendations);
    };

    // AI-generated severity descriptions with variations
    const getSeverityAnalysis = () => {
      const analyses = {
        critical: [
          `⚠️ CRITICAL SEVERITY: This violation poses significant risk to public safety, environment, or legal compliance. Immediate intervention is mandatory to prevent serious consequences.`,
          `🚨 HIGHEST PRIORITY: The detected non-compliance requires urgent regulatory action. Delay may result in irreversible damage or legal repercussions.`,
          `❗ EMERGENCY STATUS: This represents a severe breach requiring immediate attention. Potential for significant environmental or safety implications exists.`,
        ],
        high: [
          `⚠️ HIGH SEVERITY: This violation demands prompt attention and corrective measures. Delayed response may lead to escalation and penalties.`,
          `🔴 PRIORITY LEVEL: Significant non-compliance detected requiring swift regulatory intervention to prevent further violations.`,
          `⚡ HIGH PRIORITY ALERT: Substantial deviation from approved parameters detected. Immediate investigation and action recommended.`,
        ],
        medium: [
          `🟡 MEDIUM SEVERITY: This matter requires timely investigation and resolution through standard regulatory procedures.`,
          `📋 MODERATE CONCERN: Compliance deviation noted that should be addressed within normal regulatory timeframes.`,
          `⚖️ STANDARD PRIORITY: Notable non-compliance requiring routine inspection and corrective action enforcement.`,
        ],
        low: [
          `🟢 LOW SEVERITY: Minor deviation detected requiring attention through routine compliance procedures.`,
          `📌 ROUTINE MATTER: This issue should be addressed through standard monitoring and verification processes.`,
          `✓ ADMINISTRATIVE REVIEW: Minor non-compliance noted for routine follow-up and resolution.`,
        ]
      };
      
      const severity = violation.severity as keyof typeof analyses;
      return getRandom(analyses[severity]);
    };

    // AI-generated unique closing statements
    const getClosing = () => {
      const closings = {
        formal: [
          `We request your prompt attention to this matter and look forward to your action plan.\n\nPlease acknowledge receipt and provide estimated resolution timeline.`,
          `Your immediate review and appropriate action on this matter would be highly appreciated.\n\nKindly update the monitoring system with your response and action taken.`,
          `We count on your cooperation in maintaining industrial compliance standards.\n\nPlease confirm receipt and share your proposed course of action.`,
        ],
        urgent: [
          `IMMEDIATE ACTION IS IMPERATIVE to address this critical violation.\n\nResponse within 24 hours is mandatory. Delays will be escalated to higher authorities.`,
          `This matter cannot be delayed. URGENT RESPONSE REQUIRED.\n\nPlease treat this as highest priority and coordinate immediate action.`,
          `TIME-CRITICAL SITUATION requires your immediate intervention.\n\nSwift action is essential to prevent further violations and potential legal consequences.`,
        ],
        diplomatic: [
          `We remain grateful for your continued support in maintaining compliance excellence.\n\nYour expert guidance in resolving this matter would be deeply appreciated.`,
          `We value your cooperation and look forward to your wisdom in addressing this concern.\n\nThank you for your dedication to maintaining high compliance standards.`,
          `Your collaboration in this matter is highly valued and appreciated.\n\nWe trust in your expertise to guide appropriate resolution of this issue.`,
        ]
      };
      return getRandom(closings[tone]);
    };

    // AI-generated personalized opening context
    const getContextParagraph = () => {
      const contexts = [
        `Through our advanced satellite-based monitoring infrastructure and AI-powered analysis system, a compliance deviation has been identified at the mentioned industrial facility.`,
        `Our continuous GIS monitoring platform has flagged a potential violation through automated change detection algorithms and manual verification protocols.`,
        `An anomaly has been detected by our real-time monitoring system during routine surveillance of industrial land parcels in the Chhattisgarh region.`,
        `Leveraging high-resolution satellite imagery and machine learning analytics, our system has identified a compliance concern requiring investigation.`,
      ];
      return getRandom(contexts);
    };

    // Build unique AI-generated email
    return `${getGreeting()}

${getIntroduction()}

${getContextParagraph()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 VIOLATION DETAILS & REFERENCE INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

System Reference ID: ${uniqueRef}
Official Violation ID: ${violation.id}
Plot Reference: ${violation.plotId}
Industry Name: ${violation.industry}
Violation Category: ${violationType}
Severity Classification: ${violation.severity.toUpperCase()}
Detection Timestamp: ${timestamp}
Detection Date: ${violation.dateDetected}
Current Status: ${violation.status.replace(/-/g, ' ').toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 DETAILED VIOLATION DESCRIPTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${violation.description}

${violation.deviationPercent ? `📊 Quantitative Assessment: ${violation.deviationPercent}% deviation from approved/registered parameters

Analysis Method: Satellite imagery comparison with GIS registered boundaries
Confidence Level: High (Verified through multi-temporal analysis)` : 'Assessment: Based on comprehensive satellite imagery analysis and ground verification protocols'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚖️ SEVERITY ASSESSMENT & REGULATORY IMPLICATIONS  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${getSeverityAnalysis()}

Regulatory Framework: Chhattisgarh Industrial Policy 2024 & Environmental Acts
Applicable Sections: Land Use Regulations, Industrial Compliance Norms
Potential Implications: ${tone === 'urgent' ? 'Penalty proceedings, operations suspension, legal action' : 'Show-cause notice, corrective action mandate, compliance review'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ RECOMMENDED ACTION PLAN & NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${getDetailedRecommendations()}

${tone === 'urgent' ? '⏱️ TIMELINE: Immediate action within 24-48 hours\n🔔 ESCALATION: Failure to respond will trigger higher authority involvement' : '📅 Suggested Timeline: Action initiation within 7-15 working days\n📞 Coordination: Please schedule inspection at earliest convenience'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${companyInfo ? `🏭 CONCERNED INDUSTRY - CONTACT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Industry: ${violation.industry}
Contact Person: ${companyInfo.contactPerson}
Official Email: ${companyInfo.email}
Contact Number: ${companyInfo.phone}

Note: Company has been included in this communication for transparency and swift resolution.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
` : ''}
📌 SYSTEM INFORMATION & ACCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dashboard Access: https://monitoring.cgstate.gov.in
Login Credentials: Use your official government credentials
Support Email: support@cgmonitoring.gov.in
Helpline: 1800-233-XXXX (Toll Free)

For detailed satellite imagery, site maps, and historical analysis, 
please access the violation details through the monitoring dashboard.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${getClosing()}

With regards,

${getRandom(['Automated Compliance System', 'GIS Monitoring Division', 'Satellite Surveillance Unit', 'Compliance Monitoring Cell'])}
Chhattisgarh Industrial Land Monitoring Project
Department of Industries, Government of Chhattisgarh
Email: monitoring@cgstate.gov.in | Web: www.cgmonitoring.gov.in

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DISCLAIMER: This email is system-generated based on satellite data analysis. 
For official correspondence and legal proceedings, please refer to formal notices 
issued by the competent authority through registered channels.`;
  };

  // Generate initial email content when modal opens or tone changes
  useEffect(() => {
    if (isOpen && violation) {
      setEmailContent(generateAIEmail(emailTone));
    }
  }, [isOpen, violation, emailTone]);

  const handleRegenerateEmail = async () => {
    setGenerating(true);
    // Simulate AI generation with actual regeneration
    await new Promise(resolve => setTimeout(resolve, 800));
    setEmailContent(generateAIEmail(emailTone));
    setGenerating(false);
  };

  // Update email when tone changes
  const handleToneChange = (newTone: EmailTone) => {
    setEmailTone(newTone);
    setEmailContent(generateAIEmail(newTone));
  };

  const handleSendEmail = async () => {
    if (!violation || !authority) return;
    
    setSending(true);
    
    // Simulate email sending to authority (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSending(false);
    setSent(true);
    
    // Prepare email content
    const subject = encodeURIComponent(`URGENT: Compliance Violation Alert - ${violation.id} - ${violation.industry}`);
    const body = encodeURIComponent(emailContent);
    
    // Build recipient list
    const recipients = [authority.email];
    if (companyInfo?.email) {
      recipients.push(companyInfo.email);
    }
    const toEmails = recipients.join(',');
    
    // Open default email client with pre-filled content
    setTimeout(() => {
      window.location.href = `mailto:${toEmails}?subject=${subject}&body=${body}`;
    }, 1000);
    
    // Auto close modal after opening email client
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 3000);
  };

  // Early return after all hooks and function definitions
  if (!isOpen || !violation || !authority) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto border-slate-200 shadow-2xl">
        <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-red-50 to-orange-50 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 rounded-lg">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Automated Action - Email Authority
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  Violation: {violation.id}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={sending}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Success Message */}
          {sent && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-green-900 flex items-center gap-2">
                  Email Client Opening...
                  <ExternalLink className="h-4 w-4" />
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Your default email app will open with pre-filled content to both authority and company. This window will close automatically.
                </p>
              </div>
            </div>
          )}

          {/* Violation Summary */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Violation Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Type:</span>
                <p className="font-semibold text-slate-900 mt-1">
                  {violation.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </p>
              </div>
              <div>
                <span className="text-slate-600">Severity:</span>
                <p className="font-semibold text-red-600 mt-1 uppercase">
                  {violation.severity}
                </p>
              </div>
              <div>
                <span className="text-slate-600">Plot ID:</span>
                <p className="font-semibold text-slate-900 mt-1">{violation.plotId}</p>
              </div>
              <div>
                <span className="text-slate-600">Date Detected:</span>
                <p className="font-semibold text-slate-900 mt-1">{violation.dateDetected}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-600">Industry:</span>
                <p className="font-semibold text-slate-900 mt-1 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {violation.industry}
                </p>
              </div>
            </div>
          </div>

          {/* Authority Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <User className="h-5 w-5" />
              Designated Authority (Auto-Selected)
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {authority.designation.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{authority.designation}</p>
                  <p className="text-slate-600 text-xs">{authority.department}</p>
                </div>
              </div>
              <div className="pl-15">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="font-mono">{authority.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 mt-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span>Chhattisgarh State, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Information */}
          {companyInfo && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Contact (From Industries Registry)
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {violation.industry.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{violation.industry}</p>
                    <p className="text-slate-600 text-xs">{companyInfo.contactPerson}</p>
                  </div>
                </div>
                <div className="pl-15">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="h-4 w-4 text-orange-600" />
                    <span className="font-mono text-sm">{companyInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 mt-2">
                    <User className="h-4 w-4 text-orange-600" />
                    <span>{companyInfo.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Email Generator */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-purple-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI-Powered Email Generator
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerateEmail}
                disabled={generating}
                className="text-purple-700 border-purple-300 hover:bg-purple-100"
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-purple-600 border-t-transparent mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Regenerate
                  </>
                )}
              </Button>
            </div>
            
            <div>
              <p className="text-xs text-purple-700 mb-3">
                Select email tone for AI-generated content:
              </p>
              <div className="flex gap-2">
                <Button
                  variant={emailTone === 'formal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToneChange('formal')}
                  className={emailTone === 'formal' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-300 text-purple-700 hover:bg-purple-100'}
                >
                  📋 Formal
                </Button>
                <Button
                  variant={emailTone === 'urgent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToneChange('urgent')}
                  className={emailTone === 'urgent' ? 'bg-red-600 hover:bg-red-700' : 'border-red-300 text-red-700 hover:bg-red-100'}
                >
                  ⚠️ Urgent
                </Button>
                <Button
                  variant={emailTone === 'diplomatic' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToneChange('diplomatic')}
                  className={emailTone === 'diplomatic' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-300 text-blue-700 hover:bg-blue-100'}
                >
                  🤝 Diplomatic
                </Button>
              </div>
              <div className="mt-3 p-2 bg-white rounded border border-purple-200">
                <p className="text-xs text-slate-600">
                  {emailTone === 'formal' && '✓ Professional and structured format with clear action items'}
                  {emailTone === 'urgent' && '✓ High-priority language emphasizing immediate action required'}
                  {emailTone === 'diplomatic' && '✓ Polite and collaborative approach maintaining good relations'}
                </p>
              </div>
            </div>
          </div>

          {/* Email Preview */}
          <div className="border border-slate-200 rounded-lg">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-700">AI-Generated Email Preview</p>
                  <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {emailTone.charAt(0).toUpperCase() + emailTone.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Mail className="h-3 w-3" />
                  <span>
                    To: Authority{companyInfo && ' + Company'}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono bg-slate-50 p-4 rounded border border-slate-200 max-h-64 overflow-y-auto">
                {emailContent}
              </pre>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={sending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={sending || sent}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Opening Email App...
                </>
              ) : sent ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Email App Opening
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {companyInfo ? 'Send to Authority & Company' : 'Send to Authority'}
                </>
              )}
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded p-3">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-amber-800">
                  <strong>AI-Powered Action:</strong> The email content has been intelligently generated based on violation type, severity, and selected tone. 
                  This action will open your default email app with the AI-generated content addressed to {companyInfo ? 'both the designated authority and the company contact' : 'the designated authority'}. 
                </p>
                <p className="text-xs text-amber-700 mt-2">
                  You can review and edit the email before sending. All actions are logged for audit purposes.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

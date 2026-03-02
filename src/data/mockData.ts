import { Customer, LoanApplication, Transaction, RiskAlert } from '../types';

export interface KYCRequest {
  id: string;
  customerId: string;
  customerName: string;
  documentType: 'passport' | 'drivers_license' | 'national_id';
  status: 'pending' | 'verified' | 'rejected' | 'manual_review';
  riskScore: number;
  faceMatchScore: number; // 0-100
  docAuthenticityScore: number; // 0-100
  submittedDate: string;
  aiIssues: string[];
}

export interface EscalationCase {
  id: string;
  type: 'fraud' | 'loan' | 'kyc' | 'transaction';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'resolved' | 'investigating';
  subjectId: string; // ID of loan, customer, or transaction
  subjectName: string;
  aiSummary: string;
  aiConfidence: number;
  assignedTo?: string;
  createdDate: string;
}

export interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  target: string;
  timestamp: string;
  riskFlag: boolean; // AI detected unusual behavior
  aiReason?: string;
}

export const customers: Customer[] = [
  { id: 'C001', name: 'Alice Johnson', email: 'alice@example.com', phone: '+15550101', riskScore: 12, kycStatus: 'verified', segment: 'A', joinedDate: '2023-01-15' },
  { id: 'C002', name: 'Bob Smith', email: 'bob@example.com', phone: '+15550102', riskScore: 45, kycStatus: 'verified', segment: 'B', joinedDate: '2023-03-22' },
  { id: 'C003', name: 'Charlie Davis', email: 'charlie@example.com', phone: '+15550103', riskScore: 88, kycStatus: 'pending', segment: 'C', joinedDate: '2023-11-05' },
  { id: 'C004', name: 'Diana Evans', email: 'diana@example.com', phone: '+15550104', riskScore: 5, kycStatus: 'verified', segment: 'A', joinedDate: '2022-06-10' },
  { id: 'C005', name: 'Evan Wright', email: 'evan@example.com', phone: '+15550105', riskScore: 62, kycStatus: 'verified', segment: 'B', joinedDate: '2023-09-01' },
  { id: 'C006', name: 'Fiona Green', email: 'fiona@example.com', phone: '+15550106', riskScore: 95, kycStatus: 'rejected', segment: 'C', joinedDate: '2024-01-12' },
  { id: 'C007', name: 'George Hall', email: 'george@example.com', phone: '+15550107', riskScore: 25, kycStatus: 'verified', segment: 'B', joinedDate: '2023-05-18' },
  { id: 'C008', name: 'Hannah Lee', email: 'hannah@example.com', phone: '+15550108', riskScore: 78, kycStatus: 'verified', segment: 'C', joinedDate: '2023-12-01' },
];

export const loans: LoanApplication[] = [
  {
    id: 'L101',
    customerId: 'C001',
    customerName: 'Alice Johnson',
    amount: 5000,
    termMonths: 12,
    purpose: 'Home Improvement',
    status: 'approved',
    riskScore: 12,
    defaultProbability: 2,
    aiRecommendation: 'approve',
    aiReasoning: 'Strong credit history, low DTI ratio, stable income source.',
    appliedDate: '2024-02-10',
  },
  {
    id: 'L102',
    customerId: 'C003',
    customerName: 'Charlie Davis',
    amount: 15000,
    termMonths: 24,
    purpose: 'Business Expansion',
    status: 'escalated',
    riskScore: 88,
    defaultProbability: 35,
    aiRecommendation: 'escalate',
    aiReasoning: 'High requested amount relative to income. Recent large withdrawals detected. Requires manual review of business plan.',
    appliedDate: '2024-02-12',
  },
  {
    id: 'L103',
    customerId: 'C002',
    customerName: 'Bob Smith',
    amount: 2000,
    termMonths: 6,
    purpose: 'Emergency',
    status: 'pending',
    riskScore: 45,
    defaultProbability: 12,
    aiRecommendation: 'approve',
    aiReasoning: 'Moderate risk but amount is small and within micro-loan limits. Customer has good repayment history on previous smaller loans.',
    appliedDate: '2024-02-14',
  },
  {
    id: 'L104',
    customerId: 'C008',
    customerName: 'Hannah Lee',
    amount: 8000,
    termMonths: 18,
    purpose: 'Debt Consolidation',
    status: 'pending',
    riskScore: 78,
    defaultProbability: 22,
    aiRecommendation: 'escalate',
    aiReasoning: 'Risk score is borderline high. Multiple recent credit inquiries. Purpose is debt consolidation which indicates potential distress.',
    appliedDate: '2024-02-14',
  },
  {
    id: 'L105',
    customerId: 'C004',
    customerName: 'Diana Evans',
    amount: 25000,
    termMonths: 36,
    purpose: 'Vehicle Purchase',
    status: 'approved',
    riskScore: 5,
    defaultProbability: 1,
    aiRecommendation: 'approve',
    aiReasoning: 'Excellent credit score. High net worth individual. Collateralized loan.',
    appliedDate: '2024-02-11',
  },
];

export const transactions: Transaction[] = [
  { id: 'T001', customerId: 'C001', amount: 150.00, type: 'transfer', status: 'completed', timestamp: '2024-02-14T10:30:00Z', location: 'New York, US', device: 'iPhone 13', anomalyScore: 5 },
  { id: 'T002', customerId: 'C003', amount: 9500.00, type: 'withdrawal', status: 'flagged', timestamp: '2024-02-14T11:15:00Z', location: 'Lagos, NG', device: 'Unknown Android', anomalyScore: 92, flagReason: 'Large withdrawal from unusual location' },
  { id: 'T003', customerId: 'C002', amount: 45.50, type: 'bill_payment', status: 'completed', timestamp: '2024-02-14T12:00:00Z', location: 'London, UK', device: 'Pixel 7', anomalyScore: 10 },
  { id: 'T004', customerId: 'C006', amount: 1200.00, type: 'transfer', status: 'failed', timestamp: '2024-02-14T13:45:00Z', location: 'Moscow, RU', device: 'Windows PC', anomalyScore: 85, flagReason: 'Sanctioned region' },
  { id: 'T005', customerId: 'C001', amount: 2000.00, type: 'deposit', status: 'completed', timestamp: '2024-02-13T09:00:00Z', location: 'New York, US', device: 'iPhone 13', anomalyScore: 2 },
  { id: 'T006', customerId: 'C008', amount: 500.00, type: 'transfer', status: 'completed', timestamp: '2024-02-14T14:20:00Z', location: 'Seoul, KR', device: 'Samsung S23', anomalyScore: 15 },
  { id: 'T007', customerId: 'C003', amount: 100.00, type: 'transfer', status: 'completed', timestamp: '2024-02-13T10:00:00Z', location: 'New York, US', device: 'iPhone 12', anomalyScore: 5 },
  { id: 'T008', customerId: 'C003', amount: 9800.00, type: 'transfer', status: 'flagged', timestamp: '2024-02-14T11:20:00Z', location: 'Lagos, NG', device: 'Unknown Android', anomalyScore: 95, flagReason: 'Structuring: Just below reporting limit' },
];

export const alerts: RiskAlert[] = [
  { id: 'A001', type: 'fraud', severity: 'critical', message: 'Potential Account Takeover: Customer C003', timestamp: '2024-02-14T11:16:00Z', status: 'new' },
  { id: 'A002', type: 'loan_risk', severity: 'medium', message: 'Loan Default Probability Spike: Segment C', timestamp: '2024-02-14T08:00:00Z', status: 'investigating' },
  { id: 'A003', type: 'kyc', severity: 'high', message: 'Synthetic Identity Detected: Application #9921', timestamp: '2024-02-13T15:30:00Z', status: 'resolved' },
  { id: 'A004', type: 'system', severity: 'low', message: 'API Latency Warning: Risk Engine', timestamp: '2024-02-14T10:00:00Z', status: 'resolved' },
];

export const kycRequests: KYCRequest[] = [
  { id: 'K001', customerId: 'C003', customerName: 'Charlie Davis', documentType: 'passport', status: 'manual_review', riskScore: 85, faceMatchScore: 45, docAuthenticityScore: 60, submittedDate: '2024-02-14T09:00:00Z', aiIssues: ['Face mismatch detected', 'Potential photo manipulation'] },
  { id: 'K002', customerId: 'C005', customerName: 'Evan Wright', documentType: 'drivers_license', status: 'pending', riskScore: 15, faceMatchScore: 98, docAuthenticityScore: 99, submittedDate: '2024-02-14T10:30:00Z', aiIssues: [] },
  { id: 'K003', customerId: 'C006', customerName: 'Fiona Green', documentType: 'national_id', status: 'rejected', riskScore: 95, faceMatchScore: 12, docAuthenticityScore: 20, submittedDate: '2024-02-13T14:15:00Z', aiIssues: ['Document appears forged', 'Face does not match database'] },
];

export const escalations: EscalationCase[] = [
  { id: 'E001', type: 'fraud', priority: 'critical', status: 'open', subjectId: 'C003', subjectName: 'Charlie Davis', aiSummary: 'Multiple high-value transactions from new device in high-risk location (Lagos) within 10 minutes. Pattern matches known "Sim Swap" attack vector.', aiConfidence: 98, createdDate: '2024-02-14T11:30:00Z' },
  { id: 'E002', type: 'loan', priority: 'high', status: 'investigating', subjectId: 'L102', subjectName: 'Business Expansion Loan', aiSummary: 'Loan amount ($15k) exceeds automated limits for Segment C. Business plan text shows 85% similarity to rejected application L098.', aiConfidence: 82, createdDate: '2024-02-12T14:00:00Z' },
  { id: 'E003', type: 'kyc', priority: 'medium', status: 'open', subjectId: 'K001', subjectName: 'Charlie Davis KYC', aiSummary: 'Face match score (45%) below threshold (80%). Manual review required to confirm identity.', aiConfidence: 90, createdDate: '2024-02-14T09:15:00Z' },
];

export const auditLogs: AuditLog[] = [
  { id: 'AL001', adminName: 'Alex Admin', action: 'Viewed Customer Profile', target: 'C003', timestamp: '2024-02-14T11:45:00Z', riskFlag: false },
  { id: 'AL002', adminName: 'Alex Admin', action: 'Exported User Data', target: 'All Users (CSV)', timestamp: '2024-02-14T11:50:00Z', riskFlag: true, aiReason: 'Unusual bulk export time. User typically exports on Fridays.' },
  { id: 'AL003', adminName: 'Sarah Super', action: 'Approved Escalation', target: 'E001', timestamp: '2024-02-14T12:00:00Z', riskFlag: false },
  { id: 'AL004', adminName: 'System', action: 'Auto-Flagged Transaction', target: 'T002', timestamp: '2024-02-14T11:15:00Z', riskFlag: false },
];

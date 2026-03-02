export type UserRole = 'admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  riskScore: number; // 0-100
  kycStatus: 'pending' | 'verified' | 'rejected';
  segment: 'A' | 'B' | 'C'; // A = High Net Worth, B = Standard, C = Micro
  joinedDate: string;
}

export interface LoanApplication {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  termMonths: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  riskScore: number; // 0-100
  defaultProbability: number; // 0-100%
  aiRecommendation: 'approve' | 'reject' | 'escalate';
  aiReasoning: string;
  appliedDate: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  amount: number;
  type: 'transfer' | 'bill_payment' | 'withdrawal' | 'deposit';
  status: 'completed' | 'pending' | 'flagged' | 'failed';
  timestamp: string;
  location: string;
  device: string;
  anomalyScore: number; // 0-100, higher is more anomalous
  flagReason?: string;
}

export interface RiskAlert {
  id: string;
  type: 'fraud' | 'kyc' | 'loan_risk' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved';
}

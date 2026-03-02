// ═══════════════════════════════════════════════════════════════
// Agentic Workflow Types - Wema SmartAdmin
// ═══════════════════════════════════════════════════════════════

export type WorkflowTrigger =
  | 'loan_request'
  | 'transaction_incoming'
  | 'kyc_submission'
  | 'customer_support_ticket'
  | 'fraud_alert'
  | 'account_opening'
  | 'large_withdrawal'
  | 'compliance_check';

export type WorkflowStatus = 'active' | 'draft' | 'paused' | 'archived';

export type NodeType =
  | 'trigger'
  | 'condition'
  | 'ai_decision'
  | 'api_call'
  | 'action'
  | 'notification'
  | 'human_review'
  | 'delay'
  | 'loop';

export type ComparisonOperator =
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'greater_equal'
  | 'less_equal'
  | 'contains'
  | 'in_list'
  | 'between';

export type ActionType =
  | 'approve'
  | 'reject'
  | 'escalate'
  | 'flag'
  | 'freeze_account'
  | 'send_email'
  | 'send_sms'
  | 'call_api'
  | 'update_record'
  | 'create_alert'
  | 'assign_to_agent'
  | 'log_audit'
  | 'calculate_score';

// ─── Workflow Node Definitions ───────────────────────────────

export interface WorkflowCondition {
  field: string;
  operator: ComparisonOperator;
  value: string | number | boolean;
  label?: string;
}

export interface APICallConfig {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT';
  description: string;
  expectedResponse?: string;
  timeout?: number;
}

export interface AIDecisionConfig {
  model: string;
  prompt: string;
  factors: string[];
  confidenceThreshold: number;
  fallbackAction: ActionType;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  description?: string;
  position: { x: number; y: number };

  // Condition nodes
  conditions?: WorkflowCondition[];
  conditionLogic?: 'AND' | 'OR';

  // AI Decision nodes
  aiConfig?: AIDecisionConfig;

  // API Call nodes
  apiConfig?: APICallConfig;

  // Action nodes
  actionType?: ActionType;
  actionParams?: Record<string, string>;

  // Notification nodes
  notificationChannel?: 'email' | 'sms' | 'in_app' | 'slack';
  notificationTemplate?: string;

  // Delay nodes
  delayMinutes?: number;

  // Connections
  nextNodeId?: string;       // Default next node
  trueBranchId?: string;     // If condition is true
  falseBranchId?: string;    // If condition is false
  errorNodeId?: string;      // On error
}

// ─── Workflow Definition ────────────────────────────────────

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  status: WorkflowStatus;
  nodes: WorkflowNode[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  executionCount: number;
  avgExecutionTime: number; // seconds
  successRate: number; // percentage
  tags: string[];
}

// ─── Workflow Execution ─────────────────────────────────────

export type ExecutionStatus = 'running' | 'completed' | 'failed' | 'waiting_human' | 'cancelled';
export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface ExecutionStep {
  nodeId: string;
  nodeLabel: string;
  nodeType: NodeType;
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  duration?: number; // ms
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  aiReasoning?: string;
  error?: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  trigger: WorkflowTrigger;
  status: ExecutionStatus;
  subjectId: string;
  subjectName: string;
  steps: ExecutionStep[];
  startedAt: string;
  completedAt?: string;
  totalDuration?: number; // ms
  finalDecision?: string;
  aiConfidence?: number;
}

// ─── Workflow Templates ─────────────────────────────────────

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  category: string;
  icon: string;
  nodes: WorkflowNode[];
  estimatedTimeSaved: string;
  automationRate: string;
}

// ─── Trigger config labels ──────────────────────────────────

export const TRIGGER_LABELS: Record<WorkflowTrigger, string> = {
  loan_request: 'Loan Application Received',
  transaction_incoming: 'Transaction Initiated',
  kyc_submission: 'KYC Document Submitted',
  customer_support_ticket: 'Support Ticket Created',
  fraud_alert: 'Fraud Alert Triggered',
  account_opening: 'New Account Application',
  large_withdrawal: 'Large Withdrawal Request',
  compliance_check: 'Compliance Review Due',
};

export const TRIGGER_COLORS: Record<WorkflowTrigger, string> = {
  loan_request: 'bg-blue-500',
  transaction_incoming: 'bg-emerald-500',
  kyc_submission: 'bg-purple-500',
  customer_support_ticket: 'bg-amber-500',
  fraud_alert: 'bg-red-500',
  account_opening: 'bg-cyan-500',
  large_withdrawal: 'bg-orange-500',
  compliance_check: 'bg-indigo-500',
};

export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  trigger: 'Trigger',
  condition: 'Condition Check',
  ai_decision: 'AI Decision',
  api_call: 'API Call',
  action: 'Action',
  notification: 'Notification',
  human_review: 'Human Review',
  delay: 'Wait / Delay',
  loop: 'Loop',
};

// ═══════════════════════════════════════════════════════════════
// Agentic Workflow Engine - Wema SmartAdmin
// Simulates end-to-end agentic workflow execution
// ═══════════════════════════════════════════════════════════════

import {
  Workflow,
  WorkflowExecution,
  ExecutionStep,
  WorkflowNode,
  ExecutionStatus,
  StepStatus,
} from '../types/workflow';

type ExecutionCallback = (execution: WorkflowExecution) => void;

// ─── Simulated AI Reasoning ────────────────────────────────

const AI_REASONING_TEMPLATES: Record<string, string[]> = {
  loan_request: [
    'Analyzed credit history across 3 bureaus. DTI ratio is {score}%. Employment verified via API. Income stability score: {confidence}%.',
    'Cross-referenced customer profile with 12 risk factors. Behavioral pattern analysis shows consistent repayment history. Default probability: {score}%.',
    'Applied ensemble ML model (XGBoost + Neural Net). Feature importance: income_stability (0.34), credit_score (0.28), debt_ratio (0.22). Confidence: {confidence}%.',
  ],
  transaction_incoming: [
    'Transaction velocity check: {score} transactions in last 24h. Geo-anomaly score: {confidence}%. Device fingerprint matches known profile.',
    'Pattern analysis: Transaction amount ${amount} is within expected range for this merchant category. No velocity exceptions triggered.',
    'AML screening completed. PEP database check: Clear. Sanctions list: Clear. Risk score: {score}/100.',
  ],
  kyc_submission: [
    'Document OCR confidence: {confidence}%. Liveness check passed. Face match against ID photo: {score}% similarity.',
    'Cross-referenced government database via API. Name/DOB match confirmed. Address verification: {confidence}% confident.',
    'Synthetic identity detection model applied. Fraud probability: {score}%. Document tampering score: {confidence}/100.',
  ],
  fraud_alert: [
    'Anomaly detection triggered. Transaction deviates {score}σ from customer baseline. Geographic impossible travel detected.',
    'Neural network fraud model confidence: {confidence}%. Similar patterns found in {score} confirmed fraud cases.',
    'Real-time behavioral biometrics analysis: Keystroke pattern deviation {score}%. Mouse movement anomaly: {confidence}%.',
  ],
  customer_support_ticket: [
    'NLP sentiment analysis: {confidence}% negative. Topic classification: billing_dispute. Priority score: {score}/100.',
    'Customer history analysis: {score} previous tickets. Average resolution time: 2.3 days. Escalation likelihood: {confidence}%.',
    'Intent recognition confidence: {confidence}%. Matched to resolution template KB-{score}. Auto-resolution eligible.',
  ],
};

function getAIReasoning(trigger: string, score: number, confidence: number, amount?: number): string {
  const templates = AI_REASONING_TEMPLATES[trigger] || AI_REASONING_TEMPLATES.loan_request;
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template
    .replace('{score}', String(score))
    .replace('{confidence}', String(confidence))
    .replace('{amount}', String(amount || 0));
}

// ─── Simulated API Responses ───────────────────────────────

const API_RESPONSES: Record<string, Record<string, unknown>> = {
  '/api/credit-bureau/check': { 
    creditScore: 720, 
    activeLoans: 2, 
    paymentHistory: 'good',
    delinquencies: 0,
    inquiries30d: 1,
  },
  '/api/fraud-detection/score': { 
    fraudScore: 15, 
    riskLevel: 'low', 
    flags: [],
    modelVersion: 'v3.2.1',
  },
  '/api/aml/screening': { 
    pepMatch: false, 
    sanctionsMatch: false, 
    adverseMedia: false,
    riskCategory: 'standard',
  },
  '/api/kyc/document-verify': { 
    isAuthentic: true, 
    confidence: 96, 
    documentType: 'passport',
    expiryValid: true,
  },
  '/api/income/verify': { 
    verified: true, 
    monthlyIncome: 5200, 
    employerConfirmed: true,
    stabilityScore: 88,
  },
  '/api/customer/risk-profile': { 
    segment: 'B', 
    lifetimeValue: 12400, 
    churnRisk: 12,
    lastActivity: '2024-02-14',
  },
  '/api/collections/score': { 
    collectability: 78, 
    preferredChannel: 'email',
    bestContactTime: '10:00-14:00',
  },
  '/api/compliance/check': {
    compliant: true,
    regulatoryFlags: [],
    lastAudit: '2024-01-15',
    nextReviewDate: '2024-07-15',
  },
};

function getAPIResponse(endpoint: string): Record<string, unknown> {
  return API_RESPONSES[endpoint] || { status: 'ok', data: 'simulated' };
}

// ─── Workflow Engine ───────────────────────────────────────

export class WorkflowEngine {
  private executions: Map<string, WorkflowExecution> = new Map();
  private listeners: Map<string, ExecutionCallback[]> = new Map();

  subscribe(executionId: string, callback: ExecutionCallback): () => void {
    const existing = this.listeners.get(executionId) || [];
    existing.push(callback);
    this.listeners.set(executionId, existing);
    return () => {
      const callbacks = this.listeners.get(executionId) || [];
      this.listeners.set(executionId, callbacks.filter(cb => cb !== callback));
    };
  }

  private notify(execution: WorkflowExecution) {
    const callbacks = this.listeners.get(execution.id) || [];
    callbacks.forEach(cb => cb({ ...execution, steps: [...execution.steps] }));
  }

  getExecution(id: string): WorkflowExecution | undefined {
    return this.executions.get(id);
  }

  async executeWorkflow(
    workflow: Workflow,
    subject: { id: string; name: string; data?: Record<string, unknown> },
    onUpdate?: ExecutionCallback
  ): Promise<WorkflowExecution> {
    const executionId = `EX-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    const execution: WorkflowExecution = {
      id: executionId,
      workflowId: workflow.id,
      workflowName: workflow.name,
      trigger: workflow.trigger,
      status: 'running',
      subjectId: subject.id,
      subjectName: subject.name,
      steps: [],
      startedAt: new Date().toISOString(),
    };

    this.executions.set(executionId, execution);
    if (onUpdate) {
      this.subscribe(executionId, onUpdate);
    }
    this.notify(execution);

    // Find trigger node
    const triggerNode = workflow.nodes.find(n => n.type === 'trigger');
    if (!triggerNode) {
      execution.status = 'failed';
      execution.completedAt = new Date().toISOString();
      this.notify(execution);
      return execution;
    }

    // Walk the node graph
    let currentNodeId: string | undefined = triggerNode.nextNodeId;
    
    // Process trigger node first
    const triggerStep: ExecutionStep = {
      nodeId: triggerNode.id,
      nodeLabel: triggerNode.label,
      nodeType: 'trigger',
      status: 'completed',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      duration: 0,
      output: { triggered: true, subject: subject.name },
    };
    execution.steps.push(triggerStep);
    this.notify(execution);

    // Walk through remaining nodes
    while (currentNodeId) {
      const node = workflow.nodes.find(n => n.id === currentNodeId);
      if (!node) break;

      const step = await this.executeNode(node, execution, subject.data || {}, workflow.trigger);
      execution.steps.push(step);
      this.notify(execution);

      if (step.status === 'failed') {
        if (node.errorNodeId) {
          currentNodeId = node.errorNodeId;
          continue;
        }
        execution.status = 'failed';
        break;
      }

      // Determine next node
      if (node.type === 'condition' || node.type === 'ai_decision') {
        const decision = step.output?.decision as boolean | undefined;
        currentNodeId = decision ? node.trueBranchId : node.falseBranchId;
      } else if (node.type === 'human_review') {
        execution.status = 'waiting_human';
        execution.completedAt = new Date().toISOString();
        this.notify(execution);
        return execution;
      } else {
        currentNodeId = node.nextNodeId;
      }

      // Record final decision from action nodes
      if (node.type === 'action' && node.actionType) {
        execution.finalDecision = node.actionType;
        execution.aiConfidence = step.output?.confidence as number || 85;
      }
    }

    if (execution.status === 'running') {
      execution.status = 'completed';
    }
    execution.completedAt = new Date().toISOString();
    execution.totalDuration = new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime();
    this.notify(execution);

    return execution;
  }

  private async executeNode(
    node: WorkflowNode,
    execution: WorkflowExecution,
    subjectData: Record<string, unknown>,
    trigger: string
  ): Promise<ExecutionStep> {
    const step: ExecutionStep = {
      nodeId: node.id,
      nodeLabel: node.label,
      nodeType: node.type,
      status: 'running',
      startedAt: new Date().toISOString(),
    };

    // Simulate processing time
    const delay = this.getNodeDelay(node.type);
    await this.sleep(delay);

    try {
      switch (node.type) {
        case 'condition': {
          const result = this.evaluateConditions(node, subjectData);
          step.output = { decision: result, conditions: node.conditions };
          step.status = 'completed';
          break;
        }

        case 'ai_decision': {
          const confidence = 70 + Math.floor(Math.random() * 25);
          const score = Math.floor(Math.random() * 100);
          const reasoning = getAIReasoning(trigger, score, confidence);
          const decision = confidence >= (node.aiConfig?.confidenceThreshold || 70);
          step.output = { decision, confidence, score };
          step.aiReasoning = reasoning;
          step.status = 'completed';
          break;
        }

        case 'api_call': {
          const endpoint = node.apiConfig?.endpoint || '/api/unknown';
          const response = getAPIResponse(endpoint);
          step.input = { endpoint, method: node.apiConfig?.method || 'GET' };
          step.output = { response, statusCode: 200 };
          step.status = 'completed';
          break;
        }

        case 'action': {
          step.output = {
            actionType: node.actionType,
            params: node.actionParams,
            confidence: 80 + Math.floor(Math.random() * 15),
            executedAt: new Date().toISOString(),
          };
          step.status = 'completed';
          break;
        }

        case 'notification': {
          step.output = {
            channel: node.notificationChannel,
            template: node.notificationTemplate,
            sent: true,
            sentAt: new Date().toISOString(),
          };
          step.status = 'completed';
          break;
        }

        case 'human_review': {
          step.output = {
            assignedTo: 'Sarah Super (CRO)',
            reason: node.description || 'Requires human judgment',
            priority: 'high',
          };
          step.status = 'completed';
          break;
        }

        case 'delay': {
          step.output = { delayMinutes: node.delayMinutes || 5, simulated: true };
          step.status = 'completed';
          break;
        }

        default:
          step.output = { processed: true };
          step.status = 'completed';
      }
    } catch (err) {
      step.status = 'failed';
      step.error = err instanceof Error ? err.message : 'Unknown error';
    }

    step.completedAt = new Date().toISOString();
    step.duration = delay;
    return step;
  }

  private evaluateConditions(node: WorkflowNode, data: Record<string, unknown>): boolean {
    if (!node.conditions || node.conditions.length === 0) return true;

    const results = node.conditions.map(cond => {
      const fieldValue = data[cond.field];
      switch (cond.operator) {
        case 'greater_than': return Number(fieldValue || 50) > Number(cond.value);
        case 'less_than': return Number(fieldValue || 50) < Number(cond.value);
        case 'equals': return fieldValue === cond.value;
        case 'greater_equal': return Number(fieldValue || 50) >= Number(cond.value);
        case 'less_equal': return Number(fieldValue || 50) <= Number(cond.value);
        case 'contains': return String(fieldValue || '').includes(String(cond.value));
        default: return true;
      }
    });

    return node.conditionLogic === 'OR' 
      ? results.some(r => r)
      : results.every(r => r);
  }

  private getNodeDelay(type: string): number {
    const delays: Record<string, number> = {
      trigger: 200,
      condition: 500,
      ai_decision: 1500,
      api_call: 800,
      action: 600,
      notification: 400,
      human_review: 300,
      delay: 400,
      loop: 300,
    };
    return delays[type] || 500;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const workflowEngine = new WorkflowEngine();

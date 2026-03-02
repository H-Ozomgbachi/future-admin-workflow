import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Brain,
  CheckCircle,
  Clock,
  AlertTriangle,
  Shield,
  Play,
  FileText,
  Users,
  UserCheck,
  Filter,
  ChevronDown,
  ChevronRight,
  Zap,
  BarChart3,
  TrendingUp,
  XCircle,
  Globe,
  Bell,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { WorkflowExecution, TRIGGER_LABELS, TRIGGER_COLORS, NodeType } from '../types/workflow';
import { WorkflowStatusBadge } from '../components/workflows/WorkflowVisualizer';
import { sampleExecutions } from '../data/workflowData';

// ─── Step Detail Drawer ────────────────────────────────────

function StepDetail({ step }: { step: WorkflowExecution['steps'][0] }) {
  const [expanded, setExpanded] = useState(false);
  
  const nodeTypeIcons: Record<NodeType, React.ElementType> = {
    trigger: Zap,
    condition: Filter,
    ai_decision: Brain,
    api_call: Globe,
    action: CheckCircle,
    notification: Bell,
    human_review: UserCheck,
    delay: Clock,
    loop: Play,
  };
  const Icon = nodeTypeIcons[step.nodeType] || Activity;

  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left',
          expanded && 'bg-slate-50'
        )}
      >
        <div className={cn(
          'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
          step.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
          step.status === 'running' ? 'bg-blue-100 text-blue-600' :
          step.status === 'failed' ? 'bg-red-100 text-red-600' :
          'bg-slate-100 text-slate-400'
        )}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-900">{step.nodeLabel}</div>
          <div className="text-xs text-slate-400 capitalize">{step.nodeType.replace('_', ' ')}</div>
        </div>
        <div className="flex items-center gap-3">
          {step.duration && (
            <span className="text-xs font-mono text-slate-400">{step.duration}ms</span>
          )}
          <div className={cn(
            'w-2 h-2 rounded-full',
            step.status === 'completed' ? 'bg-emerald-500' :
            step.status === 'running' ? 'bg-blue-500 animate-pulse' :
            step.status === 'failed' ? 'bg-red-500' :
            'bg-slate-300'
          )} />
          <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', expanded && 'rotate-180')} />
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="border-t border-slate-100 p-4 bg-white space-y-3"
        >
          {step.aiReasoning && (
            <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
              <div className="flex items-center gap-1 text-xs font-bold text-primary-700 uppercase tracking-wider mb-1">
                <Brain className="w-3 h-3" /> AI Reasoning
              </div>
              <p className="text-sm text-primary-900 leading-relaxed">{step.aiReasoning}</p>
            </div>
          )}
          {step.output && (
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Output</div>
              <pre className="text-xs font-mono bg-slate-900 text-emerald-400 p-3 rounded-lg overflow-auto">
                {JSON.stringify(step.output, null, 2)}
              </pre>
            </div>
          )}
          {step.input && (
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Input</div>
              <pre className="text-xs font-mono bg-slate-900 text-cyan-400 p-3 rounded-lg overflow-auto">
                {JSON.stringify(step.input, null, 2)}
              </pre>
            </div>
          )}
          {step.error && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Error</div>
              <p className="text-sm text-red-800">{step.error}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── Execution Card ────────────────────────────────────────

function ExecutionCard({ execution }: { execution: WorkflowExecution }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors text-left"
      >
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0',
          TRIGGER_COLORS[execution.trigger]
        )}>
          {execution.trigger === 'loan_request' && <FileText className="w-6 h-6" />}
          {execution.trigger === 'transaction_incoming' && <Activity className="w-6 h-6" />}
          {execution.trigger === 'kyc_submission' && <Users className="w-6 h-6" />}
          {execution.trigger === 'fraud_alert' && <Shield className="w-6 h-6" />}
          {execution.trigger === 'customer_support_ticket' && <Users className="w-6 h-6" />}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900">{execution.subjectName}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{execution.workflowName}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] font-mono text-slate-400">{execution.id}</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">{execution.steps.length} steps</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {execution.aiConfidence && (
            <div className="text-center hidden md:block">
              <div className={cn(
                'text-lg font-bold',
                execution.aiConfidence >= 85 ? 'text-emerald-600' :
                execution.aiConfidence >= 65 ? 'text-amber-600' :
                'text-red-600'
              )}>
                {execution.aiConfidence}%
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Confidence</div>
            </div>
          )}
          {execution.totalDuration && (
            <div className="text-center hidden md:block">
              <div className="text-lg font-bold text-slate-700">{(execution.totalDuration / 1000).toFixed(1)}s</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Duration</div>
            </div>
          )}
          <div className="flex flex-col items-end gap-2">
            <WorkflowStatusBadge status={execution.status} />
            {execution.finalDecision && (
              <span className={cn(
                'text-[10px] font-bold uppercase px-2 py-0.5 rounded-md',
                execution.finalDecision === 'approve' ? 'bg-emerald-100 text-emerald-700' :
                execution.finalDecision === 'reject' ? 'bg-red-100 text-red-700' :
                execution.finalDecision === 'freeze_account' ? 'bg-red-100 text-red-700' :
                execution.finalDecision === 'escalate' ? 'bg-orange-100 text-orange-700' :
                'bg-slate-100 text-slate-600'
              )}>
                → {execution.finalDecision.replace('_', ' ')}
              </span>
            )}
          </div>
          <ChevronDown className={cn('w-5 h-5 text-slate-400 transition-transform', expanded && 'rotate-180')} />
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="border-t border-slate-100 p-5 space-y-2"
        >
          {execution.steps.map((step) => (
            <div key={step.nodeId}>
              <StepDetail step={step} />
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

export function WorkflowMonitor() {
  const [executions] = useState<WorkflowExecution[]>(sampleExecutions);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredExecutions = executions.filter(
    e => statusFilter === 'all' || e.status === statusFilter
  );

  // Compute stats
  const totalSteps = executions.reduce((acc, e) => acc + e.steps.length, 0);
  const avgConfidence = executions.filter(e => e.aiConfidence).reduce((acc, e) => acc + (e.aiConfidence || 0), 0) / executions.filter(e => e.aiConfidence).length;
  const completedCount = executions.filter(e => e.status === 'completed').length;
  const humanEscalations = executions.filter(e => e.status === 'waiting_human').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Agent Monitor</h1>
        </div>
        <p className="text-slate-500 mt-1">
          Real-time visibility into every AI agent decision. Full transparency and audit trail.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Runs</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{executions.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-primary-600" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg AI Confidence</span>
          </div>
          <div className="text-2xl font-bold text-primary-700">{avgConfidence.toFixed(0)}%</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Auto-Resolved</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{completedCount}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Human Escalated</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">{humanEscalations}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'completed', 'running', 'waiting_human', 'failed'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              statusFilter === status
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            )}
          >
            {status === 'all' ? 'All' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Execution List */}
      <div className="space-y-4">
        {filteredExecutions.map(exec => (
          <div key={exec.id}>
            <ExecutionCard execution={exec} />
          </div>
        ))}
      </div>
    </div>
  );
}

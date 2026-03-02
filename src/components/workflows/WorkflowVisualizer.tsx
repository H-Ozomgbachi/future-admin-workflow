import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Workflow,
  WorkflowNode,
  NodeType,
  NODE_TYPE_LABELS,
  TRIGGER_LABELS,
  TRIGGER_COLORS,
  WorkflowTrigger,
} from '../../types/workflow';
import { cn } from '../../lib/utils';
import {
  Play,
  Zap,
  GitBranch,
  Brain,
  Globe,
  CheckCircle,
  Bell,
  UserCheck,
  Clock,
  ArrowDown,
  ChevronRight,
  Settings,
  AlertTriangle,
  XCircle,
  Shield,
} from 'lucide-react';

// ─── Node Icon Mapping ─────────────────────────────────────

const nodeIcons: Record<NodeType, React.ElementType> = {
  trigger: Zap,
  condition: GitBranch,
  ai_decision: Brain,
  api_call: Globe,
  action: CheckCircle,
  notification: Bell,
  human_review: UserCheck,
  delay: Clock,
  loop: Play,
};

const nodeColors: Record<NodeType, { bg: string; border: string; text: string; iconBg: string }> = {
  trigger: { bg: 'bg-violet-50', border: 'border-violet-300', text: 'text-violet-800', iconBg: 'bg-violet-500' },
  condition: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800', iconBg: 'bg-amber-500' },
  ai_decision: { bg: 'bg-primary-50', border: 'border-primary-300', text: 'text-primary-800', iconBg: 'bg-primary-600' },
  api_call: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800', iconBg: 'bg-blue-500' },
  action: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800', iconBg: 'bg-emerald-500' },
  notification: { bg: 'bg-cyan-50', border: 'border-cyan-300', text: 'text-cyan-800', iconBg: 'bg-cyan-500' },
  human_review: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800', iconBg: 'bg-orange-500' },
  delay: { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-800', iconBg: 'bg-slate-500' },
  loop: { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-800', iconBg: 'bg-indigo-500' },
};

// ─── Workflow Node Card ────────────────────────────────────

interface WorkflowNodeCardProps {
  node: WorkflowNode;
  isActive?: boolean;
  stepStatus?: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  onClick?: () => void;
  delay?: number;
}

export function WorkflowNodeCard({ node, isActive, stepStatus, onClick, delay = 0 }: WorkflowNodeCardProps) {
  const colors = nodeColors[node.type];
  const Icon = nodeIcons[node.type];

  const statusIndicator = stepStatus && (
    <div className="absolute -top-1 -right-1 z-10">
      {stepStatus === 'running' && (
        <div className="w-5 h-5 rounded-full bg-blue-500 animate-pulse flex items-center justify-center">
          <Play className="w-3 h-3 text-white fill-white" />
        </div>
      )}
      {stepStatus === 'completed' && (
        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
          <CheckCircle className="w-3 h-3 text-white" />
        </div>
      )}
      {stepStatus === 'failed' && (
        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
          <XCircle className="w-3 h-3 text-white" />
        </div>
      )}
      {stepStatus === 'pending' && (
        <div className="w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center">
          <Clock className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.08 }}
      onClick={onClick}
      className={cn(
        'relative w-72 rounded-xl border-2 p-4 cursor-pointer transition-all duration-200',
        colors.bg,
        colors.border,
        isActive && 'ring-2 ring-primary-500 ring-offset-2 shadow-lg',
        stepStatus === 'running' && 'ring-2 ring-blue-400 ring-offset-2 shadow-lg shadow-blue-100',
        !isActive && !stepStatus && 'hover:shadow-md hover:scale-[1.02]'
      )}
    >
      {statusIndicator}
      <div className="flex items-start gap-3">
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', colors.iconBg)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn('text-[10px] font-bold uppercase tracking-wider', colors.text)}>
              {NODE_TYPE_LABELS[node.type]}
            </span>
          </div>
          <h4 className="font-semibold text-slate-900 text-sm mt-0.5 leading-tight">{node.label}</h4>
          {node.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{node.description}</p>
          )}

          {/* Extra details per type */}
          {node.type === 'condition' && node.conditions && (
            <div className="mt-2 space-y-1">
              {node.conditions.map((c, i) => (
                <div key={i} className="flex items-center gap-1 text-[10px] font-mono bg-white/60 rounded px-1.5 py-0.5 text-amber-700">
                  <GitBranch className="w-3 h-3" />
                  {c.label || `${c.field} ${c.operator} ${c.value}`}
                </div>
              ))}
            </div>
          )}

          {node.type === 'ai_decision' && node.aiConfig && (
            <div className="mt-2 flex items-center gap-1 text-[10px] font-mono bg-white/60 rounded px-1.5 py-0.5 text-primary-700">
              <Brain className="w-3 h-3" />
              Confidence ≥ {node.aiConfig.confidenceThreshold}%
            </div>
          )}

          {node.type === 'api_call' && node.apiConfig && (
            <div className="mt-2 flex items-center gap-1 text-[10px] font-mono bg-white/60 rounded px-1.5 py-0.5 text-blue-700">
              <Globe className="w-3 h-3" />
              {node.apiConfig.method} {node.apiConfig.endpoint}
            </div>
          )}

          {node.type === 'action' && node.actionType && (
            <div className="mt-2 flex items-center gap-1 text-[10px] font-mono bg-white/60 rounded px-1.5 py-0.5 text-emerald-700">
              {node.actionType === 'approve' && <CheckCircle className="w-3 h-3" />}
              {node.actionType === 'reject' && <XCircle className="w-3 h-3" />}
              {node.actionType === 'escalate' && <AlertTriangle className="w-3 h-3" />}
              {node.actionType === 'freeze_account' && <Shield className="w-3 h-3" />}
              {node.actionType === 'flag' && <AlertTriangle className="w-3 h-3" />}
              {node.actionType === 'log_audit' && <Settings className="w-3 h-3" />}
              {node.actionType}
            </div>
          )}

          {node.type === 'notification' && (
            <div className="mt-2 flex items-center gap-1 text-[10px] font-mono bg-white/60 rounded px-1.5 py-0.5 text-cyan-700">
              <Bell className="w-3 h-3" />
              via {node.notificationChannel}
            </div>
          )}

          {node.type === 'human_review' && (
            <div className="mt-2 flex items-center gap-1 text-[10px] font-mono bg-white/60 rounded px-1.5 py-0.5 text-orange-700">
              <UserCheck className="w-3 h-3" />
              Manual Review Required
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Flow Connector ────────────────────────────────────────

interface FlowConnectorProps {
  label?: string;
  variant?: 'default' | 'true' | 'false' | 'error';
}

export function FlowConnector({ label, variant = 'default' }: FlowConnectorProps) {
  const colors = {
    default: 'text-slate-400',
    true: 'text-emerald-500',
    false: 'text-red-400',
    error: 'text-orange-400',
  };

  return (
    <div className="flex flex-col items-center py-1">
      <div className={cn('flex flex-col items-center', colors[variant])}>
        <div className="w-0.5 h-4 bg-current" />
        {label && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-current/30 my-0.5">
            {label}
          </span>
        )}
        <ArrowDown className="w-4 h-4" />
      </div>
    </div>
  );
}

// ─── Branch Split ──────────────────────────────────────────

interface BranchSplitProps {
  trueLabel?: string;
  falseLabel?: string;
  trueBranch: React.ReactNode;
  falseBranch: React.ReactNode;
}

export function BranchSplit({ trueLabel = 'YES', falseLabel = 'NO', trueBranch, falseBranch }: BranchSplitProps) {
  return (
    <div className="flex gap-8 justify-center">
      <div className="flex flex-col items-center">
        <FlowConnector label={trueLabel} variant="true" />
        {trueBranch}
      </div>
      <div className="flex flex-col items-center">
        <FlowConnector label={falseLabel} variant="false" />
        {falseBranch}
      </div>
    </div>
  );
}

// ─── Workflow Flow Visualizer ──────────────────────────────
// Renders the workflow as a vertical flowchart by traversing the node graph.

interface WorkflowFlowProps {
  workflow: Workflow;
  activeNodeId?: string;
  stepsStatus?: Map<string, 'pending' | 'running' | 'completed' | 'failed' | 'skipped'>;
  onNodeClick?: (node: WorkflowNode) => void;
}

export function WorkflowFlow({ workflow, activeNodeId, stepsStatus, onNodeClick }: WorkflowFlowProps) {
  // Build a map for quick lookups
  const nodeMap = new Map(workflow.nodes.map(n => [n.id, n]));

  // Recursive renderer that follows the graph
  function renderNode(nodeId: string | undefined, depth: number, visited: Set<string>): React.ReactNode {
    if (!nodeId || visited.has(nodeId)) return null;
    visited.add(nodeId);
    const node = nodeMap.get(nodeId);
    if (!node) return null;

    const isBranching = node.type === 'condition' || node.type === 'ai_decision';
    const status = stepsStatus?.get(node.id);

    return (
      <div key={node.id} className="flex flex-col items-center">
        <WorkflowNodeCard
          node={node}
          isActive={node.id === activeNodeId}
          stepStatus={status}
          onClick={() => onNodeClick?.(node)}
          delay={depth}
        />

        {isBranching && (node.trueBranchId || node.falseBranchId) ? (
          <>
            <BranchSplit
              trueLabel={node.type === 'ai_decision' ? 'CONFIDENT' : 'YES'}
              falseLabel={node.type === 'ai_decision' ? 'UNCERTAIN' : 'NO'}
              trueBranch={renderBranch(node.trueBranchId, depth + 1, new Set(visited))}
              falseBranch={renderBranch(node.falseBranchId, depth + 1, new Set(visited))}
            />
          </>
        ) : node.nextNodeId ? (
          <>
            <FlowConnector />
            {renderNode(node.nextNodeId, depth + 1, visited)}
          </>
        ) : null}
      </div>
    );
  }

  function renderBranch(nodeId: string | undefined, depth: number, visited: Set<string>): React.ReactNode {
    if (!nodeId) return <div className="text-xs text-slate-400 italic py-4">End</div>;
    return renderNode(nodeId, depth, visited);
  }

  // Start from trigger node
  const triggerNode = workflow.nodes.find(n => n.type === 'trigger');
  if (!triggerNode) return <div className="text-slate-500">No trigger node found</div>;

  return (
    <div className="flex flex-col items-center py-4 overflow-auto">
      {renderNode(triggerNode.id, 0, new Set())}
    </div>
  );
}

// ─── Workflow Status Badge ─────────────────────────────────

export function WorkflowStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    draft: 'bg-slate-100 text-slate-600 border-slate-200',
    paused: 'bg-amber-100 text-amber-700 border-amber-200',
    archived: 'bg-slate-100 text-slate-400 border-slate-200',
    running: 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    failed: 'bg-red-100 text-red-700 border-red-200',
    waiting_human: 'bg-orange-100 text-orange-700 border-orange-200',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
      styles[status] || styles.draft
    )}>
      {status === 'active' && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
      {status === 'running' && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />}
      {status.replace('_', ' ')}
    </span>
  );
}

// ─── Trigger Badge ─────────────────────────────────────────

export function TriggerBadge({ trigger }: { trigger: WorkflowTrigger }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-white',
      TRIGGER_COLORS[trigger]
    )}>
      <Zap className="w-3 h-3" />
      {TRIGGER_LABELS[trigger]}
    </span>
  );
}

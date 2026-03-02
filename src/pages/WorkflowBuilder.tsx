import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Plus,
  Settings,
  Zap,
  BarChart3,
  Clock,
  CheckCircle,
  Brain,
  ChevronRight,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Globe,
  Shield,
  Users,
  FileText,
  Activity,
  UserCheck,
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
  Workflow,
  WorkflowNode,
  TRIGGER_LABELS,
  TRIGGER_COLORS,
  WorkflowTrigger,
} from '../types/workflow';
import {
  WorkflowFlow,
  WorkflowStatusBadge,
  TriggerBadge,
  WorkflowNodeCard,
} from '../components/workflows/WorkflowVisualizer';
import { allWorkflows, sampleExecutions } from '../data/workflowData';
import { workflowEngine } from '../services/workflowEngine';
import type { WorkflowExecution, ExecutionStep } from '../types/workflow';

// ─── Workflow Card ─────────────────────────────────────────

function WorkflowCard({
  workflow,
  onSelect,
  onRun,
}: {
  workflow: Workflow;
  onSelect: () => void;
  onRun: () => void;
}) {
  const triggerIcons: Record<string, React.ElementType> = {
    loan_request: FileText,
    transaction_incoming: Activity,
    kyc_submission: Users,
    customer_support_ticket: Users,
    fraud_alert: Shield,
  };
  const TriggerIcon = triggerIcons[workflow.trigger] || Zap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center text-white',
              TRIGGER_COLORS[workflow.trigger]
            )}>
              <TriggerIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{workflow.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">v{workflow.version} · by {workflow.createdBy}</p>
            </div>
          </div>
          <WorkflowStatusBadge status={workflow.status} />
        </div>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{workflow.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {workflow.tags.map(tag => (
            <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
              {tag}
            </span>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-100">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900">{workflow.executionCount.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Executions</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900">{workflow.avgExecutionTime}s</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Avg Time</div>
          </div>
          <div className="text-center">
            <div className={cn(
              'text-lg font-bold',
              workflow.successRate >= 95 ? 'text-emerald-600' : workflow.successRate >= 85 ? 'text-amber-600' : 'text-red-600'
            )}>
              {workflow.successRate}%
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Success</div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 p-3 flex gap-2 bg-slate-50/50">
        <button
          onClick={onSelect}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Configure
        </button>
        <button
          onClick={onRun}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Play className="w-4 h-4" />
          Run Demo
        </button>
      </div>
    </motion.div>
  );
}

// ─── Node Detail Panel ─────────────────────────────────────

function NodeDetailPanel({ node, onClose }: { node: WorkflowNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 w-80"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900">Node Configuration</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Label</label>
          <input
            type="text"
            defaultValue={node.label}
            className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
          <textarea
            defaultValue={node.description}
            rows={2}
            className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {node.type === 'condition' && node.conditions && (
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Conditions</label>
            {node.conditions.map((cond, i) => (
              <div key={i} className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <input defaultValue={cond.field} className="px-2 py-1 border border-amber-200 rounded text-xs" placeholder="Field" />
                  <select defaultValue={cond.operator} className="px-2 py-1 border border-amber-200 rounded text-xs bg-white">
                    <option value="greater_than">&gt;</option>
                    <option value="less_than">&lt;</option>
                    <option value="equals">=</option>
                    <option value="greater_equal">≥</option>
                    <option value="less_equal">≤</option>
                  </select>
                  <input defaultValue={String(cond.value)} className="px-2 py-1 border border-amber-200 rounded text-xs" placeholder="Value" />
                </div>
              </div>
            ))}
          </div>
        )}

        {node.type === 'ai_decision' && node.aiConfig && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Model</label>
              <select defaultValue={node.aiConfig.model} className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                <option value="custom-risk-model">Custom Risk Model v3</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confidence Threshold</label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="range"
                  min={0}
                  max={100}
                  defaultValue={node.aiConfig.confidenceThreshold}
                  className="flex-1"
                />
                <span className="text-sm font-bold text-primary-700 w-10">{node.aiConfig.confidenceThreshold}%</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Factors</label>
              <div className="mt-1 flex flex-wrap gap-1">
                {node.aiConfig.factors.map(f => (
                  <span key={f} className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {node.type === 'api_call' && node.apiConfig && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Endpoint</label>
              <input
                defaultValue={node.apiConfig.endpoint}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Method</label>
              <select defaultValue={node.apiConfig.method} className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
              </select>
            </div>
          </div>
        )}

        <button className="w-full py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors mt-4">
          Save Changes
        </button>
      </div>
    </motion.div>
  );
}

// ─── Execution Timeline ────────────────────────────────────

function ExecutionTimeline({ execution }: { execution: WorkflowExecution }) {
  return (
    <div className="space-y-3">
      {execution.steps.map((step, index) => (
        <motion.div
          key={step.nodeId}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start gap-3"
        >
          <div className="flex flex-col items-center">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
              step.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
              step.status === 'running' ? 'bg-blue-100 text-blue-600 animate-pulse' :
              step.status === 'failed' ? 'bg-red-100 text-red-600' :
              'bg-slate-100 text-slate-400'
            )}>
              {step.status === 'completed' && <CheckCircle className="w-4 h-4" />}
              {step.status === 'running' && <Play className="w-4 h-4" />}
              {step.status === 'failed' && <AlertTriangle className="w-4 h-4" />}
              {step.status === 'pending' && <Clock className="w-4 h-4" />}
            </div>
            {index < execution.steps.length - 1 && (
              <div className="w-0.5 h-8 bg-slate-200 my-1" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900">{step.nodeLabel}</h4>
              {step.duration && (
                <span className="text-[10px] font-mono text-slate-400">{step.duration}ms</span>
              )}
            </div>
            <p className="text-xs text-slate-500 capitalize">{step.nodeType.replace('_', ' ')}</p>
            {step.aiReasoning && (
              <div className="mt-1.5 p-2 bg-primary-50 rounded-lg border border-primary-100">
                <div className="flex items-center gap-1 text-[10px] font-semibold text-primary-700 uppercase tracking-wider mb-1">
                  <Brain className="w-3 h-3" />
                  AI Reasoning
                </div>
                <p className="text-xs text-primary-900 leading-relaxed">{step.aiReasoning}</p>
              </div>
            )}
            {step.output && !step.aiReasoning && (
              <div className="mt-1 text-[10px] font-mono text-slate-400 bg-slate-50 rounded p-1.5 line-clamp-2">
                {JSON.stringify(step.output).slice(0, 120)}...
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

export function WorkflowBuilder() {
  const [workflows] = useState<Workflow[]>(allWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [view, setView] = useState<'grid' | 'detail' | 'running'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrigger, setFilterTrigger] = useState<WorkflowTrigger | 'all'>('all');

  // Execution state
  const [currentExecution, setCurrentExecution] = useState<WorkflowExecution | null>(null);
  const [executionStepsStatus, setExecutionStepsStatus] = useState<Map<string, 'pending' | 'running' | 'completed' | 'failed' | 'skipped'>>(new Map());
  const [isRunning, setIsRunning] = useState(false);

  const filteredWorkflows = workflows.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrigger = filterTrigger === 'all' || w.trigger === filterTrigger;
    return matchesSearch && matchesTrigger;
  });

  // Demo subjects for each trigger type
  const demoSubjects: Record<string, { id: string; name: string; data?: Record<string, unknown> }> = {
    loan_request: { id: 'L103', name: 'Bob Smith — $2,000 Emergency Loan', data: { riskScore: 45, amount: 2000 } },
    transaction_incoming: { id: 'T002', name: 'Charlie Davis — $9,500 Withdrawal', data: { anomalyScore: 92, amount: 9500 } },
    kyc_submission: { id: 'K001', name: 'Charlie Davis — Passport Verification', data: { docAuthenticityScore: 72, faceMatchScore: 45 } },
    customer_support_ticket: { id: 'ST-001', name: 'Alice Johnson — Billing Dispute', data: { ticketComplexity: 30 } },
    fraud_alert: { id: 'FA-001', name: 'Suspicious Activity — Account C003', data: { severity: 'critical' } },
  };

  const handleRunWorkflow = async (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setView('running');
    setIsRunning(true);
    setCurrentExecution(null);
    setExecutionStepsStatus(new Map());
    setSelectedNode(null);

    const subject = demoSubjects[workflow.trigger] || { id: 'DEMO-001', name: 'Demo Subject' };

    await workflowEngine.executeWorkflow(
      workflow,
      subject,
      (updatedExecution) => {
        setCurrentExecution({ ...updatedExecution });
        const statusMap = new Map<string, 'pending' | 'running' | 'completed' | 'failed' | 'skipped'>();
        
        // Mark completed and running steps
        updatedExecution.steps.forEach((step) => {
          statusMap.set(step.nodeId, step.status as 'pending' | 'running' | 'completed' | 'failed' | 'skipped');
        });

        // Mark future nodes as pending
        workflow.nodes.forEach(node => {
          if (!statusMap.has(node.id)) {
            statusMap.set(node.id, 'pending');
          }
        });

        setExecutionStepsStatus(new Map(statusMap));
      }
    );

    setIsRunning(false);
  };

  // ─── Grid View ───────────────────────────────────────────

  if (view === 'grid') {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Agentic Workflows</h1>
            </div>
            <p className="text-slate-500 mt-1">
              Configure AI agents that autonomously handle operations. Build once, runs 24/7.
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20">
            <Plus className="w-4 h-4" />
            New Workflow
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary-600" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Agents</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{workflows.filter(w => w.status === 'active').length}</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">All running</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Runs</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {workflows.reduce((acc, w) => acc + w.executionCount, 0).toLocaleString()}
            </div>
            <div className="text-xs text-blue-600 font-medium mt-1">This month</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Speed</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {(workflows.reduce((acc, w) => acc + w.avgExecutionTime, 0) / workflows.length).toFixed(1)}s
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">vs 2-3 days manual</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Success Rate</span>
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              {(workflows.reduce((acc, w) => acc + w.successRate, 0) / workflows.length).toFixed(1)}%
            </div>
            <div className="text-xs text-emerald-600 font-medium mt-1">Industry-leading</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={filterTrigger}
            onChange={(e) => setFilterTrigger(e.target.value as WorkflowTrigger | 'all')}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Triggers</option>
            {Object.entries(TRIGGER_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Workflow Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWorkflows.map((workflow) => (
            <div key={workflow.id}>
              <WorkflowCard
                workflow={workflow}
                onSelect={() => {
                  setSelectedWorkflow(workflow);
                  setView('detail');
                  setSelectedNode(null);
                }}
                onRun={() => handleRunWorkflow(workflow)}
              />
            </div>
          ))}
        </div>

        {/* Recent Executions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              Recent Agent Executions
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {sampleExecutions.map((exec) => (
              <div key={exec.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center text-white',
                    TRIGGER_COLORS[exec.trigger]
                  )}>
                    {exec.trigger === 'loan_request' && <FileText className="w-5 h-5" />}
                    {exec.trigger === 'transaction_incoming' && <Activity className="w-5 h-5" />}
                    {exec.trigger === 'kyc_submission' && <Users className="w-5 h-5" />}
                    {exec.trigger === 'fraud_alert' && <Shield className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{exec.subjectName}</h4>
                    <p className="text-xs text-slate-500">{exec.workflowName} · {exec.steps.length} steps</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {exec.aiConfidence && (
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-bold text-primary-700">{exec.aiConfidence}%</div>
                      <div className="text-[10px] text-slate-400">AI Confidence</div>
                    </div>
                  )}
                  {exec.totalDuration && (
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-bold text-slate-700">{(exec.totalDuration / 1000).toFixed(1)}s</div>
                      <div className="text-[10px] text-slate-400">Duration</div>
                    </div>
                  )}
                  <WorkflowStatusBadge status={exec.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Detail / Builder View ───────────────────────────────

  if (view === 'detail' && selectedWorkflow) {
    return (
      <div className="space-y-6">
        {/* Back + Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setView('grid'); setSelectedWorkflow(null); setSelectedNode(null); }}
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900">{selectedWorkflow.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <TriggerBadge trigger={selectedWorkflow.trigger} />
              <WorkflowStatusBadge status={selectedWorkflow.status} />
              <span className="text-xs text-slate-500">{selectedWorkflow.nodes.length} nodes</span>
            </div>
          </div>
          <button
            onClick={() => handleRunWorkflow(selectedWorkflow)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
          >
            <Play className="w-4 h-4" />
            Run Demo
          </button>
        </div>

        <p className="text-sm text-slate-500">{selectedWorkflow.description}</p>

        {/* Workflow Canvas + Node Details */}
        <div className="flex gap-6">
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-auto" style={{ minHeight: '600px' }}>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <h2 className="font-bold text-slate-900">Workflow Flow</h2>
              <span className="text-xs text-slate-400 ml-auto">Click any node to configure</span>
            </div>
            <WorkflowFlow
              workflow={selectedWorkflow}
              activeNodeId={selectedNode?.id}
              onNodeClick={(node) => setSelectedNode(node)}
            />
          </div>

          <AnimatePresence>
            {selectedNode && (
              <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ─── Running / Execution View ────────────────────────────

  if (view === 'running' && selectedWorkflow) {
    return (
      <div className="space-y-6">
        {/* Back + Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setView('grid'); setSelectedWorkflow(null); setCurrentExecution(null); setIsRunning(false); }}
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">{selectedWorkflow.name}</h1>
              {isRunning && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold animate-pulse">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  Agent Running...
                </span>
              )}
              {!isRunning && currentExecution && (
                <WorkflowStatusBadge status={currentExecution.status} />
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {currentExecution?.subjectName || 'Initializing...'}
            </p>
          </div>
          {!isRunning && (
            <button
              onClick={() => handleRunWorkflow(selectedWorkflow)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              Re-Run
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Live Workflow Visualization */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-auto" style={{ minHeight: '600px' }}>
            <div className="flex items-center gap-2 mb-6">
              <Brain className="w-4 h-4 text-primary-600" />
              <h2 className="font-bold text-slate-900">Live Agent Execution</h2>
              {currentExecution && (
                <span className="text-xs text-slate-400 ml-auto font-mono">
                  {currentExecution.id}
                </span>
              )}
            </div>
            <WorkflowFlow
              workflow={selectedWorkflow}
              stepsStatus={executionStepsStatus}
              onNodeClick={(node) => setSelectedNode(node)}
            />
          </div>

          {/* Execution Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-auto" style={{ maxHeight: '700px' }}>
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary-600" />
              Execution Log
            </h2>

            {currentExecution ? (
              <>
                <ExecutionTimeline execution={currentExecution} />

                {/* Final Decision */}
                {!isRunning && currentExecution.finalDecision && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'mt-6 p-4 rounded-xl border-2',
                      currentExecution.finalDecision === 'approve' ? 'bg-emerald-50 border-emerald-300' :
                      currentExecution.finalDecision === 'reject' ? 'bg-red-50 border-red-300' :
                      currentExecution.finalDecision === 'freeze_account' ? 'bg-red-50 border-red-300' :
                      'bg-amber-50 border-amber-300'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {currentExecution.finalDecision === 'approve' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                      {currentExecution.finalDecision === 'reject' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                      {currentExecution.finalDecision === 'freeze_account' && <Shield className="w-5 h-5 text-red-600" />}
                      {currentExecution.finalDecision === 'flag' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                      {currentExecution.finalDecision === 'log_audit' && <FileText className="w-5 h-5 text-blue-600" />}
                      <span className="font-bold text-slate-900 capitalize">
                        Final Decision: {currentExecution.finalDecision.replace('_', ' ')}
                      </span>
                    </div>
                    {currentExecution.aiConfidence && (
                      <div className="text-sm text-slate-600">
                        AI Confidence: <span className="font-bold text-primary-700">{currentExecution.aiConfidence}%</span>
                      </div>
                    )}
                    {currentExecution.totalDuration && (
                      <div className="text-sm text-slate-600 mt-1">
                        Total time: <span className="font-bold">{(currentExecution.totalDuration / 1000).toFixed(1)}s</span>
                        <span className="text-xs text-slate-400 ml-2">(vs 2-3 business days manually)</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {currentExecution.status === 'waiting_human' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-orange-50 rounded-xl border-2 border-orange-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="w-5 h-5 text-orange-600" />
                      <span className="font-bold text-orange-800">Waiting for Human Review</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      The AI agent has escalated this case for manual review. A human analyst needs to make the final decision.
                    </p>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Brain className="w-12 h-12 mb-3 animate-pulse text-primary-300" />
                <p className="text-sm">Initializing AI Agent...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}

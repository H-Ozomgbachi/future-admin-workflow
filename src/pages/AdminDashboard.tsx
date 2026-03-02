import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  MoreHorizontal,
  ArrowRight,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import { loans, transactions, alerts } from '../data/mockData';

const data = [
  { name: 'Mon', risk: 40, volume: 2400 },
  { name: 'Tue', risk: 30, volume: 1398 },
  { name: 'Wed', risk: 20, volume: 9800 },
  { name: 'Thu', risk: 27, volume: 3908 },
  { name: 'Fri', risk: 18, volume: 4800 },
  { name: 'Sat', risk: 23, volume: 3800 },
  { name: 'Sun', risk: 34, volume: 4300 },
];

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Operational Dashboard</h1>
          <p className="text-slate-500 mt-1">AI-driven insights for daily operations</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            <Clock className="w-4 h-4" />
            Last 24 Hours
          </button>
        </div>
      </div>

      {/* Smart Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">12</div>
          <div className="text-sm text-slate-500 mt-1">Safe for Auto-Approval</div>
          <div className="mt-4 text-xs text-slate-400">AI Confidence &gt; 95%</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Urgent</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">3</div>
          <div className="text-sm text-slate-500 mt-1">High-Risk Accounts</div>
          <div className="mt-4 text-xs text-slate-400">Requires manual review</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">+8%</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">Fraud Risk</div>
          <div className="text-sm text-slate-500 mt-1">Daily Trend</div>
          <div className="mt-4 h-10 w-full">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <Area type="monotone" dataKey="risk" stroke="#ef4444" fill="#fee2e2" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary-600" />
            </div>
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">Segment B</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">6%</div>
          <div className="text-sm text-slate-500 mt-1">Default Probability</div>
          <div className="mt-4 text-xs text-slate-400">Trending upward today</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Loan Applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-semibold text-slate-900">Recent Loan Applications</h2>
              <button className="text-sm text-primary-600 font-medium hover:text-primary-700">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Applicant</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Risk Score</th>
                    <th className="px-6 py-4">AI Recommendation</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{loan.customerName}</div>
                        <div className="text-xs text-slate-500">{loan.purpose}</div>
                      </td>
                      <td className="px-6 py-4 font-mono">{formatCurrency(loan.amount)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-16 h-2 rounded-full overflow-hidden bg-slate-100",
                          )}>
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                loan.riskScore < 30 ? "bg-green-500" : loan.riskScore < 70 ? "bg-amber-500" : "bg-red-500"
                              )} 
                              style={{ width: `${loan.riskScore}%` }}
                            />
                          </div>
                          <span className={cn(
                            "text-xs font-medium",
                            loan.riskScore < 30 ? "text-green-600" : loan.riskScore < 70 ? "text-amber-600" : "text-red-600"
                          )}>{loan.riskScore}/100</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                          loan.aiRecommendation === 'approve' ? "bg-green-50 text-green-700 border-green-200" :
                          loan.aiRecommendation === 'escalate' ? "bg-red-50 text-red-700 border-red-200" :
                          "bg-slate-50 text-slate-700 border-slate-200"
                        )}>
                          {loan.aiRecommendation === 'approve' && <CheckCircle className="w-3 h-3" />}
                          {loan.aiRecommendation === 'escalate' && <ShieldAlert className="w-3 h-3" />}
                          {loan.aiRecommendation.charAt(0).toUpperCase() + loan.aiRecommendation.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-slate-400 hover:text-primary-600">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-semibold text-slate-900">Suspicious Transactions</h2>
              <button className="text-sm text-primary-600 font-medium hover:text-primary-700">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Anomaly Score</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.filter(t => t.anomalyScore > 50).map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{tx.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{formatCurrency(tx.amount)}</td>
                      <td className="px-6 py-4 capitalize text-slate-600">{tx.type.replace('_', ' ')}</td>
                      <td className="px-6 py-4">
                        <span className="text-red-600 font-medium">{tx.anomalyScore}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                          Flagged
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar - Alerts & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary-600" />
              AI Risk Alerts
            </h3>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary-200 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                      alert.severity === 'critical' ? "bg-red-100 text-red-700" :
                      alert.severity === 'high' ? "bg-orange-100 text-orange-700" :
                      "bg-blue-100 text-blue-700"
                    )}>
                      {alert.severity}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(alert.timestamp)}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 group-hover:text-primary-700 transition-colors">
                    {alert.message}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                    AI Analyzing...
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
              View All Alerts
            </button>
          </div>

          <div className="bg-primary-900 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10" />
            <h3 className="font-semibold mb-2 relative z-10">Quick Scan</h3>
            <p className="text-primary-200 text-sm mb-4 relative z-10">
              Upload a document or paste a transaction ID for instant AI analysis.
            </p>
            <div className="relative z-10 space-y-3">
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                Scan Transaction
              </button>
              <button className="w-full py-2 bg-white text-primary-900 hover:bg-primary-50 rounded-lg text-sm font-medium transition-colors">
                Upload KYC Doc
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { motion } from 'motion/react';
import { 
  Globe, 
  TrendingUp, 
  ShieldAlert, 
  Activity, 
  Users, 
  DollarSign,
  MapPin,
  ArrowUpRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Legend
} from 'recharts';
import { cn } from '../lib/utils';

const predictionData = [
  { month: 'Jan', actual: 2.4, predicted: 2.5 },
  { month: 'Feb', actual: 2.6, predicted: 2.7 },
  { month: 'Mar', actual: 2.8, predicted: 2.9 },
  { month: 'Apr', actual: null, predicted: 3.2 },
  { month: 'May', actual: null, predicted: 3.5 },
  { month: 'Jun', actual: null, predicted: 3.8 },
];

const riskHeatmapData = [
  { x: 10, y: 30, z: 200, name: 'Segment A' },
  { x: 30, y: 200, z: 260, name: 'Segment B' },
  { x: 45, y: 100, z: 400, name: 'Segment C' },
  { x: 50, y: 400, z: 280, name: 'Segment D' },
  { x: 70, y: 150, z: 100, name: 'Segment E' },
  { x: 100, y: 250, z: 500, name: 'High Risk' },
];

export function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Risk Command Center</h1>
          <p className="text-slate-500 mt-1">Strategic oversight and predictive intelligence</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            Export Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-800 shadow-lg shadow-primary-900/20">
            <Activity className="w-4 h-4" />
            Live Monitoring
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe className="w-24 h-24 text-primary-600" />
          </div>
          <div className="text-sm font-medium text-slate-500 mb-1">Global Risk Exposure</div>
          <div className="text-3xl font-bold text-slate-900">$12.4M</div>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-red-600">
            <TrendingUp className="w-3 h-3" />
            +2.4% vs last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldAlert className="w-24 h-24 text-amber-600" />
          </div>
          <div className="text-sm font-medium text-slate-500 mb-1">Fraud Attempts</div>
          <div className="text-3xl font-bold text-slate-900">1,204</div>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-green-600">
            <TrendingUp className="w-3 h-3 rotate-180" />
            -12% AI Prevention Rate
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-24 h-24 text-blue-600" />
          </div>
          <div className="text-sm font-medium text-slate-500 mb-1">Active Users</div>
          <div className="text-3xl font-bold text-slate-900">45.2K</div>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-blue-600">
            <ArrowUpRight className="w-3 h-3" />
            +850 this week
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-24 h-24 text-emerald-600" />
          </div>
          <div className="text-sm font-medium text-slate-500 mb-1">Liquidity Ratio</div>
          <div className="text-3xl font-bold text-slate-900">14.2%</div>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
            <CheckCircle className="w-3 h-3" />
            Healthy
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Predictive Default Rate */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-semibold text-slate-900">Projected Default Rate</h3>
              <p className="text-sm text-slate-500">AI Forecast for Q2 2024</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium bg-primary-50 text-primary-700 px-3 py-1 rounded-full border border-primary-100">
              <Sparkles className="w-3 h-3" />
              AI Confidence: 89%
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#ae328e" strokeWidth={3} dot={{ r: 4 }} name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="#94a3b8" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} name="AI Predicted" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Heatmap */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-semibold text-slate-900">Risk Heatmap</h3>
              <p className="text-sm text-slate-500">Loan Size vs. Risk Score</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-red-500" /> High Risk
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-green-500" /> Low Risk
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" dataKey="x" name="Risk Score" unit="" axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="y" name="Loan Size" unit="k" axisLine={false} tickLine={false} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Segments" data={riskHeatmapData} fill="#8884d8">
                  {riskHeatmapData.map((entry, index) => (
                    <cell key={`cell-${index}`} fill={entry.x > 60 ? '#ef4444' : entry.x > 30 ? '#f59e0b' : '#22c55e'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Escalations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            High Priority Escalations
          </h2>
          <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Case ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">AI Confidence</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Recommended Action</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-500">#ESC-2024-001</td>
                <td className="px-6 py-4 font-medium text-slate-900">Fraud Ring</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-red-500 w-[98%]" />
                    </div>
                    <span className="text-xs font-medium text-red-600">98%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">Linked to known synthetic identities</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                    Immediate Freeze
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary-600 hover:text-primary-800 font-medium text-xs">Review</button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-500">#ESC-2024-002</td>
                <td className="px-6 py-4 font-medium text-slate-900">Large Loan</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-amber-500 w-[75%]" />
                    </div>
                    <span className="text-xs font-medium text-amber-600">75%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">Exceeds auto-approval limit ($50k)</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                    Manual Audit
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary-600 hover:text-primary-800 font-medium text-xs">Review</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

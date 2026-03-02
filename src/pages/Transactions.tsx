import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Smartphone, 
  Globe, 
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
  ShieldCheck
} from 'lucide-react';
import { transactions } from '../data/mockData';
import { cn, formatCurrency, formatDate } from '../lib/utils';

export function Transactions() {
  const [filter, setFilter] = useState<'all' | 'flagged' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filter === 'all' || 
      (filter === 'flagged' && (t.status === 'flagged' || t.status === 'failed')) ||
      (filter === 'completed' && t.status === 'completed');
    
    const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transaction Monitoring</h1>
          <p className="text-slate-500 mt-1">AI-powered anomaly detection and fraud prevention</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search ID, Customer, Location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* AI Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <AlertTriangle className="w-24 h-24 text-red-600" />
          </div>
          <div className="text-sm font-medium text-slate-500 mb-1">High Risk Transactions</div>
          <div className="text-3xl font-bold text-slate-900">
            {transactions.filter(t => t.anomalyScore > 80).length}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded w-fit">
            <AlertTriangle className="w-3 h-3" />
            Requires immediate review
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Globe className="w-24 h-24 text-primary-600" />
          </div>
          <div className="text-sm font-medium text-slate-500 mb-1">Cross-Border Spikes</div>
          <div className="text-3xl font-bold text-slate-900">
            {transactions.filter(t => t.location.includes('NG') || t.location.includes('RU') || t.location.includes('KR')).length}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded w-fit">
            <Globe className="w-3 h-3" />
            Unusual location patterns
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldCheck className="w-24 h-24 text-green-600" />
          </div>
          <div className="text-sm font-medium text-slate-500 mb-1">AI Auto-Cleared</div>
          <div className="text-3xl font-bold text-slate-900">
            {transactions.filter(t => t.anomalyScore < 20).length}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded w-fit">
            <CheckCircle className="w-3 h-3" />
            99.9% Confidence
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4 overflow-x-auto">
          <button 
            onClick={() => setFilter('all')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
              filter === 'all' ? "bg-primary-50 text-primary-700" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            All Transactions
          </button>
          <button 
            onClick={() => setFilter('flagged')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
              filter === 'flagged' ? "bg-red-50 text-red-700" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            Flagged & Failed
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
              filter === 'completed' ? "bg-green-50 text-green-700" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            Completed
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Context</th>
                <th className="px-6 py-4">AI Anomaly Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-slate-500">{tx.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{tx.customerId}</div>
                    <div className="text-xs text-slate-500">{formatDate(tx.timestamp)}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{formatCurrency(tx.amount)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 capitalize text-slate-700">
                      {tx.type === 'transfer' || tx.type === 'withdrawal' ? (
                        <ArrowUpRight className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4 text-slate-400" />
                      )}
                      {tx.type.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {tx.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Smartphone className="w-3 h-3" /> {tx.device}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full overflow-hidden bg-slate-100">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            tx.anomalyScore < 30 ? "bg-green-500" : tx.anomalyScore < 70 ? "bg-amber-500" : "bg-red-500"
                          )} 
                          style={{ width: `${tx.anomalyScore}%` }}
                        />
                      </div>
                      <span className={cn(
                        "text-xs font-medium",
                        tx.anomalyScore < 30 ? "text-green-600" : tx.anomalyScore < 70 ? "text-amber-600" : "text-red-600"
                      )}>{tx.anomalyScore}%</span>
                    </div>
                    {tx.flagReason && (
                      <div className="text-[10px] text-red-500 mt-1 max-w-[150px] leading-tight">
                        {tx.flagReason}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1",
                      tx.status === 'completed' ? "bg-green-100 text-green-700" :
                      tx.status === 'flagged' ? "bg-red-100 text-red-700" :
                      tx.status === 'failed' ? "bg-slate-100 text-slate-700" :
                      "bg-blue-100 text-blue-700"
                    )}>
                      {tx.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                      {tx.status === 'flagged' && <AlertTriangle className="w-3 h-3" />}
                      {tx.status === 'failed' && <XCircle className="w-3 h-3" />}
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-primary-600 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MapPin({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

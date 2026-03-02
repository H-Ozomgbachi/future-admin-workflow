import { useState } from 'react';
import { 
  Shield, 
  AlertOctagon, 
  Search, 
  Download, 
  UserCog,
  FileKey,
  Eye
} from 'lucide-react';
import { auditLogs } from '../data/mockData';
import { cn, formatDate } from '../lib/utils';

export function AuditLogs() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Audit Logs</h1>
          <p className="text-slate-500 mt-1">AI-monitored activity log for compliance and security</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Target</th>
              <th className="px-6 py-4">AI Risk Assessment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <tr key={log.id} className={cn(
                "hover:bg-slate-50 transition-colors",
                log.riskFlag ? "bg-red-50/30" : ""
              )}>
                <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                      {log.adminName.charAt(0)}
                    </div>
                    <span className="font-medium text-slate-900">{log.adminName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-700">
                    {log.action.includes('View') ? <Eye className="w-4 h-4 text-slate-400" /> :
                     log.action.includes('Export') ? <Download className="w-4 h-4 text-slate-400" /> :
                     <UserCog className="w-4 h-4 text-slate-400" />}
                    {log.action}
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500">
                  {log.target}
                </td>
                <td className="px-6 py-4">
                  {log.riskFlag ? (
                    <div className="flex items-start gap-2 p-2 bg-red-50 rounded-lg border border-red-100">
                      <AlertOctagon className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-red-700">Unusual Activity Detected</div>
                        <div className="text-[10px] text-red-600 mt-0.5">{log.aiReason}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Shield className="w-3 h-3" />
                      Normal
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

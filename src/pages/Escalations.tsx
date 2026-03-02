import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  MessageSquare,
  FileText,
  User
} from 'lucide-react';
import { escalations } from '../data/mockData';
import { cn, formatDate } from '../lib/utils';

export function Escalations() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Escalation Management</h1>
          <p className="text-slate-500 mt-1">AI-prioritized high-risk cases requiring executive review</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {escalations.map((esc) => (
          <motion.div 
            key={esc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  esc.priority === 'critical' ? "bg-red-100 text-red-600" :
                  esc.priority === 'high' ? "bg-orange-100 text-orange-600" :
                  "bg-blue-100 text-blue-600"
                )}>
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-lg">Case #{esc.id}</h3>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                      esc.priority === 'critical' ? "bg-red-100 text-red-700" :
                      esc.priority === 'high' ? "bg-orange-100 text-orange-700" :
                      "bg-blue-100 text-blue-700"
                    )}>
                      {esc.priority} Priority
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    Created {formatDate(esc.createdDate)} • Subject: <span className="font-medium text-slate-700">{esc.subjectName}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">
                  View Raw Data
                </button>
                <button className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary-600/20">
                  Take Action
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-500" />
                    <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-primary-500" />
                      AI Executive Summary
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {esc.aiSummary}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                        AI Confidence: <span className="font-bold text-slate-900">{esc.aiConfidence}%</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <FileText className="w-3 h-3" />
                        Source: {esc.type.toUpperCase()} Engine
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recommended Actions</h4>
                  <button className="w-full p-3 bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50 rounded-xl text-left transition-all group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900 group-hover:text-red-700">Freeze Account</span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-red-500" />
                    </div>
                    <p className="text-xs text-slate-500 group-hover:text-red-600/80">Prevent further transactions immediately.</p>
                  </button>
                  <button className="w-full p-3 bg-white border border-slate-200 hover:border-primary-300 hover:bg-primary-50 rounded-xl text-left transition-all group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900 group-hover:text-primary-700">Request Enhanced KYC</span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary-500" />
                    </div>
                    <p className="text-xs text-slate-500 group-hover:text-primary-600/80">Ask user for video verification.</p>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

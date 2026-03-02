import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  User, 
  FileText, 
  ScanFace, 
  ShieldCheck,
  ChevronRight,
  Eye
} from 'lucide-react';
import { kycRequests } from '../data/mockData';
import { cn, formatDate } from '../lib/utils';

export function KYCVerification() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Smart KYC Verification</h1>
          <p className="text-slate-500 mt-1">AI-powered identity verification and document analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Verification Queue</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {kycRequests.map((req) => (
              <div 
                key={req.id} 
                className={cn(
                  "p-6 hover:bg-slate-50 transition-colors cursor-pointer group",
                  selectedRequest === req.id ? "bg-primary-50/50" : ""
                )}
                onClick={() => setSelectedRequest(req.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{req.customerName}</div>
                      <div className="text-xs text-slate-500">ID: {req.customerId} • {formatDate(req.submittedDate)}</div>
                    </div>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    req.status === 'verified' ? "bg-green-100 text-green-700" :
                    req.status === 'rejected' ? "bg-red-100 text-red-700" :
                    req.status === 'manual_review' ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  )}>
                    {req.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                      <ScanFace className="w-3 h-3" /> Face Match Score
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            req.faceMatchScore > 80 ? "bg-green-500" : req.faceMatchScore > 50 ? "bg-amber-500" : "bg-red-500"
                          )}
                          style={{ width: `${req.faceMatchScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{req.faceMatchScore}%</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Doc Authenticity
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            req.docAuthenticityScore > 80 ? "bg-green-500" : req.docAuthenticityScore > 50 ? "bg-amber-500" : "bg-red-500"
                          )}
                          style={{ width: `${req.docAuthenticityScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{req.docAuthenticityScore}%</span>
                    </div>
                  </div>
                </div>

                {req.aiIssues.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {req.aiIssues.map((issue, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-red-50 text-red-600 border border-red-100">
                        <AlertTriangle className="w-3 h-3" />
                        {issue}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit sticky top-6">
          {selectedRequest ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">AI Analysis Detail</h3>
                <button 
                  onClick={() => setSelectedRequest(null)}
                  className="text-slate-400 hover:text-slate-600 lg:hidden"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden border border-slate-200">
                <div className="absolute inset-0 flex">
                  <div className="flex-1 bg-slate-200 flex items-center justify-center border-r border-white">
                    <User className="w-12 h-12 text-slate-400" />
                    <span className="absolute bottom-2 text-xs text-slate-500">Live Selfie</span>
                  </div>
                  <div className="flex-1 bg-slate-200 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-slate-400" />
                    <span className="absolute bottom-2 text-xs text-slate-500">ID Document</span>
                  </div>
                </div>
                
                {/* AI Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold text-primary-700 border border-primary-200">
                    <ScanFace className="w-4 h-4" />
                    Match Confidence: {kycRequests.find(r => r.id === selectedRequest)?.faceMatchScore}%
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                  <h4 className="text-sm font-medium text-primary-900 mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    AI Recommendation
                  </h4>
                  <p className="text-sm text-primary-800">
                    {kycRequests.find(r => r.id === selectedRequest)?.status === 'verified' 
                      ? "Identity verified with high confidence. Safe to approve."
                      : kycRequests.find(r => r.id === selectedRequest)?.status === 'rejected'
                      ? "Critical mismatches detected. Recommended rejection."
                      : "Ambiguous data points. Manual review required."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Approve
                  </button>
                  <button className="py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center">
              <Eye className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">Select a request to view AI analysis details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

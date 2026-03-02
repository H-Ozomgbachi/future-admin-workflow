import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  User, 
  CreditCard, 
  Activity,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { loans, customers } from '../data/mockData';
import { analyzeLoanWithAI } from '../services/ai';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import { LoanApplication } from '../types';

export function LoanProcessing() {
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<{ analysis: string; recommendation: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSelectLoan = async (loan: LoanApplication) => {
    setSelectedLoan(loan);
    setAiAnalysis(null);
    setIsAnalyzing(true);
    
    // Simulate network delay for effect
    const customer = customers.find(c => c.id === loan.customerId);
    if (customer) {
      const result = await analyzeLoanWithAI(loan, customer);
      setAiAnalysis(result);
    }
    setIsAnalyzing(false);
  };

  const handleBack = () => {
    setSelectedLoan(null);
    setAiAnalysis(null);
  };

  if (selectedLoan) {
    const customer = customers.find(c => c.id === selectedLoan.customerId);
    
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Loan List
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Loan Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Loan Application #{selectedLoan.id}</h1>
                  <p className="text-slate-500 mt-1">Applied on {formatDate(selectedLoan.appliedDate)}</p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium border",
                  selectedLoan.status === 'approved' ? "bg-green-50 text-green-700 border-green-200" :
                  selectedLoan.status === 'rejected' ? "bg-red-50 text-red-700 border-red-200" :
                  selectedLoan.status === 'escalated' ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-blue-50 text-blue-700 border-blue-200"
                )}>
                  {selectedLoan.status.charAt(0).toUpperCase() + selectedLoan.status.slice(1)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Requested Amount</div>
                  <div className="text-3xl font-bold text-slate-900">{formatCurrency(selectedLoan.amount)}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Term Length</div>
                  <div className="text-3xl font-bold text-slate-900">{selectedLoan.termMonths} <span className="text-lg font-normal text-slate-500">months</span></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <FileText className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">Purpose</div>
                    <div className="text-sm text-slate-500">{selectedLoan.purpose}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">Customer Profile</div>
                    <div className="text-sm text-slate-500">{customer?.name} • {customer?.email}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis Section */}
            <div className="bg-primary-900 rounded-2xl border border-primary-800 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20" />
              
              <div className="p-8 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-500/20 rounded-lg backdrop-blur-sm">
                    <Sparkles className="w-6 h-6 text-primary-300" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">AI Risk Intelligence</h2>
                    <p className="text-primary-300 text-sm">Real-time analysis by FinGuard Engine</p>
                  </div>
                </div>

                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-12 text-primary-300">
                    <Activity className="w-8 h-8 animate-spin mb-4" />
                    <p>Analyzing risk patterns...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-primary-950/50 p-4 rounded-xl border border-primary-500/30">
                        <div className="text-xs text-primary-300 mb-1">Risk Score</div>
                        <div className={cn(
                          "text-2xl font-bold",
                          selectedLoan.riskScore < 30 ? "text-green-400" : selectedLoan.riskScore < 70 ? "text-amber-400" : "text-red-400"
                        )}>
                          {selectedLoan.riskScore}/100
                        </div>
                      </div>
                      <div className="bg-primary-950/50 p-4 rounded-xl border border-primary-500/30">
                        <div className="text-xs text-primary-300 mb-1">Default Prob.</div>
                        <div className="text-2xl font-bold text-white">{selectedLoan.defaultProbability}%</div>
                      </div>
                      <div className="bg-primary-950/50 p-4 rounded-xl border border-primary-500/30">
                        <div className="text-xs text-primary-300 mb-1">Recommendation</div>
                        <div className="text-lg font-bold text-white uppercase tracking-wide">
                          {aiAnalysis?.recommendation || selectedLoan.aiRecommendation}
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary-950/30 p-6 rounded-xl border border-primary-500/20">
                      <h3 className="text-sm font-medium text-primary-200 mb-2">Analysis Summary</h3>
                      <p className="text-primary-100 leading-relaxed">
                        {aiAnalysis?.analysis || selectedLoan.aiReasoning}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Approve Loan
                </button>
                <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Escalate to Super Admin
                </button>
                <button className="w-full py-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Reject Application
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Customer History</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Credit Score</span>
                  <span className="font-medium text-slate-900">720</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Active Loans</span>
                  <span className="font-medium text-slate-900">1</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Total Repaid</span>
                  <span className="font-medium text-slate-900">$12,500</span>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Recent Activity</div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-slate-600">Loan Repayment</span>
                      <span className="ml-auto text-slate-400 text-xs">2d ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-slate-600">Profile Update</span>
                      <span className="ml-auto text-slate-400 text-xs">5d ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Loan Processing</h1>
          <p className="text-slate-500 mt-1">AI-assisted review queue</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Applicant</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Risk Score</th>
              <th className="px-6 py-4">AI Recommendation</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loans.map((loan) => (
              <tr 
                key={loan.id} 
                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => handleSelectLoan(loan)}
              >
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
                    {loan.aiRecommendation === 'escalate' && <AlertTriangle className="w-3 h-3" />}
                    {loan.aiRecommendation.charAt(0).toUpperCase() + loan.aiRecommendation.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    loan.status === 'approved' ? "bg-green-100 text-green-700" :
                    loan.status === 'rejected' ? "bg-red-100 text-red-700" :
                    loan.status === 'escalated' ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  )}>
                    {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-600 transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

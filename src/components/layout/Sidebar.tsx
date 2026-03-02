import { useState } from 'react';
import { LayoutDashboard, Users, FileText, Activity, ShieldAlert, PieChart, Settings, LogOut, MessageSquare, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  role: 'admin' | 'super_admin';
  onRoleChange: (role: 'admin' | 'super_admin') => void;
  activePage: string;
  onNavigate: (page: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ role, onRoleChange, activePage, onNavigate, isOpen, onClose }: SidebarProps) {
  const adminLinks = [
    { id: 'dashboard', label: 'Smart Dashboard', icon: LayoutDashboard },
    { id: 'loans', label: 'Loan Processing', icon: FileText },
    { id: 'transactions', label: 'Transactions', icon: Activity },
    { id: 'kyc', label: 'KYC Verification', icon: Users },
  ];

  const superAdminLinks = [
    { id: 'dashboard', label: 'Strategic Overview', icon: PieChart },
    { id: 'risk-heatmap', label: 'Risk Heatmap', icon: Activity },
    { id: 'escalations', label: 'Escalations', icon: ShieldAlert },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
  ];

  const links = role === 'admin' ? adminLinks : superAdminLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 transform transition-transform duration-200 ease-in-out lg:transform-none flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/50">
              <ShieldAlert className="text-white w-5 h-5" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">FinGuard AI</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-2">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-mono">
            {role === 'admin' ? 'Operational View' : 'Risk Command'}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                onClose?.();
              }}
              className={cn(
                "flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                activePage === link.id
                  ? "bg-primary-600 text-white shadow-md shadow-primary-900/20"
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <link.icon className={cn(
                "w-5 h-5 mr-3 transition-colors",
                activePage === link.id ? "text-white" : "text-slate-400 group-hover:text-white"
              )} />
              {link.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="bg-slate-800/50 rounded-xl p-3 mb-4 border border-slate-700/50">
            <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Role Switcher</div>
            <div className="flex gap-2">
              <button
                onClick={() => onRoleChange('admin')}
                className={cn(
                  "flex-1 py-1.5 text-xs rounded-md font-medium transition-all",
                  role === 'admin' 
                    ? "bg-primary-600 text-white shadow-sm" 
                    : "bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white"
                )}
              >
                Admin
              </button>
              <button
                onClick={() => onRoleChange('super_admin')}
                className={cn(
                  "flex-1 py-1.5 text-xs rounded-md font-medium transition-all",
                  role === 'super_admin' 
                    ? "bg-primary-600 text-white shadow-sm" 
                    : "bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white"
                )}
              >
                Super
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600">
              {role === 'admin' ? 'AD' : 'SA'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">
                {role === 'admin' ? 'Alex Admin' : 'Sarah Super'}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {role === 'admin' ? 'Operations Lead' : 'Chief Risk Officer'}
              </div>
            </div>
            <LogOut className="w-4 h-4 text-slate-500 hover:text-white" />
          </div>
        </div>
      </div>
    </>
  );
}

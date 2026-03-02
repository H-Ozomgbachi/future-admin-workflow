import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { AdminDashboard } from './pages/AdminDashboard';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { LoanProcessing } from './pages/LoanProcessing';
import { Transactions } from './pages/Transactions';
import { KYCVerification } from './pages/KYCVerification';
import { Escalations } from './pages/Escalations';
import { AuditLogs } from './pages/AuditLogs';
import { WorkflowBuilder } from './pages/WorkflowBuilder';
import { WorkflowMonitor } from './pages/WorkflowMonitor';

export default function App() {
  // Simple state-based routing for the demo
  const [role, setRole] = useState<'admin' | 'super_admin'>('admin');
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    if (role === 'admin') {
      switch (activePage) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'loans':
          return <LoanProcessing />;
        case 'transactions':
          return <Transactions />;
        case 'kyc':
          return <KYCVerification />;
        default:
          return <AdminDashboard />;
      }
    } else {
      switch (activePage) {
        case 'dashboard':
          return <SuperAdminDashboard />;
        case 'workflows':
          return <WorkflowBuilder />;
        case 'workflow-monitor':
          return <WorkflowMonitor />;
        case 'risk-heatmap':
          return <SuperAdminDashboard />; // Reusing dashboard for demo as it contains the heatmap
        case 'escalations':
          return <Escalations />;
        case 'audit':
          return <AuditLogs />;
        default:
          return <SuperAdminDashboard />;
      }
    }
  };

  return (
    <Layout 
      role={role} 
      onRoleChange={(newRole) => {
        setRole(newRole);
        setActivePage('dashboard');
      }}
      activePage={activePage}
      onNavigate={setActivePage}
    >
      {renderPage()}
    </Layout>
  );
}

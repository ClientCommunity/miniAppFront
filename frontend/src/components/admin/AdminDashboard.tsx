import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import type { AdminTab } from './AdminSidebar';
import { OverviewModule } from './modules/OverviewModule';
import { ContestsModule } from './modules/ContestsModule';
import { RafflesModule } from './modules/RafflesModule';
import { TasksModule } from './modules/TasksModule';
import { UsersModule } from './modules/UsersModule';
import { WithdrawalsModule } from './modules/WithdrawalsModule';
import { GiftCodesModule } from './modules/GiftCodesModule';
import { SweepsModule } from './modules/SweepsModule';
import { SupportModule } from './modules/SupportModule';
import { VaultSetupWizardModal } from './VaultSetupWizardModal';
import { adminService } from '../../services/adminService';
import { notifyToast } from '../../utils/debugToast';
import { haptics } from '../../utils/haptics';

interface AdminDashboardProps {
  onBackToApp: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp, onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [showSetupWizard, setShowSetupWizard] = useState(false);

  // Initialization check on dashboard boot
  useEffect(() => {
    const checkVaultInitialization = async () => {
      try {
        const res = await adminService.getMasterVaultStatus();
        if (res.data && res.data.is_initialized === false) {
          setShowSetupWizard(true);
        }
      } catch (err) {
        console.error('Failed to check vault status:', err);
      }
    };
    checkVaultInitialization();
  }, []);

  const handleLogout = () => {
    adminService.logout();
    haptics.notification('warning');
    notifyToast('Admin session locked', 'info', 2500);
    onLogout();
  };

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewModule />;
      case 'contests':
        return <ContestsModule />;
      case 'raffles':
        return <RafflesModule />;
      case 'tasks':
        return <TasksModule />;
      case 'users':
        return <UsersModule />;
      case 'withdrawals':
        return <WithdrawalsModule />;
      case 'giftcodes':
        return <GiftCodesModule />;
      case 'sweeps':
        return <SweepsModule />;
      case 'support':
        return <SupportModule />;
      default:
        return <OverviewModule />;
    }
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#070a12',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}
    >
      {/* First-Time Master Vault Setup Wizard Modal */}
      <VaultSetupWizardModal
        isOpen={showSetupWizard}
        onInitialized={() => setShowSetupWizard(false)}
        onCancel={onBackToApp}
      />

      {/* Executive Dark Top Header */}
      <div
        style={{
          background: '#090d16',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.65rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          position: 'sticky',
          top: 0,
          zIndex: 60
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: '#ffffff',
              color: '#070a12',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '0.85rem'
            }}
          >
            ⚙
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff', letterSpacing: '-0.2px' }}>
                Admin Console
              </span>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#94a3b8',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '4px',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.5px'
                }}
              >
                PROD
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={onBackToApp}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              borderRadius: '7px',
              padding: '0.4rem 0.8rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'background 0.15s ease'
            }}
          >
            <span>📱</span>
            <span>Return to App</span>
          </button>

          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171',
              borderRadius: '7px',
              padding: '0.4rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Lock 🔒
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(t) => {
          haptics.impact('light');
          setActiveTab(t);
        }}
      />

      {/* Main Module Content Area */}
      <div
        style={{
          flex: 1,
          padding: '1.25rem',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box'
        }}
      >
        {renderActiveModule()}
      </div>
    </div>
  );
};

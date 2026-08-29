import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/adminService';
import type { AdminOverviewMetrics, MasterVaultStatus } from '../../../types/admin';
import { notifyToast } from '../../../utils/debugToast';
import { copyTextSafe } from '../../../utils/clipboard';

const formatUsd = (val?: number | null): string => {
  if (val === undefined || val === null || isNaN(Number(val))) return '0.00';
  return Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatCount = (val?: number | null): string => {
  if (val === undefined || val === null || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString('en-US');
};

export const OverviewModule: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminOverviewMetrics | null>(null);
  const [vault, setVault] = useState<MasterVaultStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [mRes, vRes] = await Promise.all([
        adminService.getOverviewMetrics(),
        adminService.getMasterVaultStatus()
      ]);
      if (mRes.data) setMetrics(mRes.data);
      if (vRes.data) setVault(vRes.data);
    } catch (err: any) {
      notifyToast(`Failed to refresh metrics: ${err.message}`, 'error', 3000);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const copyAddress = async (addr: string) => {
    await copyTextSafe(addr, 'Master Vault Address');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', color: '#94a3b8' }}>
        <div className="skeleton-glow-box" style={{ width: '100%', height: '220px', borderRadius: '16px' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header bar with Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: '#ffffff', fontSize: '1.3rem', fontWeight: 800 }}>
            📊 System Overview & Master Vault
          </h2>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Real-time telemetry and hot wallet reserves</span>
        </div>
        <button
          onClick={loadData}
          disabled={isRefreshing}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#38bdf8',
            borderRadius: '10px',
            padding: '0.45rem 0.85rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          {isRefreshing ? '⏳ Refreshing...' : '🔄 Refresh Data'}
        </button>
      </div>

      {/* Master Vault Status Card */}
      {vault && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
            border: '1px solid rgba(52, 211, 153, 0.35)',
            borderRadius: '16px',
            padding: '1.2rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.3rem' }}>🏦</span>
              <h3 style={{ margin: 0, color: '#a7f3d0', fontSize: '1.05rem', fontWeight: 800 }}>
                Master Treasury Vault (BEP-20)
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  adminService.downloadVaultSecretsFile();
                  notifyToast('📥 Master Vault Secrets (.txt) downloaded', 'success', 3000);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#38bdf8',
                  borderRadius: '8px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>Backup Secrets 📥</span>
              </button>
              <span
                style={{
                  background: vault.bnb_gas_status === 'healthy' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                  color: vault.bnb_gas_status === 'healthy' ? '#34d399' : '#f87171',
                  border: `1px solid ${vault.bnb_gas_status === 'healthy' ? 'rgba(52, 211, 153, 0.4)' : 'rgba(248, 113, 113, 0.4)'}`,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}
              >
                Gas: {vault.bnb_gas_status}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '0.75rem', borderRadius: '10px', minWidth: 0 }}>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                Master Address
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                <span
                  title={vault.master_address}
                  style={{
                    color: '#f1f5f9',
                    fontFamily: 'monospace',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 'calc(100% - 30px)'
                  }}
                >
                  {vault.master_address
                    ? `${vault.master_address.substring(0, 6)}...${vault.master_address.substring(vault.master_address.length - 4)}`
                    : 'N/A'}
                </span>
                <button
                  onClick={() => copyAddress(vault.master_address)}
                  title="Copy full address"
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.45rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  📋
                </button>
              </div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '0.75rem', borderRadius: '10px', minWidth: 0 }}>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                BNB Gas Reserve
              </span>
              <span style={{ color: '#fef08a', fontSize: '1rem', fontWeight: 800 }}>
                {vault.bnb_gas_balance} BNB
              </span>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '0.75rem', borderRadius: '10px', minWidth: 0 }}>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                USDT Liquidity Reserve
              </span>
              <span style={{ color: '#34d399', fontSize: '1rem', fontWeight: 800 }}>
                ${formatUsd(vault.usdt_reserve_balance)} USDT
              </span>
            </div>
          </div>
        </div>
      )}

      {/* KPI Metric Cards Grid */}
      {metrics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
          {/* Card 1: Deposits */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600 }}>Total Deposits</span>
              <span style={{ fontSize: '1.1rem' }}>📥</span>
            </div>
            <span style={{ color: '#10b981', fontSize: '1.35rem', fontWeight: 900 }}>
              ${formatUsd(metrics.total_deposits_usd)}
            </span>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Gross user on-chain deposits</span>
          </div>

          {/* Card 2: Withdrawals */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600 }}>Total Cashouts</span>
              <span style={{ fontSize: '1.1rem' }}>📤</span>
            </div>
            <span style={{ color: '#f59e0b', fontSize: '1.35rem', fontWeight: 900 }}>
              ${formatUsd(metrics.total_withdrawals_usd)}
            </span>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Completed player payouts</span>
          </div>

          {/* Card 3: DAU */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600 }}>Daily Active Users</span>
              <span style={{ fontSize: '1.1rem' }}>👥</span>
            </div>
            <span style={{ color: '#38bdf8', fontSize: '1.35rem', fontWeight: 900 }}>
              {formatCount(metrics.active_users_dau)}
            </span>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Total: {formatCount(metrics.total_registered_users)} players</span>
          </div>

          {/* Card 4: Spins Today */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600 }}>Spins Played Today</span>
              <span style={{ fontSize: '1.1rem' }}>🎡</span>
            </div>
            <span style={{ color: '#c084fc', fontSize: '1.35rem', fontWeight: 900 }}>
              {formatCount(metrics.total_spins_today)}
            </span>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Wheel engagement volume</span>
          </div>
        </div>
      )}
    </div>
  );
};

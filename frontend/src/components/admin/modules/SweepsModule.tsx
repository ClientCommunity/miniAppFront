import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/adminService';
import type { AdminFailedTransaction } from '../../../types/admin';
import { notifyToast } from '../../../utils/debugToast';
import { haptics } from '../../../utils/haptics';

export const SweepsModule: React.FC = () => {
  const [transactions, setTransactions] = useState<AdminFailedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [sweepingId, setSweepingId] = useState<number | null>(null);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await adminService.getFailedTransactions();
      if (res.data) setTransactions(res.data);
    } catch (err: any) {
      notifyToast(`Failed to load stuck sweeps: ${err.message}`, 'error', 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleForceSweep = async (tx: AdminFailedTransaction) => {
    if (!window.confirm(`Force re-sweep invoice #${tx.id}? This will broadcast a BNB gas shot and USDT sweep transaction.`)) {
      return;
    }

    setSweepingId(tx.id);
    try {
      haptics.impact('heavy');
      const res = await adminService.forceSweepInvoice(tx.id);
      if (res.success) {
        notifyToast(`⚡ Force sweep dispatched!`, 'success', 4000);
        loadTransactions();
      } else {
        notifyToast(`Sweep failed: ${res.error || 'Server error'}`, 'error', 3500);
      }
    } catch (err: any) {
      notifyToast(`Error: ${err.message}`, 'error', 3500);
    } finally {
      setSweepingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: '#ffffff', fontSize: '1.3rem', fontWeight: 800 }}>
            🔍 Invoices & Sweep Auditor
          </h2>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Monitor stuck user deposit addresses and trigger automated gas sweeps</span>
        </div>
        <button
          onClick={loadTransactions}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#38bdf8',
            borderRadius: '10px',
            padding: '0.45rem 0.85rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          🔄 Refresh Invoices
        </button>
      </div>

      {/* Sweeps Table */}
      {loading ? (
        <div className="skeleton-glow-box" style={{ width: '100%', height: '220px', borderRadius: '16px' }} />
      ) : transactions.length === 0 ? (
        <div style={{ background: 'rgba(15, 23, 42, 0.75)', padding: '2rem', borderRadius: '14px', textAlign: 'center', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
          ✓ All user deposit sweeps are healthy and synchronized with Master Vault!
        </div>
      ) : (
        <div style={{ overflowX: 'auto', background: 'rgba(15, 23, 42, 0.75)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'rgba(0, 0, 0, 0.3)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '0.75rem 1rem' }}>User / Invoice</th>
                <th style={{ padding: '0.75rem 1rem' }}>Deposit Address</th>
                <th style={{ padding: '0.75rem 1rem' }}>USDT Detected</th>
                <th style={{ padding: '0.75rem 1rem' }}>BNB Gas Needed</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#f1f5f9' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 700 }}>@{t.username || 'user'}</div>
                    <div style={{ color: '#64748b', fontSize: '0.72rem' }}>Invoice #{t.id}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                    {t.deposit_address}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#10b981', fontWeight: 800 }}>
                    ${t.usdt_detected?.toFixed(2)} USDT
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#fef08a', fontWeight: 700 }}>
                    {t.bnb_gas_needed} BNB
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <button
                      disabled={sweepingId === t.id}
                      onClick={() => handleForceSweep(t)}
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#ffffff',
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {sweepingId === t.id ? 'Sweeping...' : 'Force Re-Sweep ⚡'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

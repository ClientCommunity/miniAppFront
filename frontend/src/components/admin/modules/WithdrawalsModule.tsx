import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/adminService';
import type { AdminWithdrawalItem } from '../../../types/admin';
import { notifyToast } from '../../../utils/debugToast';
import { haptics } from '../../../utils/haptics';

export const WithdrawalsModule: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawalItem[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const loadWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await adminService.getWithdrawals(statusFilter);
      if (res.data) setWithdrawals(res.data);
    } catch (err: any) {
      notifyToast(`Failed to load cashouts: ${err.message}`, 'error', 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, [statusFilter]);

  const handleApprove = async (w: AdminWithdrawalItem) => {
    if (!window.confirm(`Approve on-chain payout of $${w.net_amount_usd} USDT to ${w.destination_address}?`)) {
      return;
    }

    setProcessingId(w.id);
    try {
      haptics.impact('heavy');
      const res = await adminService.approveWithdrawal(w.id);
      if (res.success) {
        notifyToast(`🚀 On-chain payout dispatched!`, 'success', 4000);
        loadWithdrawals();
      } else {
        notifyToast(`Payout failed: ${res.error || 'Check vault balance'}`, 'error', 4000);
      }
    } catch (err: any) {
      notifyToast(`Error: ${err.message}`, 'error', 3500);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (w: AdminWithdrawalItem) => {
    const reason = window.prompt(`Enter rejection reason for @${w.username} (funds will be refunded to user):`, 'Suspicious activity / Invalid wallet');
    if (reason === null) return;

    setProcessingId(w.id);
    try {
      await adminService.rejectWithdrawal(w.id, reason.trim() || 'Admin rejected');
      notifyToast(`Cashout rejected & refunded to user`, 'info', 3000);
      loadWithdrawals();
    } catch (err: any) {
      notifyToast(`Error: ${err.message}`, 'error', 3500);
    } finally {
      setProcessingId(null);
    }
  };

  const downloadCsv = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notifyToast(`📥 Downloading ${filename}...`, 'info', 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & CSV Exporters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ margin: 0, color: '#ffffff', fontSize: '1.3rem', fontWeight: 800 }}>
            💸 Withdrawals Cashout Queue
          </h2>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Review, approve on-chain USDT payouts, or reject & refund</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => downloadCsv(adminService.getWithdrawalsCsvUrl(), 'withdrawals.csv')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#38bdf8',
              borderRadius: '8px',
              padding: '0.45rem 0.8rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            📊 Export Cashouts CSV
          </button>
          <button
            onClick={() => downloadCsv(adminService.getUsersCsvUrl(), 'users.csv')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#34d399',
              borderRadius: '8px',
              padding: '0.45rem 0.8rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            👥 Export Users CSV
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        {['all', 'pending', 'completed', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            style={{
              background: statusFilter === st ? 'rgba(56, 189, 248, 0.25)' : 'rgba(0, 0, 0, 0.3)',
              color: statusFilter === st ? '#38bdf8' : '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'capitalize',
              cursor: 'pointer'
            }}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Withdrawals Table */}
      {loading ? (
        <div className="skeleton-glow-box" style={{ width: '100%', height: '220px', borderRadius: '16px' }} />
      ) : (
        <div style={{ overflowX: 'auto', background: 'rgba(15, 23, 42, 0.75)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'rgba(0, 0, 0, 0.3)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '0.75rem 1rem' }}>User</th>
                <th style={{ padding: '0.75rem 1rem' }}>Net Amount</th>
                <th style={{ padding: '0.75rem 1rem' }}>Destination Address (BEP-20)</th>
                <th style={{ padding: '0.75rem 1rem' }}>Requested</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#f1f5f9' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 700 }}>@{w.username || 'unknown'}</div>
                    <div style={{ color: '#64748b', fontSize: '0.72rem' }}>ID: {w.telegram_id}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#10b981', fontWeight: 800, fontSize: '0.95rem' }}>
                    ${w.net_amount_usd?.toFixed(2)} USDT
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                    {w.destination_address}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                    {new Date(w.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span
                      style={{
                        background:
                          w.status === 'pending'
                            ? 'rgba(245, 158, 11, 0.2)'
                            : w.status === 'completed'
                            ? 'rgba(16, 185, 129, 0.2)'
                            : 'rgba(239, 68, 68, 0.2)',
                        color:
                          w.status === 'pending'
                            ? '#f59e0b'
                            : w.status === 'completed'
                            ? '#34d399'
                            : '#f87171',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}
                    >
                      {w.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    {w.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          disabled={processingId === w.id}
                          onClick={() => handleApprove(w)}
                          style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#ffffff',
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {processingId === w.id ? 'Sending...' : 'Approve 🚀'}
                        </button>
                        <button
                          disabled={processingId === w.id}
                          onClick={() => handleReject(w)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#f87171',
                            borderRadius: '6px',
                            padding: '0.35rem 0.55rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
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

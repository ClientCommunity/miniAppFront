import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/adminService';
import type { AdminUserListItem } from '../../../types/admin';
import { notifyToast } from '../../../utils/debugToast';
import { haptics } from '../../../utils/haptics';
import { copyTextSafe } from '../../../utils/clipboard';
import { downloadCsvAuthenticated } from '../../../utils/csvDownloader';

export const UsersModule: React.FC = () => {
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Balance Adjuster Modal
  const [adjustingUser, setAdjustingUser] = useState<AdminUserListItem | null>(null);
  const [adjustType, setAdjustType] = useState<'diamonds' | 'spins' | 'balance_usd'>('diamonds');
  const [adjustAmount, setAdjustAmount] = useState('100');
  const [auditReason, setAuditReason] = useState('Manual admin correction');
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      if (searchQuery.trim()) {
        const res = await adminService.lookupUser(searchQuery.trim());
        if (res.data) {
          const list = Array.isArray(res.data) ? res.data : ((res.data as any)?.users || (res.data as any)?.items || []);
          setUsers(list);
        }
      } else {
        const res = await adminService.getUsers();
        if (res.data) {
          const list = Array.isArray(res.data) ? res.data : ((res.data as any)?.users || (res.data as any)?.items || []);
          setUsers(list);
        }
      }
    } catch (err: any) {
      notifyToast(`Failed to load users: ${err.message}`, 'error', 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAdjustBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingUser) return;
    if (!auditReason.trim()) {
      notifyToast('Audit reason is mandatory for financial adjustments', 'info', 3000);
      return;
    }

    setSubmitting(true);
    try {
      const amt = parseFloat(adjustAmount) || 0;
      await adminService.adjustBalance({
        user_id: adjustingUser.id,
        adjustment_type: adjustType,
        amount: amt,
        audit_reason: auditReason.trim()
      });
      notifyToast(`Balance adjusted for @${adjustingUser.username}!`, 'success', 3000);
      setAdjustingUser(null);
      loadUsers();
    } catch (err: any) {
      notifyToast(`Adjustment failed: ${err.message}`, 'error', 3500);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleBan = async (user: AdminUserListItem) => {
    const action = user.is_banned ? 'Unban' : 'Ban';
    if (!window.confirm(`${action} user @${user.username} (ID: ${user.telegram_id})?`)) return;

    try {
      haptics.impact('heavy');
      await adminService.toggleUserBan(user.id, !user.is_banned, 'Admin action');
      notifyToast(`User @${user.username} ${user.is_banned ? 'unbanned' : 'banned'}`, 'info', 2500);
      loadUsers();
    } catch (err: any) {
      notifyToast(`Error: ${err.message}`, 'error', 3000);
    }
  };

  const handleExportCsv = async () => {
    const url = adminService.getUsersCsvUrl();
    await downloadCsvAuthenticated(url, 'users.csv');
  };

  const handleShareTempLink = async () => {
    const tempUrl = await adminService.getTempExportDownloadLink('users');
    await copyTextSafe(tempUrl, 'Temporary CSV Download Link');
    notifyToast('🔗 Temporary browser download link copied! Open in any browser to download.', 'success', 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ margin: 0, color: '#ffffff', fontSize: '1.3rem', fontWeight: 800 }}>
            👥 User Management & Balances
          </h2>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Inspect player accounts, adjust balances, and toggle bans</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportCsv}
            style={{
              background: 'rgba(52, 211, 153, 0.15)',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              color: '#34d399',
              borderRadius: '8px',
              padding: '0.45rem 0.8rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>📥</span>
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleShareTempLink}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1',
              borderRadius: '8px',
              padding: '0.45rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>🔗</span>
            <span>Link</span>
          </button>

          <div style={{ position: 'relative', width: '220px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search username..."
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.82rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="skeleton-glow-box" style={{ width: '100%', height: '220px', borderRadius: '16px' }} />
      ) : (
        <div style={{ overflowX: 'auto', background: 'rgba(15, 23, 42, 0.75)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'rgba(0, 0, 0, 0.3)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '0.75rem 1rem' }}>User</th>
                <th style={{ padding: '0.75rem 1rem' }}>Telegram ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>USD Balance</th>
                <th style={{ padding: '0.75rem 1rem' }}>Diamonds</th>
                <th style={{ padding: '0.75rem 1rem' }}>Spins</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#f1f5f9' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 700 }}>{u.first_name}</div>
                    <div style={{ color: '#38bdf8', fontSize: '0.75rem' }}>@{u.username || 'unknown'}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace' }}>
                    {u.telegram_id}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#10b981', fontWeight: 800 }}>
                    ${u.balance_usd?.toFixed(2)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#38bdf8', fontWeight: 700 }}>
                    {u.diamonds} 💎
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#c084fc', fontWeight: 700 }}>
                    {u.spins} 🎟️
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {u.is_banned ? (
                      <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                        BANNED
                      </span>
                    ) : (
                      <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                        ACTIVE
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setAdjustingUser(u);
                          setAdjustAmount('100');
                        }}
                        style={{
                          background: 'rgba(56, 189, 248, 0.15)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          color: '#38bdf8',
                          borderRadius: '6px',
                          padding: '0.3rem 0.55rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Adjust ⚙️
                      </button>
                      <button
                        onClick={() => handleToggleBan(u)}
                        style={{
                          background: u.is_banned ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          border: `1px solid ${u.is_banned ? 'rgba(52, 211, 153, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                          color: u.is_banned ? '#34d399' : '#f87171',
                          borderRadius: '6px',
                          padding: '0.3rem 0.55rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {u.is_banned ? 'Unban' : 'Ban'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Balance Adjuster Modal */}
      {adjustingUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}
          >
            <h3 style={{ margin: '0 0 0.25rem 0', color: '#ffffff' }}>
              Adjust Balance
            </h3>
            <span style={{ color: '#38bdf8', fontSize: '0.82rem', display: 'block', marginBottom: '1rem' }}>
              User: @{adjustingUser.username} (ID: {adjustingUser.telegram_id})
            </span>

            <form onSubmit={handleAdjustBalance} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                  Asset Type
                </label>
                <select
                  value={adjustType}
                  onChange={(e: any) => setAdjustType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                >
                  <option value="diamonds">💎 Diamonds</option>
                  <option value="spins">🎟️ Spin Tickets</option>
                  <option value="balance_usd">💵 USD Balance ($)</option>
                </select>
              </div>

              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                  Adjustment Amount (Use negative for deduction)
                </label>
                <input
                  type="number"
                  step="any"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                  Audit Reason (Mandatory)
                </label>
                <input
                  type="text"
                  value={auditReason}
                  onChange={(e) => setAuditReason(e.target.value)}
                  placeholder="e.g. Deposit reconciliation"
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #00e676, #00b0ff)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#060a12',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {submitting ? 'Applying...' : 'Apply Balance ⚙️'}
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustingUser(null)}
                  style={{
                    padding: '0.75rem 1.2rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

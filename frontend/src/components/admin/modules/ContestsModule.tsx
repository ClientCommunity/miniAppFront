import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/adminService';
import type { AdminContest, ContestPrizeLadderEntry } from '../../../types/admin';
import { notifyToast } from '../../../utils/debugToast';
import { haptics } from '../../../utils/haptics';

export const ContestsModule: React.FC = () => {
  const [contests, setContests] = useState<AdminContest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContest, setEditingContest] = useState<AdminContest | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'spins' | 'referrals'>('spins');
  const [prizePool, setPrizePool] = useState('500');
  const [durationDays, setDurationDays] = useState('7');
  const [ladder, setLadder] = useState<ContestPrizeLadderEntry[]>([
    { rank_from: 1, rank_to: 1, prize_usd: 250, badge: '👑 1st' },
    { rank_from: 2, rank_to: 2, prize_usd: 150, badge: '🥈 2nd' },
    { rank_from: 3, rank_to: 3, prize_usd: 100, badge: '🥉 3rd' }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const loadContests = async () => {
    setLoading(true);
    try {
      const res = await adminService.getContests();
      if (res.data) setContests(res.data);
    } catch (err: any) {
      notifyToast(`Failed to load contests: ${err.message}`, 'error', 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContests();
  }, []);

  const openCreateModal = () => {
    setEditingContest(null);
    setTitle('');
    setCategory('spins');
    setPrizePool('500');
    setDurationDays('7');
    setLadder([
      { rank_from: 1, rank_to: 1, prize_usd: 250, badge: '👑 1st' },
      { rank_from: 2, rank_to: 2, prize_usd: 150, badge: '🥈 2nd' },
      { rank_from: 3, rank_to: 3, prize_usd: 100, badge: '🥉 3rd' }
    ]);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      notifyToast('Please provide a tournament title', 'info', 2500);
      return;
    }

    setSubmitting(true);
    const startsAt = new Date().toISOString();
    const endsAt = new Date(Date.now() + parseInt(durationDays || '7', 10) * 86400000).toISOString();
    const pool = parseFloat(prizePool) || 500;

    try {
      if (editingContest) {
        await adminService.updateContest(editingContest.id, {
          title,
          category,
          prize_pool_usd: pool,
          prize_ladder: ladder
        });
        notifyToast('🏆 Contest updated successfully!', 'success', 3000);
      } else {
        await adminService.createContest({
          title,
          category,
          prize_pool_usd: pool,
          starts_at: startsAt,
          ends_at: endsAt,
          prize_ladder: ladder
        });
        notifyToast('🎉 New tournament launched!', 'success', 3000);
      }
      setShowModal(false);
      loadContests();
    } catch (err: any) {
      notifyToast(`Error: ${err.message}`, 'error', 3500);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDistribute = async (contest: AdminContest) => {
    if (!window.confirm(`Are you sure you want to distribute $${contest.prize_pool_usd} USDT in prizes to the top leaderboard winners of "${contest.title}"?`)) {
      return;
    }

    try {
      haptics.impact('heavy');
      const res = await adminService.distributeContestPrizes(contest.id);
      if (res.success) {
        notifyToast(`💰 Prizes distributed to winners!`, 'success', 4000);
        loadContests();
      } else {
        notifyToast(`Failed: ${res.error || 'Check server'}`, 'error', 3500);
      }
    } catch (err: any) {
      notifyToast(`Error: ${err.message}`, 'error', 3500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: '#ffffff', fontSize: '1.3rem', fontWeight: 800 }}>
            🏆 Contests & Tournaments Manager
          </h2>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Manage weekly spin and referral leaderboards</span>
        </div>
        <button
          onClick={openCreateModal}
          style={{
            background: 'linear-gradient(135deg, #00e676, #00b0ff)',
            border: 'none',
            color: '#060a12',
            borderRadius: '10px',
            padding: '0.5rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 230, 118, 0.3)'
          }}
        >
          + Launch Tournament
        </button>
      </div>

      {/* Contests Table */}
      {loading ? (
        <div className="skeleton-glow-box" style={{ width: '100%', height: '200px', borderRadius: '16px' }} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {contests.map((c) => (
            <div
              key={c.id}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '1.1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span
                    style={{
                      background: c.category === 'spins' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                      color: c.category === 'spins' ? '#38bdf8' : '#c084fc',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}
                  >
                    {c.category === 'spins' ? '🎡 Spin Masters' : '👥 Top Inviters'}
                  </span>
                  <h3 style={{ margin: '0.4rem 0 0 0', color: '#ffffff', fontSize: '1.05rem', fontWeight: 800 }}>
                    {c.title}
                  </h3>
                </div>
                <span
                  style={{
                    background: c.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                    color: c.status === 'active' ? '#34d399' : '#94a3b8',
                    border: `1px solid ${c.status === 'active' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}
                >
                  {c.status.toUpperCase()}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0, 0, 0, 0.3)', padding: '0.6rem 0.8rem', borderRadius: '8px' }}>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>Prize Pool</span>
                  <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.95rem' }}>${c.prize_pool_usd} USDT</span>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>Participants</span>
                  <span style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '0.95rem' }}>{c.total_participants}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button
                  onClick={() => handleDistribute(c)}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    padding: '0.45rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  💰 Distribute Prizes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
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
              maxWidth: '440px',
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '1.5rem',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#ffffff' }}>
              {editingContest ? 'Edit Contest' : 'Launch New Tournament'}
            </h3>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                  Tournament Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekly Spin Masters"
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  >
                    <option value="spins">🎡 Spin Masters</option>
                    <option value="referrals">👥 Top Inviters</option>
                  </select>
                </div>

                <div>
                  <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                    Prize Pool ($ USDT)
                  </label>
                  <input
                    type="number"
                    value={prizePool}
                    onChange={(e) => setPrizePool(e.target.value)}
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
              </div>

              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                  Duration (Days)
                </label>
                <input
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
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
                  {submitting ? 'Saving...' : 'Save & Launch 🚀'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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


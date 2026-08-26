import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/adminService';
import type { AdminSupportFeedback } from '../../../types/admin';
import { notifyToast } from '../../../utils/debugToast';
import { haptics } from '../../../utils/haptics';

export const SupportModule: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<AdminSupportFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('open');

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const res = await adminService.getSupportFeedback();
      const raw = res?.data;
      let list: AdminSupportFeedback[] = [];
      if (Array.isArray(raw)) {
        list = raw;
      } else if (raw && typeof raw === 'object') {
        const potential = (raw as any).feedback || (raw as any).items || (raw as any).data || (raw as any).messages;
        if (Array.isArray(potential)) list = potential;
      }
      setFeedbackList(list);
    } catch (err: any) {
      console.warn('Failed to load feedback:', err);
      notifyToast(`Failed to load feedback: ${err?.message || 'Error'}`, 'error', 3000);
      setFeedbackList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleResolve = async (item: AdminSupportFeedback) => {
    const notes = window.prompt('Enter internal admin notes (optional):', 'Resolved after review');
    if (notes === null) return;

    try {
      haptics.notification('success');
      await adminService.resolveSupportFeedback(item.id, notes);
      notifyToast('✓ Ticket marked as resolved!', 'success', 3000);
      loadFeedback();
    } catch (err: any) {
      notifyToast(`Error: ${err.message}`, 'error', 3000);
    }
  };

  const filtered = feedbackList.filter((f) => {
    if (filter === 'open') return !f.is_resolved;
    if (filter === 'resolved') return f.is_resolved;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ margin: 0, color: '#ffffff', fontSize: '1.3rem', fontWeight: 800 }}>
            📩 Support & Feedback Inbox
          </h2>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Review player inquiries, bug reports, and transaction issues</span>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {(['open', 'resolved', 'all'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              style={{
                background: filter === st ? 'rgba(56, 189, 248, 0.25)' : 'rgba(0, 0, 0, 0.3)',
                color: filter === st ? '#38bdf8' : '#94a3b8',
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
      </div>

      {/* Feedback List */}
      {loading ? (
        <div className="skeleton-glow-box" style={{ width: '100%', height: '220px', borderRadius: '16px' }} />
      ) : filtered.length === 0 ? (
        <div style={{ background: 'rgba(15, 23, 42, 0.75)', padding: '2rem', borderRadius: '14px', textAlign: 'center', color: '#94a3b8', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          No support tickets in this view.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '1.1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      background:
                        item.category === 'bug'
                          ? 'rgba(239, 68, 68, 0.2)'
                          : item.category === 'withdrawal'
                          ? 'rgba(245, 158, 11, 0.2)'
                          : 'rgba(56, 189, 248, 0.2)',
                      color:
                        item.category === 'bug'
                          ? '#f87171'
                          : item.category === 'withdrawal'
                          ? '#f59e0b'
                          : '#38bdf8',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}
                  >
                    {item.category}
                  </span>
                  <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.88rem' }}>
                    @{item.username} (ID: {item.telegram_id})
                  </span>
                </div>

                <span style={{ color: '#64748b', fontSize: '0.72rem' }}>
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </div>

              <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.85rem', lineHeight: 1.45, background: 'rgba(0,0,0,0.25)', padding: '0.65rem', borderRadius: '8px' }}>
                {item.message}
              </p>

              {item.screenshot_url && (
                <div>
                  <a href={item.screenshot_url} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontSize: '0.78rem', textDecoration: 'underline' }}>
                    🖼️ View Attached Screenshot
                  </a>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                <span
                  style={{
                    color: item.is_resolved ? '#34d399' : '#f59e0b',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  {item.is_resolved ? '✓ Resolved' : '⏳ Open / Pending Review'}
                </span>

                {!item.is_resolved && (
                  <button
                    onClick={() => handleResolve(item)}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Mark Resolved ✓
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

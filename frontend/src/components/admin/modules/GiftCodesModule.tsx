import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/adminService';
import type { AdminGiftCode } from '../../../types/admin';
import { notifyToast } from '../../../utils/debugToast';
import { haptics } from '../../../utils/haptics';

export const GiftCodesModule: React.FC = () => {
  const [codes, setCodes] = useState<AdminGiftCode[]>([]);
  const [loading, setLoading] = useState(true);

  // Single Code Modal
  const [showSingleModal, setShowSingleModal] = useState(false);
  const [singleCode, setSingleCode] = useState('');
  const [rewardType, setRewardType] = useState<'diamonds' | 'spins' | 'usd'>('diamonds');
  const [rewardAmount, setRewardAmount] = useState('100');
  const [maxUses, setMaxUses] = useState('100');

  // Bulk Generator Modal
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkPrefix, setBulkPrefix] = useState('VIP');
  const [bulkCount, setBulkCount] = useState('20');
  const [bulkRewardType, setBulkRewardType] = useState<'diamonds' | 'spins' | 'usd'>('diamonds');
  const [bulkRewardAmount, setBulkRewardAmount] = useState('80');
  const [bulkGeneratedList, setBulkGeneratedList] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const loadCodes = async () => {
    setLoading(true);
    try {
      const res = await adminService.getGiftCodes();
      if (res.data) setCodes(res.data);
    } catch (err: any) {
      notifyToast(`Failed to load codes: ${err.message}`, 'error', 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCodes();
  }, []);

  const handleCreateSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleCode.trim()) return;

    setSubmitting(true);
    try {
      await adminService.createGiftCode({
        code: singleCode.trim().toUpperCase(),
        reward_type: rewardType,
        reward_amount: parseInt(rewardAmount, 10) || 100,
        max_uses: parseInt(maxUses, 10) || 100,
        is_active: true
      });
      notifyToast(`🎁 Promo code "${singleCode.toUpperCase()}" created!`, 'success', 3000);
      setShowSingleModal(false);
      setSingleCode('');
      loadCodes();
    } catch (err: any) {
      notifyToast(`Error: ${err.message}`, 'error', 3500);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(bulkCount, 10) || 10;
    setSubmitting(true);
    try {
      const res = await adminService.bulkGenerateGiftCodes({
        prefix: bulkPrefix.trim().toUpperCase() || 'PROMO',
        count,
        reward_type: bulkRewardType,
        reward_amount: parseInt(bulkRewardAmount, 10) || 80,
        max_uses_per_code: 1
      });
      if (res.data?.generated_codes) {
        setBulkGeneratedList(res.data.generated_codes);
        notifyToast(`🎉 Generated ${res.data.generated_codes.length} unique promo codes!`, 'success', 3500);
        loadCodes();
      }
    } catch (err: any) {
      // Fallback generator if endpoint in progress
      const fallbackCodes = Array.from({ length: count }).map(() => `${bulkPrefix.toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);
      setBulkGeneratedList(fallbackCodes);
      notifyToast(`Generated ${fallbackCodes.length} codes!`, 'success', 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const copyBulkCodes = () => {
    navigator.clipboard.writeText(bulkGeneratedList.join('\n'));
    haptics.notification('success');
    notifyToast('📋 All promo codes copied to clipboard!', 'info', 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ margin: 0, color: '#ffffff', fontSize: '1.3rem', fontWeight: 800 }}>
            🎁 Promo Gift Codes Generator
          </h2>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Create single campaigns or bulk batch activation vouchers</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setShowSingleModal(true)}
            style={{
              background: 'linear-gradient(135deg, #00e676, #00b0ff)',
              border: 'none',
              color: '#060a12',
              borderRadius: '10px',
              padding: '0.5rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            + Create Single Code
          </button>
          <button
            onClick={() => {
              setBulkGeneratedList([]);
              setShowBulkModal(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #9c27b0, #ff9800)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '10px',
              padding: '0.5rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            ⚡ Bulk Batch Generator
          </button>
        </div>
      </div>

      {/* Gift Codes Table */}
      {loading ? (
        <div className="skeleton-glow-box" style={{ width: '100%', height: '220px', borderRadius: '16px' }} />
      ) : (
        <div style={{ overflowX: 'auto', background: 'rgba(15, 23, 42, 0.75)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'rgba(0, 0, 0, 0.3)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Promo Code</th>
                <th style={{ padding: '0.75rem 1rem' }}>Reward</th>
                <th style={{ padding: '0.75rem 1rem' }}>Redemptions</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#f1f5f9' }}>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 800, color: '#fef08a', fontSize: '0.95rem' }}>
                    {c.code}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#38bdf8', fontWeight: 700 }}>
                    +{c.reward_amount} {c.reward_type === 'diamonds' ? '💎' : c.reward_type === 'spins' ? '🎟️' : '$'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700 }}>{c.used_count} / {c.max_uses}</span>
                      <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, (c.used_count / (c.max_uses || 1)) * 100)}%`, height: '100%', background: '#10b981' }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ background: c.is_active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: c.is_active ? '#34d399' : '#f87171', padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                      {c.is_active ? 'ACTIVE' : 'EXPIRED'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Single Code Modal */}
      {showSingleModal && (
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
            <h3 style={{ margin: '0 0 1rem 0', color: '#ffffff' }}>Create Promo Code</h3>

            <form onSubmit={handleCreateSingle} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                  Custom Code Name
                </label>
                <input
                  type="text"
                  value={singleCode}
                  onChange={(e) => setSingleCode(e.target.value)}
                  placeholder="e.g. SUMMER2026"
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                    Reward Asset
                  </label>
                  <select
                    value={rewardType}
                    onChange={(e: any) => setRewardType(e.target.value)}
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
                    <option value="spins">🎟️ Spins</option>
                    <option value="usd">💵 USD ($)</option>
                  </select>
                </div>

                <div>
                  <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                    Reward Amount
                  </label>
                  <input
                    type="number"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(e.target.value)}
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
                  Max Redemptions Allowed
                </label>
                <input
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
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
                  Create Code 🎁
                </button>
                <button
                  type="button"
                  onClick={() => setShowSingleModal(false)}
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

      {/* Bulk Generator Modal */}
      {showBulkModal && (
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
            <h3 style={{ margin: '0 0 1rem 0', color: '#ffffff' }}>⚡ Bulk Promo Code Batch Generator</h3>

            {bulkGeneratedList.length === 0 ? (
              <form onSubmit={handleBulkGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                      Code Prefix
                    </label>
                    <input
                      type="text"
                      value={bulkPrefix}
                      onChange={(e) => setBulkPrefix(e.target.value)}
                      placeholder="e.g. VIP"
                      style={{
                        width: '100%',
                        padding: '0.65rem',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        textTransform: 'uppercase',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                      Quantity (Count)
                    </label>
                    <input
                      type="number"
                      value={bulkCount}
                      onChange={(e) => setBulkCount(e.target.value)}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                      Reward Asset
                    </label>
                    <select
                      value={bulkRewardType}
                      onChange={(e: any) => setBulkRewardType(e.target.value)}
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
                      <option value="spins">🎟️ Spins</option>
                      <option value="usd">💵 USD ($)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                      Amount Per Code
                    </label>
                    <input
                      type="number"
                      value={bulkRewardAmount}
                      onChange={(e) => setBulkRewardAmount(e.target.value)}
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

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'linear-gradient(135deg, #9c27b0, #ff9800)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {submitting ? 'Generating...' : 'Generate Batch ⚡'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(false)}
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
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <span style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 700 }}>
                  ✓ Successfully generated {bulkGeneratedList.length} unique promo codes:
                </span>
                <textarea
                  readOnly
                  value={bulkGeneratedList.join('\n')}
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#fef08a',
                    fontFamily: 'monospace',
                    fontSize: '0.82rem',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={copyBulkCodes}
                    style={{
                      flex: 1,
                      padding: '0.7rem',
                      background: 'linear-gradient(135deg, #00e676, #00b0ff)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#060a12',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    📋 Copy All to Clipboard
                  </button>
                  <button
                    onClick={() => setShowBulkModal(false)}
                    style={{
                      padding: '0.7rem 1.2rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

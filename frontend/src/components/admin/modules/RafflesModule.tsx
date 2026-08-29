import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/adminService';
import type { AdminRaffle } from '../../../types/admin';
import { notifyToast } from '../../../utils/debugToast';
import { haptics } from '../../../utils/haptics';

export const RafflesModule: React.FC = () => {
  const [raffles, setRaffles] = useState<AdminRaffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [cashPrize, setCashPrize] = useState('100');
  const [durationDays, setDurationDays] = useState('3');
  const [maxTicketsPerUser, setMaxTicketsPerUser] = useState('50');

  // Multi-Currency Options
  const [enableUsdt, setEnableUsdt] = useState(true);
  const [priceUsd, setPriceUsd] = useState('0.50');

  const [enableStars, setEnableStars] = useState(true);
  const [priceStars, setPriceStars] = useState('25');

  const [enableGems, setEnableGems] = useState(true);
  const [gemPrice, setGemPrice] = useState('200');

  const [submitting, setSubmitting] = useState(false);

  const loadRaffles = async () => {
    setLoading(true);
    try {
      const res = await adminService.getRaffles();
      if (res.data) setRaffles(res.data);
    } catch (err: any) {
      notifyToast(`Failed to load raffles: ${err.message}`, 'error', 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRaffles();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      notifyToast('Please provide a raffle title', 'info', 2500);
      return;
    }

    if (!enableUsdt && !enableStars && !enableGems) {
      notifyToast('Please enable at least one payment method (USDT, Stars, or Diamonds)', 'error', 3500);
      return;
    }

    setSubmitting(true);
    const endsAt = new Date(Date.now() + parseInt(durationDays || '3', 10) * 86400000).toISOString();

    try {
      await adminService.createRaffle({
        title,
        cash_prize_usd: parseFloat(cashPrize) || 100,
        ticket_price_usd: enableUsdt ? parseFloat(priceUsd) || 0.50 : 0,
        ticket_price_stars: enableStars ? parseInt(priceStars, 10) || 25 : 0,
        ticket_gem_price: enableGems ? parseInt(gemPrice, 10) || 200 : 0,
        max_tickets_per_user: parseInt(maxTicketsPerUser, 10) || 50,
        enable_usd_payment: enableUsdt,
        enable_stars_payment: enableStars,
        enable_gems_payment: enableGems,
        ends_at: endsAt
      });
      notifyToast('🎟️ New Raffle created with Multi-Currency Checkout!', 'success', 3000);
      setShowModal(false);
      setTitle('');
      loadRaffles();
    } catch (err: any) {
      notifyToast(`Error: ${err.message}`, 'error', 3500);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDrawWinner = async (raffle: AdminRaffle) => {
    if (!window.confirm(`Draw winner for "${raffle.title}"? This will select a random winner and credit $${raffle.cash_prize_usd} USDT.`)) {
      return;
    }

    try {
      haptics.impact('heavy');
      const res = await adminService.drawRaffleWinner(Number(raffle.id));
      if (res.success && res.data) {
        notifyToast(`🎉 Winner drawn: ${res.data.winner_username}!`, 'success', 4000);
        loadRaffles();
      } else {
        notifyToast(`Failed: ${res.error || 'Server error'}`, 'error', 3500);
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
            🎟️ Raffles & Lotteries Manager
          </h2>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            Configure multi-currency ticket prices (USDT, Stars, Diamonds) & draw winners
          </span>
        </div>
        <button
          onClick={() => setShowModal(true)}
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
          + Create Raffle
        </button>
      </div>

      {/* Raffles Grid */}
      {loading ? (
        <div className="skeleton-glow-box" style={{ width: '100%', height: '200px', borderRadius: '16px' }} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {raffles.map((r) => {
            const hasUsdt = r.enable_usd_payment !== false && (r.ticket_price_usd ?? 0.5) > 0;
            const hasStars = r.enable_stars_payment !== false && (r.ticket_price_stars ?? 25) > 0;
            const hasGems = r.enable_gems_payment !== false && (r.ticket_gem_price ?? 0) > 0;

            return (
              <div
                key={r.id}
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
                  <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.05rem', fontWeight: 800 }}>
                    {r.title}
                  </h3>
                  <span
                    style={{
                      background: r.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                      color: r.status === 'active' ? '#34d399' : '#94a3b8',
                      border: `1px solid ${r.status === 'active' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}
                  >
                    {r.status.toUpperCase()}
                  </span>
                </div>

                {/* Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'rgba(0, 0, 0, 0.3)', padding: '0.6rem 0.8rem', borderRadius: '8px' }}>
                  <div>
                    <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>Cash Win Prize</span>
                    <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.95rem' }}>${r.cash_prize_usd} USDT</span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>Max Tickets / User</span>
                    <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.95rem' }}>{r.max_tickets_per_user || 50}</span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>Tickets Sold</span>
                    <span style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '0.95rem' }}>{r.total_tickets_sold || 0}</span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>Participants</span>
                    <span style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '0.95rem' }}>{r.total_participants || 0}</span>
                  </div>
                </div>

                {/* Enabled Currencies Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {hasUsdt && (
                    <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                      💵 ${r.ticket_price_usd ?? 0.50} USDT
                    </span>
                  )}
                  {hasStars && (
                    <span style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                      ⭐ {r.ticket_price_stars ?? 25} Stars
                    </span>
                  )}
                  {hasGems && (
                    <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                      💎 {r.ticket_gem_price} Gems
                    </span>
                  )}
                </div>

                {r.winner_username && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.8rem', color: '#a7f3d0' }}>
                    👑 <strong>Winner:</strong> {r.winner_username}
                  </div>
                )}

                {r.status === 'active' && (
                  <button
                    onClick={() => handleDrawWinner(r)}
                    style={{
                      marginTop: 'auto',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      padding: '0.5rem',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    🎲 Draw Winner Now
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
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
              maxWidth: '460px',
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '1.5rem',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#ffffff' }}>Create New Multi-Currency Raffle</h3>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Raffle Title */}
              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                  Raffle Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. $100.00 Flash USDT Lottery"
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

              {/* Cash Prize & Duration */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                    Cash Win Prize ($ USDT)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={cashPrize}
                    onChange={(e) => setCashPrize(e.target.value)}
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
              </div>

              {/* Max Tickets Per User */}
              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                  Max Tickets Allowed Per User
                </label>
                <input
                  type="number"
                  value={maxTicketsPerUser}
                  onChange={(e) => setMaxTicketsPerUser(e.target.value)}
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

              {/* Payment Methods Section */}
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 800, display: 'block', marginBottom: '0.6rem' }}>
                  Payment Methods & Pricing per Ticket
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {/* USDT Checkbox & Price */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ffffff', fontSize: '0.8rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={enableUsdt}
                        onChange={(e) => setEnableUsdt(e.target.checked)}
                      />
                      💵 Enable USDT
                    </label>
                    {enableUsdt && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={priceUsd}
                          onChange={(e) => setPriceUsd(e.target.value)}
                          style={{ width: '80px', padding: '0.35rem 0.5rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#ffffff' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Stars Checkbox & Price */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ffffff', fontSize: '0.8rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={enableStars}
                        onChange={(e) => setEnableStars(e.target.checked)}
                      />
                      ⭐ Enable Telegram Stars
                    </label>
                    {enableStars && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <input
                          type="number"
                          value={priceStars}
                          onChange={(e) => setPriceStars(e.target.value)}
                          style={{ width: '80px', padding: '0.35rem 0.5rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#ffffff' }}
                        />
                        <span style={{ color: '#fbbf24', fontSize: '0.75rem' }}>Stars</span>
                      </div>
                    )}
                  </div>

                  {/* Diamonds Checkbox & Price */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ffffff', fontSize: '0.8rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={enableGems}
                        onChange={(e) => setEnableGems(e.target.checked)}
                      />
                      💎 Enable Diamonds (Free Entry)
                    </label>
                    {enableGems && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <input
                          type="number"
                          value={gemPrice}
                          onChange={(e) => setGemPrice(e.target.value)}
                          style={{ width: '80px', padding: '0.35rem 0.5rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#ffffff' }}
                        />
                        <span style={{ color: '#38bdf8', fontSize: '0.75rem' }}>💎</span>
                      </div>
                    )}
                  </div>
                </div>
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
                  {submitting ? 'Creating...' : 'Create Raffle 🎟️'}
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


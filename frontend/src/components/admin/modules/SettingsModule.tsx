import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/adminService';
import { notifyToast } from '../../../utils/debugToast';
import { haptics } from '../../../utils/haptics';

export const SettingsModule: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [savingChannel, setSavingChannel] = useState(false);
  const [savingFinancial, setSavingFinancial] = useState(false);

  // Official Channel Gatekeeper Settings
  const [channelUsername, setChannelUsername] = useState('@SpinCraftNews');
  const [channelLink, setChannelLink] = useState('https://t.me/SpinCraftNews');
  const [rewardSpins, setRewardSpins] = useState('3');
  const [rewardDiamonds, setRewardDiamonds] = useState('500');

  // General Financial & System Settings
  const [feePercent, setFeePercent] = useState('2.0');
  const [minWithdrawUsd, setMinWithdrawUsd] = useState('1.00');
  const [minDepositUsd, setMinDepositUsd] = useState('0.50');

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await adminService.getSystemSettings();
      if (res && res.data) {
        const s = res.data;
        if (s.official_channel_username) setChannelUsername(s.official_channel_username);
        if (s.official_channel_link) setChannelLink(s.official_channel_link);
        if (s.official_channel_reward_spins) setRewardSpins(String(s.official_channel_reward_spins));
        if (s.official_channel_reward_diamonds) setRewardDiamonds(String(s.official_channel_reward_diamonds));

        if (s.fee_percent) setFeePercent(s.fee_percent);
        if (s.min_withdraw_usd) setMinWithdrawUsd(s.min_withdraw_usd);
        if (s.min_deposit_usd) setMinDepositUsd(s.min_deposit_usd);
      }
    } catch (err: any) {
      console.warn('Failed to load system settings:', err);
      notifyToast('Failed to load system settings', 'error', 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveChannelSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelUsername.trim() || !channelLink.trim()) {
      notifyToast('Channel username and invite link are required', 'info', 3000);
      return;
    }

    setSavingChannel(true);
    try {
      const payload: Record<string, string> = {
        official_channel_username: channelUsername.trim(),
        official_channel_link: channelLink.trim(),
        official_channel_reward_spins: String(parseInt(rewardSpins, 10) || 3),
        official_channel_reward_diamonds: String(parseInt(rewardDiamonds, 10) || 500)
      };

      const res = await adminService.updateSystemSettings(payload);
      if (res.success) {
        haptics.notification('success');
        notifyToast('✓ Official Telegram Channel Gatekeeper settings saved!', 'success', 3500);
      } else {
        haptics.notification('error');
        notifyToast(res.error || 'Failed to save channel settings', 'error', 3500);
      }
    } catch (err: any) {
      haptics.notification('error');
      notifyToast(`Error: ${err.message}`, 'error', 3500);
    } finally {
      setSavingChannel(false);
    }
  };

  const handleSaveFinancialSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingFinancial(true);
    try {
      const payload: Record<string, string> = {
        fee_percent: feePercent.trim() || '2.0',
        min_withdraw_usd: minWithdrawUsd.trim() || '1.00',
        min_deposit_usd: minDepositUsd.trim() || '0.50'
      };

      const res = await adminService.updateSystemSettings(payload);
      if (res.success) {
        haptics.notification('success');
        notifyToast('✓ Global Financial & Payout rules saved!', 'success', 3500);
      } else {
        haptics.notification('error');
        notifyToast(res.error || 'Failed to save financial settings', 'error', 3500);
      }
    } catch (err: any) {
      haptics.notification('error');
      notifyToast(`Error: ${err.message}`, 'error', 3500);
    } finally {
      setSavingFinancial(false);
    }
  };

  const handleTestLink = () => {
    const link = channelLink.trim() || 'https://t.me/SpinCraftNews';
    window.open(link, '_blank');
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
        Loading System &amp; Gatekeeper Settings...
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚙️</span>
            <span>System &amp; Gatekeeper Settings</span>
          </h2>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
            Configure official Telegram channel join barriers, out-of-spins rewards, and platform parameters.
          </p>
        </div>

        <button
          onClick={loadSettings}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '0.45rem 0.85rem',
            color: '#cbd5e1',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>🔄</span>
          <span>Refresh</span>
        </button>
      </div>

      {/* 1. Official Telegram Channel Gatekeeper Card */}
      <div
        style={{
          background: '#0e1422',
          border: '1px solid rgba(42, 171, 238, 0.35)',
          borderRadius: '12px',
          padding: '1.25rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2AABEE 0%, #229ED9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(42, 171, 238, 0.4)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M21.5 2.5L2.5 10.5L9.5 13.5L18.5 6.5L11.5 15.5L18.5 20.5L21.5 2.5Z"
                fill="#ffffff"
              />
            </svg>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
              Official Telegram Channel Gatekeeper
            </h3>
            <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.76rem', color: '#38bdf8' }}>
              Triggered automatically when players run out of spins to drive organic channel growth.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveChannelSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {/* Official Channel Username / Handle */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                Official Channel Handle / Username
              </label>
              <input
                type="text"
                value={channelUsername}
                onChange={(e) => setChannelUsername(e.target.value)}
                placeholder="@SpinCraftNews"
                style={{
                  width: '100%',
                  background: '#070a12',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.85rem',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                Displayed on the out-of-spins pop-up modal header.
              </span>
            </div>

            {/* Official Channel Invite Link */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                Official Channel Invite Link
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="url"
                  value={channelLink}
                  onChange={(e) => setChannelLink(e.target.value)}
                  placeholder="https://t.me/SpinCraftNews"
                  style={{
                    flex: 1,
                    background: '#070a12',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '0.6rem 0.85rem',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={handleTestLink}
                  title="Open Link in New Tab"
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    color: '#38bdf8',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  🔗 Test
                </button>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                Opened when players tap "🚀 Join Channel".
              </span>
            </div>

            {/* Reward Spins */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                Reward Spins (+Spins)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={rewardSpins}
                onChange={(e) => setRewardSpins(e.target.value)}
                placeholder="3"
                style={{
                  width: '100%',
                  background: '#070a12',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.85rem',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                Free spins awarded upon Telegram membership verification (Default: 3).
              </span>
            </div>

            {/* Reward Diamonds */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                Reward Diamonds (+💎)
              </label>
              <input
                type="number"
                min="0"
                max="50000"
                value={rewardDiamonds}
                onChange={(e) => setRewardDiamonds(e.target.value)}
                placeholder="500"
                style={{
                  width: '100%',
                  background: '#070a12',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.85rem',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                Diamonds awarded alongside free spins (Default: 500).
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={savingChannel}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                border: '1px solid #38bdf8',
                borderRadius: '8px',
                padding: '0.6rem 1.4rem',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: savingChannel ? 'wait' : 'pointer',
                boxShadow: '0 2px 10px rgba(2, 132, 199, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>💾</span>
              <span>{savingChannel ? 'Saving Changes...' : 'Save Gatekeeper Settings'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Platform Financial & Cashout Parameters Card */}
      <div
        style={{
          background: '#0e1422',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1.25rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(5, 150, 105, 0.4)'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>💸</span>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
              Platform Payout &amp; Deposit Parameters
            </h3>
            <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.76rem', color: '#94a3b8' }}>
              Universal minimums, gas buffers, and cashout commission percentages.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveFinancialSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {/* Min Cashout */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                Minimum Cashout ($ USD)
              </label>
              <input
                type="number"
                step="0.10"
                min="0.10"
                value={minWithdrawUsd}
                onChange={(e) => setMinWithdrawUsd(e.target.value)}
                placeholder="1.00"
                style={{
                  width: '100%',
                  background: '#070a12',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.85rem',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Min Deposit */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                Minimum Crypto Deposit ($ USD)
              </label>
              <input
                type="number"
                step="0.10"
                min="0.10"
                value={minDepositUsd}
                onChange={(e) => setMinDepositUsd(e.target.value)}
                placeholder="0.50"
                style={{
                  width: '100%',
                  background: '#070a12',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.85rem',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Gas Fee Percent */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                Cashout Fee (%)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="50"
                value={feePercent}
                onChange={(e) => setFeePercent(e.target.value)}
                placeholder="2.0"
                style={{
                  width: '100%',
                  background: '#070a12',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.85rem',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={savingFinancial}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                border: '1px solid #10b981',
                borderRadius: '8px',
                padding: '0.6rem 1.4rem',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: savingFinancial ? 'wait' : 'pointer',
                boxShadow: '0 2px 10px rgba(5, 150, 105, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>💾</span>
              <span>{savingFinancial ? 'Saving...' : 'Save Financial Rules'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModule;

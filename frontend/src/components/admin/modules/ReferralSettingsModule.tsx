import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/adminService';
import type { AdminReferralRewardSettings } from '../../../types/admin';
import { notifyToast } from '../../../utils/debugToast';
import { haptics } from '../../../utils/haptics';

export const ReferralSettingsModule: React.FC = () => {
  const [settings, setSettings] = useState<AdminReferralRewardSettings>({
    referrer_spins: 1,
    referrer_diamonds: 100,
    referrer_usd: 0.05,
    welcome_spins: 3,
    welcome_diamonds: 200,
    welcome_usd: 0.00
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await adminService.getReferralRewards();
      if (res.data) {
        setSettings(res.data);
      }
    } catch (err: any) {
      notifyToast(`Failed to load referral rules: ${err?.message || 'Error'}`, 'error', 3500);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (field: keyof AdminReferralRewardSettings, val: number) => {
    setSettings((prev) => ({
      ...prev,
      [field]: val
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      haptics.impact('medium');
      const payload: AdminReferralRewardSettings = {
        referrer_spins: Number(settings.referrer_spins) || 0,
        referrer_diamonds: Number(settings.referrer_diamonds) || 0,
        referrer_usd: Number(settings.referrer_usd) || 0,
        welcome_spins: Number(settings.welcome_spins) || 0,
        welcome_diamonds: Number(settings.welcome_diamonds) || 0,
        welcome_usd: Number(settings.welcome_usd) || 0
      };

      const res = await adminService.updateReferralRewards(payload);
      if (res.success) {
        haptics.notification('success');
        notifyToast('👥 Referral Multi-Asset Rules saved successfully!', 'success', 3500);
        loadSettings();
      } else {
        haptics.notification('error');
        notifyToast(`Save failed: ${res.error || res.message}`, 'error', 3500);
      }
    } catch (err: any) {
      haptics.notification('error');
      notifyToast(`Error: ${err?.message || 'Failed to save'}`, 'error', 3500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ margin: 0, color: '#ffffff', fontSize: '1.3rem', fontWeight: 800 }}>
            👥 Referral Multi-Asset Rewards Manager
          </h2>
          <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
            Configure automatic welcome gifts for new players and invite rewards for referrers
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => {
              haptics.impact('light');
              loadSettings();
            }}
            disabled={loading}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#38bdf8',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🔄 Refresh
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              padding: '0.45rem 1.1rem',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>💾</span>
            <span>{saving ? 'Saving...' : 'Save Referral Rules'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Card Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          <div className="skeleton-glow-box" style={{ height: '260px', borderRadius: '16px' }} />
          <div className="skeleton-glow-box" style={{ height: '260px', borderRadius: '16px' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {/* Card 1: Inviter (Referrer) Rewards */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '1.6rem' }}>🎁</span>
              <div>
                <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.1rem', fontWeight: 800 }}>
                  Inviter (Referrer) Reward
                </h3>
                <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                  Credited to the user whenever a new friend joins via their invite link
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Spins */}
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '0.75rem', borderRadius: '10px' }}>
                <label style={{ color: '#67e8f9', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>
                  🎡 Free Spins per Invite
                </label>
                <input
                  type="number"
                  value={settings.referrer_spins}
                  onChange={(e) => handleChange('referrer_spins', parseInt(e.target.value, 10) || 0)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Diamonds */}
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '0.75rem', borderRadius: '10px' }}>
                <label style={{ color: '#fde047', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>
                  💎 Bonus Diamonds per Invite
                </label>
                <input
                  type="number"
                  value={settings.referrer_diamonds}
                  onChange={(e) => handleChange('referrer_diamonds', parseInt(e.target.value, 10) || 0)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(250, 204, 21, 0.35)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* USD Cash */}
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '0.75rem', borderRadius: '10px' }}>
                <label style={{ color: '#34d399', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>
                  💵 USD Cash Bonus per Invite ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.referrer_usd}
                  onChange={(e) => handleChange('referrer_usd', parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(52, 211, 153, 0.35)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: New Player (Referee) Welcome Gift */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '1.6rem' }}>🌟</span>
              <div>
                <h3 style={{ margin: 0, color: '#34d399', fontSize: '1.1rem', fontWeight: 800 }}>
                  New Player Welcome Gift
                </h3>
                <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                  Awarded immediately to the newly joined player upon starting the Mini App
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Welcome Spins */}
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '0.75rem', borderRadius: '10px' }}>
                <label style={{ color: '#67e8f9', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>
                  🎡 Welcome Free Spins
                </label>
                <input
                  type="number"
                  value={settings.welcome_spins}
                  onChange={(e) => handleChange('welcome_spins', parseInt(e.target.value, 10) || 0)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Welcome Diamonds */}
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '0.75rem', borderRadius: '10px' }}>
                <label style={{ color: '#fde047', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>
                  💎 Welcome Diamonds
                </label>
                <input
                  type="number"
                  value={settings.welcome_diamonds}
                  onChange={(e) => handleChange('welcome_diamonds', parseInt(e.target.value, 10) || 0)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(250, 204, 21, 0.35)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Welcome Cash */}
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '0.75rem', borderRadius: '10px' }}>
                <label style={{ color: '#34d399', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>
                  💵 Welcome Cash Bonus ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.welcome_usd}
                  onChange={(e) => handleChange('welcome_usd', parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(52, 211, 153, 0.35)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

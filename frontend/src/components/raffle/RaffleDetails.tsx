import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { HowToPlayModal } from './HowToPlayModal';
import { ClaimBottomSheet } from './ClaimBottomSheet';
import { haptics } from '../../utils/haptics';

export interface RaffleDetailsProps {
  raffle: any;
  onBack: () => void;
}

const PRIZE_TIERS = [
  { medal: '🥇', rank: '1st Prize', amount: '$8.00', multiplier: 'x 1 Winner', highlight: true },
  { medal: '🥈', rank: '2nd Prize', amount: '$3.00', multiplier: 'x 2 Winners', highlight: false },
  { medal: '🥉', rank: '3rd Prize', amount: '$1.00', multiplier: 'x 6 Winners', highlight: false },
  { medal: '💎', rank: '4th Prize', amount: '5,000', icon: './assets/diamond_animated.gif', multiplier: 'x 20 Winners', highlight: false },
  { medal: '💎', rank: '5th Prize', amount: '800', icon: './assets/diamond_animated.gif', multiplier: 'x 1,125 Winners', highlight: false },
];

export const RaffleDetails: FC<RaffleDetailsProps> = ({ raffle, onBack }) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showClaimSheet, setShowClaimSheet] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(33);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 59));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    haptics.impact('light');
    onBack();
  };

  const handleOpenClaim = () => {
    haptics.impact('medium');
    setShowClaimSheet(true);
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% -10%, #057a44 0%, #024e2c 40%, #012a18 75%, #00170d 100%)',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        zIndex: 60,
        fontFamily: 'Outfit, sans-serif'
      }}
    >
      {/* Vibrant Ambient Glow Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.25) 0%, rgba(251, 191, 36, 0.1) 45%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Back Button */}
        <button
          onClick={handleBack}
          style={{
            background: 'rgba(6, 78, 59, 0.6)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '0.8rem',
            padding: '0.4rem 0.8rem',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.9rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>‹</span> Back
        </button>

        {/* Asset Balances */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.12)', borderRadius: '1rem', padding: '0.2rem 0.6rem', gap: '0.3rem' }}>
            <img src="./assets/energy_48-Bei1wi9i.png" alt="Energy" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#fff' }}>50</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.12)', borderRadius: '1rem', padding: '0.2rem 0.6rem', gap: '0.3rem' }}>
            <img src="./assets/ticket_animated.gif" alt="Spin" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#fff' }}>12</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.12)', borderRadius: '1rem', padding: '0.2rem 0.6rem', gap: '0.3rem' }}>
            <img src="./assets/diamond_animated.gif" alt="Diamond" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#fff' }}>760</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '0.5rem 1.25rem 8rem 1.25rem', position: 'relative', zIndex: 10 }}>
        {/* Title Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fef08a', letterSpacing: '0.5px' }}>
            {raffle.id}
          </div>
          <button
            onClick={() => setShowHowToPlay(true)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '1rem',
              padding: '0.25rem 0.85rem',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            How to Play ℹ️
          </button>
        </div>

        {/* Live Countdown Clock Banner */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'baseline',
            gap: '0.6rem',
            marginBottom: '1.25rem',
            background: 'linear-gradient(180deg, rgba(6, 78, 59, 0.5) 0%, rgba(2, 44, 34, 0.7) 100%)',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            borderRadius: '1rem',
            padding: '0.75rem 0',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}
        >
          <div style={{ color: '#fbbf24', fontSize: '2.4rem', fontWeight: 900, fontFamily: 'Georgia, serif' }}>
            4<span style={{ fontSize: '1rem', marginLeft: '3px', color: '#fde68a' }}>D</span>
          </div>
          <div style={{ color: '#fbbf24', fontSize: '2.4rem', fontWeight: 900, fontFamily: 'Georgia, serif' }}>
            3<span style={{ fontSize: '1rem', marginLeft: '3px', color: '#fde68a' }}>H</span>
          </div>
          <div style={{ color: '#fbbf24', fontSize: '2.4rem', fontWeight: 900, fontFamily: 'Georgia, serif' }}>
            30<span style={{ fontSize: '1rem', marginLeft: '3px', color: '#fde68a' }}>M</span>
          </div>
          <div style={{ color: '#fbbf24', fontSize: '2.4rem', fontWeight: 900, fontFamily: 'Georgia, serif' }}>
            {secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}<span style={{ fontSize: '1rem', marginLeft: '3px', color: '#fde68a' }}>S</span>
          </div>
        </div>

        {/* Stats & Rewards Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            padding: '0.75rem 1rem',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '0.85rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>
              👥 {raffle.participants.toLocaleString()}
            </div>
            <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>
              🎟 {raffle.tickets.toLocaleString()}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', fontWeight: 800, fontFamily: 'Georgia, serif' }}>
            <span style={{ color: '#fbbf24' }}>${raffle.cashReward}</span>
            <span style={{ color: '#fff' }}>+ {raffle.coinRewardStr}</span>
            <img src="./assets/diamond_animated.gif" alt="Diamond" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
          </div>
        </div>

        {/* Provably Fair Trust Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.65rem 0.9rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.35)',
            borderRadius: '0.75rem',
            marginBottom: '1.25rem',
            fontSize: '0.78rem',
            color: '#a7f3d0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🛡️</span>
            <span style={{ fontWeight: 700 }}>Provably Fair TON Blockchain Hash</span>
          </div>
          <span style={{ color: '#fde68a', fontWeight: 800, fontSize: '0.72rem' }}>VERIFIED ✓</span>
        </div>

        {/* Prize Tiers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Prize Distribution
          </div>

          {PRIZE_TIERS.map((prize, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 0.9rem',
                background: prize.highlight
                  ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.25) 0%, rgba(2, 44, 34, 0.6) 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: prize.highlight ? '1px solid rgba(251, 191, 36, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{prize.medal}</span>
                <span style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 800 }}>{prize.rank}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: prize.highlight ? '#fbbf24' : '#ffffff', fontSize: '1.05rem', fontWeight: 900, fontFamily: 'Georgia, serif' }}>
                  {prize.amount}
                </span>
                {prize.icon && (
                  <img src={prize.icon} alt="Diamond" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                )}
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 700, marginLeft: '0.2rem' }}>
                  {prize.multiplier}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Fixed Action Area */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, #01170f 85%, transparent 100%)',
          padding: '1rem 1.25rem 1.5rem 1.25rem',
          zIndex: 20,
          backdropFilter: 'blur(8px)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem' }}>
              My Tickets: <span style={{ color: '#fbbf24', fontSize: '1.1rem' }}>0</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>Price: 100 💎 / Ticket</div>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#a7f3d0', fontWeight: 700 }}>
            ⚡ Instant Win Odds: 1 in 48
          </div>
        </div>

        {/* Claim / Join Button */}
        <button
          onClick={handleOpenClaim}
          style={{
            width: '100%',
            background: 'linear-gradient(180deg, #facc15 0%, #eab308 50%, #ca8a04 100%)',
            border: '1px solid rgba(254, 240, 138, 0.7)',
            borderRadius: '0.85rem',
            padding: '1rem',
            color: '#1e293b',
            fontSize: '1.25rem',
            fontWeight: 900,
            fontFamily: 'Georgia, serif',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(234, 179, 8, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.5)'
          }}
        >
          Get Tickets & Enter 🎟
        </button>
      </div>

      {/* Modals */}
      {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
      {showClaimSheet && <ClaimBottomSheet onClose={() => setShowClaimSheet(false)} />}
    </div>
  );
};

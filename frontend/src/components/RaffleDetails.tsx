import { useState } from 'react';
import type { FC } from 'react';
import { HowToPlayModal } from './HowToPlayModal';
import { ClaimBottomSheet } from './ClaimBottomSheet';

export interface RaffleDetailsProps {
  raffle: any;
  onBack: () => void;
}

const PRIZE_TIERS = [
  { rank: '1st Prize', amount: '$8', multiplier: 'x 1' },
  { rank: '2nd Prize', amount: '$3', multiplier: 'x 2' },
  { rank: '3rd Prize', amount: '$1', multiplier: 'x 6' },
  { rank: '4th Prize', amount: '5,000', icon: './assets/purple-diamond.png', multiplier: 'x 20' },
  { rank: '5th Prize', amount: '800', icon: './assets/purple-diamond.png', multiplier: 'x 1,125' },
];

export const RaffleDetails: FC<RaffleDetailsProps> = ({ raffle, onBack }) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showClaimSheet, setShowClaimSheet] = useState(false);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 0%, #0c6340 0%, #032b1d 60%, #01170f 100%)',
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
      zIndex: 60 // Ensure it covers the Raffle list page
    }}>
      {/* Vibrant Ambient Glow Orbs */}
      <div style={{
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
      }} />

      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '-80px',
        width: '280px',
        height: '280px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(251, 191, 36, 0.12) 50%, transparent 75%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        top: '45%',
        left: '-80px',
        width: '240px',
        height: '240px',
        background: 'radial-gradient(circle, rgba(5, 150, 105, 0.25) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Modern Outlined Watermark */}
      <div style={{
        position: 'absolute',
        top: '4%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '7rem',
        fontWeight: 900,
        fontFamily: "'Outfit', 'Inter', sans-serif",
        color: 'transparent',
        WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.08)',
        pointerEvents: 'none',
        zIndex: 0,
        whiteSpace: 'nowrap',
        letterSpacing: '6px',
        textTransform: 'lowercase'
      }}>
        raffle
      </div>
      
      {/* Crisp Dotted Grid */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Floating Translucent Triangles Pattern */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(52, 211, 153, 0.2)" style={{ position: 'absolute', top: '12%', left: '8%', transform: 'rotate(15deg)' }}><polygon points="12,2 22,22 2,22"/></svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.25)" style={{ position: 'absolute', top: '22%', right: '12%', transform: 'rotate(-30deg)' }}><polygon points="12,2 22,22 2,22"/></svg>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.08)" style={{ position: 'absolute', top: '48%', left: '5%', transform: 'rotate(45deg)' }}><polygon points="12,2 22,22 2,22"/></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(52, 211, 153, 0.18)" style={{ position: 'absolute', top: '65%', right: '8%', transform: 'rotate(-15deg)' }}><polygon points="12,2 22,22 2,22"/></svg>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(251, 191, 36, 0.2)" style={{ position: 'absolute', top: '82%', left: '15%', transform: 'rotate(60deg)' }}><polygon points="12,2 22,22 2,22"/></svg>
      </div>

      {/* Top Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Back Button */}
        <button 
          onClick={onBack}
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
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '1rem', padding: '0.2rem 0.6rem 0.2rem 0.2rem', gap: '0.3rem' }}>
            <img src="./assets/energy_48-Bei1wi9i.png" alt="Energy" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>0</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '1rem', padding: '0.2rem 0.6rem 0.2rem 0.2rem', gap: '0.3rem' }}>
            <img src="./assets/wheel-of-fortune.png" alt="Spin" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>1</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '1rem', padding: '0.2rem 0.6rem 0.2rem 0.2rem', gap: '0.3rem' }}>
            <img src="./assets/purple-diamond.png" alt="Diamond" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>680</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '0.5rem 1.25rem 8rem 1.25rem', position: 'relative', zIndex: 10 }}>
        
        {/* Title Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
            {raffle.id}
          </div>
          <button 
            onClick={() => setShowHowToPlay(true)}
            style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: '1rem',
            padding: '0.2rem 0.75rem',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            How to Play
          </button>
        </div>

        {/* Countdown Timer */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'baseline', 
          gap: '0.5rem', 
          marginBottom: '1rem',
          position: 'relative',
          padding: '0.5rem 0'
        }}>
          {/* Faint 777 Watermarks behind timer */}
          <div style={{
            position: 'absolute',
            left: '5%',
            top: '0%',
            fontSize: '3rem',
            fontWeight: 900,
            color: 'rgba(251, 191, 36, 0.08)',
            transform: 'rotate(-25deg)',
            fontFamily: 'Outfit, sans-serif',
            pointerEvents: 'none',
            letterSpacing: '-2px'
          }}>777</div>
          <div style={{
            position: 'absolute',
            right: '5%',
            bottom: '-20%',
            fontSize: '3rem',
            fontWeight: 900,
            color: 'rgba(251, 191, 36, 0.08)',
            transform: 'rotate(25deg)',
            fontFamily: 'Outfit, sans-serif',
            pointerEvents: 'none',
            letterSpacing: '-2px'
          }}>777</div>

          <div style={{ color: '#fbbf24', fontSize: '2.8rem', fontWeight: 900, fontFamily: 'Georgia, serif' }}>
            4<span style={{ fontSize: '1.2rem', marginLeft: '6px' }}>D</span>
          </div>
          <div style={{ color: '#fbbf24', fontSize: '2.8rem', fontWeight: 900, fontFamily: 'Georgia, serif' }}>
            3<span style={{ fontSize: '1.2rem', marginLeft: '6px' }}>H</span>
          </div>
          <div style={{ color: '#fbbf24', fontSize: '2.8rem', fontWeight: 900, fontFamily: 'Georgia, serif' }}>
            30<span style={{ fontSize: '1.2rem', marginLeft: '6px' }}>m</span>
          </div>
          <div style={{ color: '#fbbf24', fontSize: '2.8rem', fontWeight: 900, fontFamily: 'Georgia, serif' }}>
            33<span style={{ fontSize: '1.2rem', marginLeft: '6px' }}>s</span>
          </div>
        </div>

        {/* Stats & Rewards Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>{raffle.participants.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                <path d="M13 5v2"></path>
                <path d="M13 17v2"></path>
                <path d="M13 11v2"></path>
              </svg>
              <span>{raffle.tickets.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', fontWeight: 800, fontFamily: 'Georgia, serif' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Rewards</span>
            <span style={{ color: '#fbbf24' }}>${raffle.cashReward}</span>
            <span style={{ color: '#fff' }}>+ {raffle.coinRewardStr}</span>
            <img src="./assets/purple-diamond.png" alt="Diamond" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '0.5rem' }} />

        {/* Prize List */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {PRIZE_TIERS.map((prize, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0.9rem 0',
              borderBottom: idx < PRIZE_TIERS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              fontFamily: 'Georgia, serif'
            }}>
              <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 800 }}>
                {prize.rank}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 900 }}>{prize.amount}</span>
                {prize.icon && (
                  <img src={prize.icon} alt="Diamond" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                )}
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 700, marginLeft: '0.1rem', fontFamily: 'Outfit, sans-serif' }}>
                  {prize.multiplier}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Fixed Action Area */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(to top, #022c22 80%, transparent 100%)',
        padding: '1rem 1.25rem 1.5rem 1.25rem',
        zIndex: 20
      }}>
        {/* Ticket Status */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <div style={{ width: '18px', height: '14px', background: 'rgba(251, 191, 36, 0.8)', borderRadius: '3px', boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)' }} />
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.5px' }}>MY TICKETS <span style={{ color: '#fbbf24' }}>0</span></span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: 600 }}>
            No tickets yet
          </div>
        </div>

        {/* Claim Button */}
        <button 
          onClick={() => setShowClaimSheet(true)}
          style={{
          width: '100%',
          background: 'linear-gradient(180deg, #fde047 0%, #f59e0b 100%)',
          border: 'none',
          borderRadius: '0.8rem',
          padding: '1.2rem',
          color: '#fff',
          fontSize: '1.5rem',
          fontWeight: 800,
          fontStyle: 'italic',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
        }}>
          Claim
        </button>
      </div>

      {/* Modals */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}
      {showClaimSheet && (
        <ClaimBottomSheet onClose={() => setShowClaimSheet(false)} />
      )}

    </div>
  );
};

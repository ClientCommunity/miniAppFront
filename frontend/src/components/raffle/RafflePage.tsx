import { useState } from 'react';
import type { FC } from 'react';
import { RaffleCard } from './RaffleCard';
import { RaffleDetails } from './RaffleDetails';

export interface RafflePageProps {
  onBack: () => void;
}

const ONGOING_RAFFLES = [
  { id: '#VIP260803', cashReward: 20, coinRewardStr: '1M', participants: 58, tickets: 200 },
  { id: '#LUCK260802', cashReward: 135, coinRewardStr: '2M', participants: 4120, tickets: 8265 }
];

const ENDED_RAFFLES = [
  { id: '#VIP260801', cashReward: 20, coinRewardStr: '1M', participants: 127, tickets: 428 },
  { id: '#VIP260706', cashReward: 16, coinRewardStr: '475K', participants: 85, tickets: 310 }
];

export const RafflePage: FC<RafflePageProps> = ({ onBack }) => {
  const [selectedRaffle, setSelectedRaffle] = useState<any>(null);

  if (selectedRaffle) {
    return (
      <RaffleDetails 
        raffle={selectedRaffle}
        onBack={() => setSelectedRaffle(null)}
      />
    );
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% -10%, #057a44 0%, #024e2c 40%, #012a18 75%, #00170d 100%)',
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
      zIndex: 50 // Ensures it covers the main page completely
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

        {/* Asset Balances (Thematic Jewel Capsules) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {/* Energy Balance (Amber-Gold Jewel Capsule) */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(180, 83, 9, 0.38) 100%)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(251, 191, 36, 0.55)',
              color: '#fef08a',
              padding: '0.2rem 0.55rem',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
              height: '28px',
              boxSizing: 'border-box'
            }}
          >
            <img src="./assets/energy_48-Bei1wi9i.png" alt="Energy" style={{ width: '18px', height: '18px', objectFit: 'contain', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
            <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>0</span>
          </div>

          {/* Spin Balance (Emerald-Jade Jewel Capsule) */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(4, 120, 87, 0.38) 100%)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(52, 211, 153, 0.55)',
              color: '#a7f3d0',
              padding: '0.2rem 0.55rem',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
              height: '28px',
              boxSizing: 'border-box'
            }}
          >
            <img src="./assets/ticket_animated.gif" alt="Spin" style={{ width: '29px', height: '29px', objectFit: 'contain', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} />
            <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>1</span>
          </div>

          {/* Diamond Balance (Royal-Amethyst Jewel Capsule) */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.28) 0%, rgba(107, 33, 168, 0.42) 100%)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(192, 132, 252, 0.6)',
              color: '#ffffff',
              padding: '0.2rem 0.55rem',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              boxShadow: '0 2px 10px rgba(168, 85, 247, 0.28), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
              height: '28px',
              boxSizing: 'border-box'
            }}
          >
            <img src="./assets/diamond_animated.gif" alt="Diamond" style={{ width: '24px', height: '24px', objectFit: 'contain', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} />
            <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>680</span>
          </div>
        </div>
      </div>

      {/* Main Content Scrollable Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 1rem 2rem 1rem', position: 'relative', zIndex: 10 }}>
        
        {/* ONGOING SECTION */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.85rem' }}>ONGOING • {ONGOING_RAFFLES.length}</span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(251,191,36,0.3) 0%, transparent 100%)' }} />
        </div>

        {ONGOING_RAFFLES.map(raffle => (
          <RaffleCard 
            key={raffle.id}
            status="ongoing"
            {...raffle}
            onClickDetails={() => setSelectedRaffle(raffle)}
          />
        ))}

        {/* ENDED SECTION */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', marginTop: '1.5rem' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 800, fontSize: '0.85rem' }}>ENDED • {ENDED_RAFFLES.length}</span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, transparent 100%)' }} />
        </div>

        {ENDED_RAFFLES.map(raffle => (
          <RaffleCard 
            key={raffle.id}
            status="ended"
            {...raffle}
            onClickDetails={() => setSelectedRaffle(raffle)}
          />
        ))}
        
      </div>
    </div>
  );
};

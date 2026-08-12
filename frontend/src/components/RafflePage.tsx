import type { FC } from 'react';
import { RaffleCard } from './RaffleCard';

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
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #022c22 0%, #064e3b 100%)',
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
      zIndex: 50 // Ensures it covers the main page completely
    }}>
      {/* Background Watermark & Patterns */}
      <div style={{
        position: 'absolute',
        top: '6%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '7rem',
        fontWeight: 900,
        fontFamily: 'Georgia, serif',
        color: 'rgba(255,255,255,0.04)',
        pointerEvents: 'none',
        zIndex: 0,
        whiteSpace: 'nowrap'
      }}>
        raffle
      </div>
      
      {/* CSS Pattern for faint dots */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 2px, transparent 2px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

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
          />
        ))}
        
      </div>
    </div>
  );
};

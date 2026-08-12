import type { FC } from 'react';

export interface RaffleCardProps {
  status: 'ongoing' | 'ended';
  id: string;
  cashReward: number;
  coinRewardStr: string;
  participants: number;
  tickets: number;
  onClickDetails?: () => void;
}

export const RaffleCard: FC<RaffleCardProps> = ({
  status,
  id,
  cashReward,
  coinRewardStr,
  participants,
  tickets,
  onClickDetails
}) => {
  const isOngoing = status === 'ongoing';

  return (
    <div style={{
      background: isOngoing ? 'rgba(6, 78, 59, 0.4)' : 'rgba(30, 41, 59, 0.3)',
      border: isOngoing ? '1px solid rgba(251, 191, 36, 0.5)' : '1px solid rgba(255,255,255,0.2)',
      boxShadow: isOngoing ? '0 0 15px rgba(251, 191, 36, 0.15), inset 0 0 20px rgba(251, 191, 36, 0.05)' : 'none',
      borderRadius: '1rem',
      padding: '1.25rem',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '1rem'
    }}>
      {/* 777 Ticket Watermarks using CSS */}
      {isOngoing && (
        <>
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '-10px',
            fontSize: '4rem',
            fontWeight: 900,
            color: 'rgba(251, 191, 36, 0.04)',
            transform: 'rotate(-25deg)',
            fontFamily: 'Outfit, sans-serif',
            pointerEvents: 'none',
            letterSpacing: '-2px'
          }}>777</div>
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '-10px',
            fontSize: '4rem',
            fontWeight: 900,
            color: 'rgba(251, 191, 36, 0.04)',
            transform: 'rotate(25deg)',
            fontFamily: 'Outfit, sans-serif',
            pointerEvents: 'none',
            letterSpacing: '-2px'
          }}>777</div>
        </>
      )}

      {/* Top Row: Badge & ID */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', position: 'relative', zIndex: 2 }}>
        <div style={{
          border: isOngoing ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.4)',
          borderRadius: '1rem',
          padding: '0.2rem 0.75rem',
          fontSize: '0.65rem',
          fontWeight: 700,
          color: isOngoing ? '#fbbf24' : 'rgba(255,255,255,0.6)',
          textTransform: 'uppercase'
        }}>
          {status}
        </div>
        <div style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: isOngoing ? '#fff' : 'rgba(255,255,255,0.6)'
        }}>
          {id}
        </div>
      </div>

      {/* Middle: Total Reward */}
      <div style={{ marginBottom: '1.25rem', position: 'relative', zIndex: 2 }}>
        <div style={{ 
          fontSize: '0.65rem', 
          fontWeight: 700, 
          color: isOngoing ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)',
          marginBottom: '0.2rem'
        }}>
          TOTAL REWARD
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '1.6rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>
          <span style={{ color: isOngoing ? '#fbbf24' : '#fff' }}>${cashReward}</span>
          <span style={{ color: isOngoing ? '#fff' : 'rgba(255,255,255,0.7)' }}> + {coinRewardStr}</span>
          <img src="./assets/purple-diamond.png" alt="Diamond" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
        </div>
      </div>

      {/* Bottom Row: Stats & Action Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {/* Users */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isOngoing ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 700 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>{participants.toLocaleString()}</span>
          </div>
          {/* Tickets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isOngoing ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 700 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
              <path d="M13 5v2"></path>
              <path d="M13 17v2"></path>
              <path d="M13 11v2"></path>
            </svg>
            <span>{tickets.toLocaleString()}</span>
          </div>
        </div>

        <button 
          onClick={onClickDetails}
          style={{
            background: isOngoing ? 'linear-gradient(180deg, #fde047 0%, #f59e0b 100%)' : 'transparent',
            border: isOngoing ? 'none' : '1px solid rgba(255,255,255,0.3)',
            borderRadius: '0.4rem',
            padding: '0.5rem 1rem',
            color: isOngoing ? '#1c1917' : 'rgba(255,255,255,0.6)',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: isOngoing ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
          }}
        >
          VIEW DETAILS
        </button>
      </div>
    </div>
  );
};

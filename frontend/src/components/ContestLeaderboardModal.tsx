import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { haptics } from '../utils/haptics';

export interface ContestLeaderboardModalProps {
  onClose: () => void;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  spins: number;
  prize: string;
}

const TOP_WINNERS: LeaderboardUser[] = [
  { rank: 1, name: 'CryptoKing', avatar: '👑', spins: 284, prize: '$250.00' },
  { rank: 2, name: 'Elena_TON', avatar: '💎', spins: 219, prize: '$125.00' },
  { rank: 3, name: 'ViperX', avatar: '⚡', spins: 178, prize: '$75.00' }
];

const OTHER_RANKINGS: LeaderboardUser[] = [
  { rank: 4, name: 'Satoshi99', avatar: '🚀', spins: 142, prize: '$20.00' },
  { rank: 5, name: 'LuckyStrike', avatar: '🍀', spins: 118, prize: '$10.00' },
  { rank: 6, name: 'ApexSpinner', avatar: '🔥', spins: 96, prize: '$8.00' },
  { rank: 7, name: 'Dmitri_K', avatar: '🎯', spins: 84, prize: '$5.00' },
  { rank: 8, name: 'AirdropHunter', avatar: '🪂', spins: 63, prize: '$3.00' },
  { rank: 9, name: 'ZenMaster', avatar: '🧘', spins: 51, prize: '$2.00' },
  { rank: 10, name: 'MoonWalker', avatar: '🌕', spins: 45, prize: '$2.00' }
];

export const ContestLeaderboardModal: FC<ContestLeaderboardModalProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState('2d 14h 32m 45s');

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const interval = setInterval(() => {
      const now = new Date();
      const seconds = 59 - now.getSeconds();
      const minutes = 59 - now.getMinutes();
      setTimeLeft(`2d 14h ${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    haptics.impact('light');
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        fontFamily: 'Outfit, sans-serif'
      }}
    >
      {/* Dark overlay backdrop click */}
      <div
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0
        }}
      />

      {/* Bottom Sheet Modal Container */}
      <div
        style={{
          width: '100%',
          height: '86vh',
          maxHeight: '88vh',
          background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)',
          borderTopLeftRadius: '1.75rem',
          borderTopRightRadius: '1.75rem',
          borderTop: '1px solid rgba(167, 139, 250, 0.5)',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.7)',
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '1.1rem 1.25rem 0.75rem 1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0,0,0,0.2)'
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: '#ffffff',
                fontSize: '1.3rem',
                fontWeight: 900,
                fontFamily: 'Georgia, serif',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>🏆</span> Weekly Tournament
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#c4b5fd', marginTop: '0.15rem' }}>
              Prize Pool: <span style={{ color: '#fbbf24', fontWeight: 900 }}>$500.00 USDT</span> • Ends in: {timeLeft}
            </div>
          </div>

          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: 'white',
              fontSize: '1.1rem',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem 1.25rem 5.5rem 1.25rem'
          }}
        >
          {/* Top 3 Champions Podium */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              alignItems: 'flex-end',
              marginBottom: '1.5rem',
              marginTop: '0.5rem'
            }}
          >
            {/* 2nd Place */}
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(148, 163, 184, 0.25) 0%, rgba(15, 23, 42, 0.6) 100%)',
                border: '1px solid rgba(203, 213, 225, 0.4)',
                borderRadius: '1rem',
                padding: '0.75rem 0.35rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>🥈</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '85px' }}>
                {TOP_WINNERS[1].name}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{TOP_WINNERS[1].spins} Spins</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#38bdf8', marginTop: '0.35rem' }}>
                {TOP_WINNERS[1].prize}
              </div>
            </div>

            {/* 1st Place (Grand Winner) */}
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.35) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: '2px solid rgba(251, 191, 36, 0.7)',
                boxShadow: '0 0 15px rgba(251, 191, 36, 0.3)',
                borderRadius: '1.25rem',
                padding: '1.1rem 0.35rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: 'scale(1.06)',
                zIndex: 2
              }}
            >
              <div style={{ fontSize: '2.2rem', marginBottom: '0.2rem' }}>👑</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '95px' }}>
                {TOP_WINNERS[0].name}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#fef08a' }}>{TOP_WINNERS[0].spins} Spins</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fbbf24', marginTop: '0.35rem', fontFamily: 'Georgia, serif' }}>
                {TOP_WINNERS[0].prize}
              </div>
            </div>

            {/* 3rd Place */}
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(180, 83, 9, 0.25) 0%, rgba(15, 23, 42, 0.6) 100%)',
                border: '1px solid rgba(217, 119, 6, 0.4)',
                borderRadius: '1rem',
                padding: '0.75rem 0.35rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>🥉</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '85px' }}>
                {TOP_WINNERS[2].name}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#fca5a5' }}>{TOP_WINNERS[2].spins} Spins</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#f87171', marginTop: '0.35rem' }}>
                {TOP_WINNERS[2].prize}
              </div>
            </div>
          </div>

          {/* Rankings Table (Ranks 4 - 10) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
              Top Participants
            </div>

            {OTHER_RANKINGS.map((u) => (
              <div
                key={u.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.9rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'rgba(255,255,255,0.6)', width: '22px' }}>
                    #{u.rank}
                  </span>
                  <span style={{ fontSize: '1.2rem' }}>{u.avatar}</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{u.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{u.spins} spins completed</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34d399' }}>
                  {u.prize}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky User Bottom Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '0.85rem 1.25rem',
            background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 1) 100%)',
            borderTop: '1px solid rgba(167, 139, 250, 0.4)',
            boxShadow: '0 -4px 15px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                color: 'white',
                fontSize: '0.85rem'
              }}
            >
              #42
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>Your Tournament Rank</span>
              <span style={{ fontSize: '0.72rem', color: '#c4b5fd' }}>18 Spins • Projected: <b style={{ color: '#34d399' }}>$5.00</b></span>
            </div>
          </div>

          <button
            onClick={() => {
              handleClose();
            }}
            style={{
              background: 'linear-gradient(180deg, #8b5cf6 0%, #6d28d9 100%)',
              color: 'white',
              border: '1px solid #c4b5fd',
              borderRadius: '0.75rem',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)'
            }}
          >
            Spin to Rank ⬆
          </button>
        </div>
      </div>
    </div>
  );
};

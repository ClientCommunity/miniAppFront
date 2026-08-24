import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { haptics } from '../utils/haptics';
import { throwConfetti } from '../utils/confetti';

export interface DailyRewardsModalProps {
  onClose: () => void;
}

export const DailyRewardsModal: FC<DailyRewardsModalProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleClaim = (_amount?: number) => {
    haptics.notification('success');
    haptics.playWinSound();
    throwConfetti();
    setClaimed(true);
    setTimeout(() => {
      handleClose();
    }, 1200);
  };

  const days = [
    { day: 1, reward: '+80', icon: './assets/diamond_animated.gif', active: true },
    { day: 2, reward: '+80', icon: './assets/diamond_animated.gif' },
    { day: 3, reward: '+200', icon: './assets/giftIconInDailySignIn.png' },
    { day: 4, reward: '+90', icon: './assets/diamond_animated.gif' },
    { day: 5, reward: '+90', icon: './assets/diamond_animated.gif' },
    { day: 6, reward: '+90', icon: './assets/diamond_animated.gif' },
    { day: 7, reward: 'MEGA 6K', icon: './assets/giftIconInDailySignIn.png', isMega: true }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)'
      }}
    >
      {/* Outer Bottom Sheet Container */}
      <div
        style={{
          width: '100%',
          background: 'linear-gradient(180deg, #057a44 0%, #012a18 100%)',
          borderTopLeftRadius: '2rem',
          borderTopRightRadius: '2rem',
          borderTop: '1px solid rgba(0, 230, 118, 0.55)',
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem 1.25rem 2.25rem 1.25rem',
          position: 'relative',
          boxShadow: '0 -15px 35px rgba(0,0,0,0.6)',
          fontFamily: 'Outfit, sans-serif'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            color: 'white',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            cursor: 'pointer',
            zIndex: 20
          }}
        >
          ✕
        </button>

        {/* Inner Binder Card with Dark Emerald Glass */}
        <div
          style={{
            width: '100%',
            maxWidth: '390px',
            background: 'rgba(3, 30, 22, 0.85)',
            border: '1px solid rgba(52, 211, 153, 0.35)',
            borderRadius: '1.5rem',
            position: 'relative',
            paddingBottom: '1.25rem',
            boxShadow: '0 20px 30px -5px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          {/* Binder Straps / Metallic Gold Pegs */}
          <div
            style={{
              position: 'absolute',
              top: '-12px',
              left: '12%',
              width: '14px',
              height: '32px',
              background: 'linear-gradient(180deg, #fde047 0%, #b45309 100%)',
              borderRadius: '8px',
              zIndex: 10,
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 3px 6px rgba(0,0,0,0.4)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-12px',
              right: '12%',
              width: '14px',
              height: '32px',
              background: 'linear-gradient(180deg, #fde047 0%, #b45309 100%)',
              borderRadius: '8px',
              zIndex: 10,
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 3px 6px rgba(0,0,0,0.4)'
            }}
          />

          {/* Header Block with Streak Flame */}
          <div
            style={{
              background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
              borderRadius: '1.5rem 1.5rem 1rem 1rem',
              padding: '1.1rem 1rem',
              textAlign: 'center',
              position: 'relative',
              marginBottom: '0.9rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.4)'
            }}
          >
            <h2
              style={{
                color: 'white',
                margin: 0,
                fontWeight: 900,
                fontSize: '1.25rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Daily Sign-in Rewards
            </h2>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: 'rgba(0,0,0,0.25)',
                padding: '0.2rem 0.65rem',
                borderRadius: '12px',
                marginTop: '0.35rem',
                color: '#fef08a',
                fontSize: '0.74rem',
                fontWeight: 800
              }}
            >
              <span>🔥</span>
              <span>Day 1 Streak Active (+10% Spin Luck!)</span>
            </div>
          </div>

          {/* Days Grid Layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.45rem',
              padding: '0 0.85rem',
              marginBottom: '1rem'
            }}
          >
            {days.map((d) => {
              return (
                <div
                  key={d.day}
                  style={{
                    background: d.active
                      ? 'linear-gradient(180deg, #10b981 0%, #047857 100%)'
                      : d.isMega
                      ? 'linear-gradient(180deg, #f59e0b 0%, #b45309 100%)'
                      : 'rgba(0, 0, 0, 0.35)',
                    borderRadius: '0.75rem',
                    padding: '0.45rem 0.15rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: d.active || d.isMega ? '0 4px 10px rgba(0,0,0,0.3)' : 'inset 0 1px 2px rgba(0,0,0,0.2)',
                    border: d.active
                      ? '2px solid #6ee7b7'
                      : d.isMega
                      ? '2px solid #fde68a'
                      : '1px solid rgba(255,255,255,0.08)',
                    color: d.active || d.isMega ? '#ffffff' : '#94a3b8',
                    transform: d.active ? 'scale(1.03)' : 'none',
                    zIndex: d.active ? 2 : 1,
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      marginBottom: '0.15rem',
                      color: d.active || d.isMega ? '#ffffff' : '#94a3b8'
                    }}
                  >
                    Day {d.day}
                  </div>

                  <div
                    style={{
                      fontSize: '1.25rem',
                      marginBottom: '0.15rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      filter: d.active || d.isMega ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none'
                    }}
                  >
                    <img
                      src={d.icon}
                      alt="Reward"
                      style={{
                        width: d.isMega ? '32px' : '30px',
                        height: d.isMega ? '32px' : '30px',
                        objectFit: 'contain'
                      }}
                    />
                  </div>

                  <div
                    style={{
                      fontSize: d.isMega ? '0.65rem' : '0.72rem',
                      fontWeight: 800,
                      color: d.active || d.isMega ? '#ffffff' : '#cbd5e1'
                    }}
                  >
                    {d.reward}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={() => handleClaim(80)}
              disabled={claimed}
              style={{
                width: '100%',
                background: claimed
                  ? 'linear-gradient(180deg, #64748b 0%, #475569 100%)'
                  : 'linear-gradient(180deg, #00e676 0%, #00a854 100%)',
                color: 'white',
                border: '1px solid rgba(167, 243, 208, 0.8)',
                borderRadius: '0.75rem',
                padding: '0.75rem',
                fontSize: '0.95rem',
                fontWeight: 900,
                boxShadow: '0 4px 18px rgba(0, 230, 118, 0.45), inset 0 1px 1px rgba(255,255,255,0.4)',
                cursor: claimed ? 'default' : 'pointer',
                marginBottom: '0.5rem',
                transition: 'all 0.15s ease'
              }}
            >
              {claimed ? 'Claimed! ✓' : 'Claim Daily Reward 💎'}
            </button>

            <button
              onClick={handleClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#6ee7b7',
                textDecoration: 'underline',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Come back tomorrow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

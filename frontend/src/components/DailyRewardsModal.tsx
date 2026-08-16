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
    { day: 1, reward: 'Up to 80', icon: './assets/purple-diamond.png', active: true },
    { day: 2, reward: '+80', icon: './assets/purple-diamond.png' },
    { day: 3, reward: '+200', icon: './assets/giftIconInDailySignIn.png' },
    { day: 4, reward: '+90', icon: './assets/purple-diamond.png' },
    { day: 5, reward: '+90', icon: './assets/purple-diamond.png' },
    { day: 6, reward: '+90', icon: './assets/purple-diamond.png' },
    { day: 7, reward: 'MEGA +6000', icon: './assets/giftIconInDailySignIn.png', isMega: true }
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
          background: 'linear-gradient(180deg, #0c6340 0%, #032b1d 100%)',
          borderTopLeftRadius: '2rem',
          borderTopRightRadius: '2rem',
          borderTop: '1px solid rgba(52, 211, 153, 0.45)',
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2.25rem 1.25rem 2.5rem 1.25rem',
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

        {/* Inner Binder Card */}
        <div
          style={{
            width: '100%',
            maxWidth: '390px',
            background: '#e3f7ea',
            borderRadius: '1.5rem',
            position: 'relative',
            paddingBottom: '1.5rem',
            boxShadow: '0 20px 30px -5px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Binder Straps / Pegs */}
          <div
            style={{
              position: 'absolute',
              top: '-15px',
              left: '12%',
              width: '16px',
              height: '40px',
              background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
              borderRadius: '10px',
              zIndex: 10,
              boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.15), 0 4px 6px rgba(0,0,0,0.3)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-15px',
              right: '12%',
              width: '16px',
              height: '40px',
              background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
              borderRadius: '10px',
              zIndex: 10,
              boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.15), 0 4px 6px rgba(0,0,0,0.3)'
            }}
          />

          {/* Header Block with Streak Flame */}
          <div
            style={{
              background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
              borderRadius: '1.5rem 1.5rem 1rem 1rem',
              padding: '1.2rem 1rem',
              textAlign: 'center',
              position: 'relative',
              marginBottom: '1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.4)'
            }}
          >
            <h2
              style={{
                color: 'white',
                margin: 0,
                fontFamily: 'Georgia, serif',
                fontWeight: 900,
                fontSize: '1.35rem',
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
                background: 'rgba(0,0,0,0.2)',
                padding: '0.2rem 0.65rem',
                borderRadius: '12px',
                marginTop: '0.4rem',
                color: '#fef08a',
                fontSize: '0.75rem',
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
              gap: '0.5rem',
              padding: '0 1rem',
              marginBottom: '1.25rem'
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
                      : '#ffffff',
                    borderRadius: '0.75rem',
                    padding: '0.5rem 0.15rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: d.active || d.isMega ? '0 4px 10px rgba(0,0,0,0.25)' : '0 2px 4px rgba(0,0,0,0.06)',
                    border: d.active
                      ? '2px solid #6ee7b7'
                      : d.isMega
                      ? '2px solid #fde68a'
                      : '1px solid #e2e8f0',
                    color: d.active || d.isMega ? '#ffffff' : '#475569',
                    transform: d.active ? 'scale(1.04)' : 'none',
                    zIndex: d.active ? 2 : 1,
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      marginBottom: '0.2rem',
                      color: d.active || d.isMega ? '#ffffff' : '#94a3b8'
                    }}
                  >
                    Day {d.day}
                  </div>

                  <div
                    style={{
                      fontSize: '1.4rem',
                      marginBottom: '0.2rem',
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
                        width: d.isMega ? '28px' : '24px',
                        height: d.isMega ? '28px' : '24px',
                        objectFit: 'contain'
                      }}
                    />
                  </div>

                  <div
                    style={{
                      fontSize: d.isMega ? '0.68rem' : '0.75rem',
                      fontWeight: 900,
                      fontFamily: 'Georgia, serif'
                    }}
                  >
                    {d.reward}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div style={{ padding: '0 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={() => handleClaim(80)}
              disabled={claimed}
              style={{
                width: '100%',
                background: claimed
                  ? 'linear-gradient(180deg, #64748b 0%, #475569 100%)'
                  : 'linear-gradient(180deg, #10b981 0%, #047857 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.85rem',
                padding: '0.85rem',
                fontSize: '1.05rem',
                fontWeight: 900,
                fontFamily: 'Georgia, serif',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4), inset 0 1px 1px rgba(255,255,255,0.4)',
                cursor: claimed ? 'default' : 'pointer',
                marginBottom: '0.75rem',
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
                color: '#059669',
                textDecoration: 'underline',
                fontWeight: 700,
                fontSize: '0.85rem',
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

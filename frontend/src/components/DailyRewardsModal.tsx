import type { FC } from 'react';
import { useEffect, useState } from 'react';

export interface DailyRewardsModalProps {
  onClose: () => void;
}

export const DailyRewardsModal: FC<DailyRewardsModalProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Simple mount animation
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // wait for animation
  };

  const days = [
    { day: 1, reward: 'Up to 80', icon: './assets/purple-diamond.png', active: true },
    { day: 2, reward: '+80', icon: './assets/purple-diamond.png' },
    { day: 3, reward: '+200', icon: './assets/giftIconInDailySignIn.png' },
    { day: 4, reward: '+90', icon: './assets/purple-diamond.png' },
    { day: 5, reward: '+90', icon: './assets/purple-diamond.png' },
    { day: 6, reward: '+90', icon: './assets/purple-diamond.png' },
    { day: 7, reward: '+6000', icon: './assets/giftIconInDailySignIn.png' },
  ];

  return (
    <div style={{
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
      backdropFilter: 'blur(3px)'
    }}>
      
      {/* Outer Bottom Sheet Container */}
      <div style={{
        width: '100%',
        background: '#0d5c27', // Dark green background mimicking a bottom sheet
        borderTopLeftRadius: '2rem',
        borderTopRightRadius: '2rem',
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', // bouncy slide up
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2.5rem 1.5rem 3rem 1.5rem',
        position: 'relative',
        boxShadow: '0 -10px 25px rgba(0,0,0,0.5)'
      }}>

        {/* Close Button moved to Outer Sheet */}
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
        <div style={{
          width: '100%',
          maxWidth: '380px',
          background: '#e3f7ea', // Pale mint green from image
          borderRadius: '1.5rem',
          position: 'relative',
          paddingBottom: '1.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
        }}>
        
        {/* Binder Straps / Pegs */}
        <div style={{
          position: 'absolute',
          top: '-15px',
          left: '12%',
          width: '16px',
          height: '40px',
          background: 'linear-gradient(180deg, #ffffff 0%, #e0e0e0 100%)',
          borderRadius: '10px',
          zIndex: 10,
          boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.3)'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '-15px',
          right: '12%',
          width: '16px',
          height: '40px',
          background: 'linear-gradient(180deg, #ffffff 0%, #e0e0e0 100%)',
          borderRadius: '10px',
          zIndex: 10,
          boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.3)'
        }}></div>

        {/* Header Block */}
        <div style={{
          background: 'linear-gradient(180deg, #30c265 0%, #1e9d4d 100%)',
          borderRadius: '1.5rem 1.5rem 1rem 1rem',
          padding: '1.2rem',
          textAlign: 'center',
          position: 'relative',
          marginBottom: '1rem',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.4)'
        }}>
          <h2 style={{ 
            color: 'white', 
            margin: 0, 
            fontFamily: 'Georgia, serif', 
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: '1.4rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
          }}>
            Daily Rewards
          </h2>
        </div>

        {/* Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.5rem',
          padding: '0 1rem',
          marginBottom: '1.5rem'
        }}>
          {days.map((d) => {
            return (
              <div 
                key={d.day}
                style={{
                  background: d.active ? 'linear-gradient(180deg, #38d672 0%, #188942 100%)' : 'white',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  border: d.active ? '1px solid #4ade80' : 'none',
                  color: d.active ? 'white' : '#666',
                  transform: d.active ? 'scale(1.05)' : 'none',
                  zIndex: d.active ? 2 : 1,
                  position: 'relative'
                }}
              >
                <div style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 'bold',
                  marginBottom: '0.2rem',
                  color: d.active ? 'white' : '#a0a0a0'
                }}>
                  Day {d.day}
                </div>
                
                <div style={{ 
                  fontSize: '1.5rem', 
                  marginBottom: '0.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter: d.active ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' : 'none'
                }}>
                  {d.icon.endsWith('.png') ? (
                    <img src={d.icon} alt="Reward" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                  ) : (
                    d.icon
                  )}
                </div>

                <div style={{ 
                  fontSize: d.active ? '0.7rem' : '0.8rem', 
                  fontWeight: 'bold' 
                }}>
                  {d.reward}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button 
            style={{
              width: '100%',
              background: 'linear-gradient(180deg, #30c265 0%, #1c9246 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              padding: '0.85rem',
              fontSize: '1rem',
              fontWeight: 900,
              boxShadow: '0 4px 10px rgba(0,0,0,0.2), inset 0 2px 2px rgba(255,255,255,0.3)',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            Watch Ad To Claim 80
          </button>
          
          <button
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#1a8b42',
              textDecoration: 'underline',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Only Claim 15
          </button>
        </div>
        
        </div>
        
      </div>
    </div>
  );
};

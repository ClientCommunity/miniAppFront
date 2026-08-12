import type { FC } from 'react';

export interface ClaimBottomSheetProps {
  onClose: () => void;
}

export const ClaimBottomSheet: FC<ClaimBottomSheetProps> = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      fontFamily: 'Outfit, sans-serif'
    }}>
      {/* Dark Overlay */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 0
        }} 
      />

      {/* Bottom Sheet Container */}
      <div className="animate-slide-up" style={{
        position: 'relative',
        background: '#042217',
        borderRadius: '1.5rem 1.5rem 0 0',
        padding: '1.5rem 1.25rem 2rem 1.25rem',
        zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.5)'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem', position: 'relative' }}>
          <h2 style={{ 
            fontSize: '1.2rem', 
            fontWeight: 800, 
            color: 'white', 
            margin: 0,
            fontFamily: 'Georgia, serif' 
          }}>
            Choose how to claim
          </h2>
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              right: 0,
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.8
            }}
          >
            ✕
          </button>
        </div>

        {/* Claim Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Card 1: Join EarnCraft VIP */}
          <div style={{
            background: 'rgba(6, 78, 59, 0.4)',
            border: '1px solid rgba(251, 191, 36, 0.5)',
            borderRadius: '1rem',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ 
                background: 'rgba(0,0,0,0.4)', 
                padding: '0.4rem 0.8rem', 
                borderRadius: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: 'fit-content'
              }}>
                <img src="./assets/raffleFeatureCardIcon.png" alt="ticket" style={{ width: '20px', height: '14px', objectFit: 'contain' }} />
                <span style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', fontFamily: 'Georgia, serif' }}>2 ticket(s)</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 700, paddingLeft: '0.2rem' }}>
                This issue 0/2
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'white', fontSize: '0.95rem', fontWeight: 800, fontFamily: 'Georgia, serif' }}>
                Join EarnCraft VIP
                <div style={{ 
                  width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', 
                  display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' 
                }}>?</div>
              </div>
              <button style={{
                background: 'linear-gradient(180deg, #fde047 0%, #f59e0b 100%)',
                border: 'none',
                borderRadius: '0.6rem',
                padding: '0.5rem 1.5rem',
                color: 'white',
                fontWeight: 800,
                fontSize: '1rem',
                fontStyle: 'italic',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)',
                minWidth: '100px'
              }}>
                Claim
              </button>
            </div>
          </div>

          {/* Card 2: 5 Stars */}
          <div style={{
            background: 'rgba(6, 78, 59, 0.4)',
            border: '1px solid rgba(251, 191, 36, 0.5)',
            borderRadius: '1rem',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ 
                background: 'rgba(0,0,0,0.4)', 
                padding: '0.4rem 0.8rem', 
                borderRadius: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: 'fit-content'
              }}>
                <img src="./assets/raffleFeatureCardIcon.png" alt="ticket" style={{ width: '20px', height: '14px', objectFit: 'contain' }} />
                <span style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', fontFamily: 'Georgia, serif' }}>1 ticket(s)</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 700, paddingLeft: '0.2rem' }}>
                This issue 0/100
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'white', fontSize: '1.1rem', fontWeight: 800 }}>
                5 
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <button style={{
                background: 'linear-gradient(180deg, #fde047 0%, #f59e0b 100%)',
                border: 'none',
                borderRadius: '0.6rem',
                padding: '0.5rem 1.5rem',
                color: 'white',
                fontWeight: 800,
                fontSize: '1rem',
                fontStyle: 'italic',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)',
                minWidth: '100px'
              }}>
                Claim
              </button>
            </div>
          </div>

          {/* Card 3: 20 Stars (Discounted) */}
          <div style={{
            background: 'rgba(6, 78, 59, 0.4)',
            border: '1px solid rgba(251, 191, 36, 0.5)',
            borderRadius: '1rem',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ 
                background: 'rgba(0,0,0,0.4)', 
                padding: '0.4rem 0.8rem', 
                borderRadius: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: 'fit-content'
              }}>
                <img src="./assets/raffleFeatureCardIcon.png" alt="ticket" style={{ width: '20px', height: '14px', objectFit: 'contain' }} />
                <span style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', fontFamily: 'Georgia, serif' }}>5 ticket(s)</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 700, paddingLeft: '0.2rem' }}>
                This issue 0/25
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'line-through' }}>25</span>
                <span style={{ color: 'white', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  20
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </span>
                <span style={{ 
                  background: 'rgba(251, 191, 36, 0.2)', 
                  color: '#fbbf24', 
                  fontSize: '0.65rem', 
                  fontWeight: 800, 
                  padding: '0.2rem 0.4rem', 
                  borderRadius: '0.3rem',
                  marginLeft: '0.2rem'
                }}>
                  20% off
                </span>
              </div>
              <button style={{
                background: 'linear-gradient(180deg, #fde047 0%, #f59e0b 100%)',
                border: 'none',
                borderRadius: '0.6rem',
                padding: '0.5rem 1.5rem',
                color: 'white',
                fontWeight: 800,
                fontSize: '1rem',
                fontStyle: 'italic',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)',
                minWidth: '100px'
              }}>
                Claim
              </button>
            </div>
          </div>
          
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '1.5rem', 
          textAlign: 'center', 
          color: 'rgba(255,255,255,0.6)', 
          fontSize: '0.85rem', 
          fontWeight: 700 
        }}>
          Claimed this issue 0/9,999
        </div>

      </div>
    </div>
  );
};

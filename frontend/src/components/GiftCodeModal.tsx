import { useState, useEffect } from 'react';
import type { FC } from 'react';

export interface GiftCodeModalProps {
  onClose: () => void;
}

export const GiftCodeModal: FC<GiftCodeModalProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [giftCode, setGiftCode] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleClaim = () => {
    if (!giftCode.trim()) {
      setStatusMessage('Please enter a valid gift code');
      return;
    }
    // Simulation / visual feedback
    setStatusMessage('Gift code redeemed successfully! 🎉');
    setTimeout(() => {
      handleClose();
    }, 1200);
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
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease'
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
          background: 'linear-gradient(180deg, #043823 0%, #022617 100%)',
          borderTopLeftRadius: '1.75rem',
          borderTopRightRadius: '1.75rem',
          borderTop: '1px solid rgba(52, 211, 153, 0.4)',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.6)',
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.25rem 1.25rem 2rem 1.25rem',
          position: 'relative',
          zIndex: 1,
          boxSizing: 'border-box',
          fontFamily: 'Outfit, sans-serif'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1.1rem',
            right: '1.1rem',
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '1.35rem',
            cursor: 'pointer',
            padding: '0.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.85,
            zIndex: 10
          }}
        >
          ✕
        </button>

        {/* Top "Claim Rewards" Highlight Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.9rem 1rem',
            background: 'linear-gradient(90deg, #028a4c 0%, #00b05b 50%, #028a4c 100%)',
            borderRadius: '1rem',
            border: '1px solid rgba(52, 211, 153, 0.6)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
            marginTop: '0.5rem',
            marginBottom: '1.5rem'
          }}
        >
          <img
            src="./assets/giftcodeFeatureCardIcon.png"
            alt="Gift Treasure"
            style={{
              width: '64px',
              height: '64px',
              objectFit: 'contain',
              flexShrink: 0,
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3
              style={{
                margin: 0,
                color: '#ffffff',
                fontSize: '1.25rem',
                fontWeight: 800,
                fontFamily: 'Georgia, serif',
                letterSpacing: '0.2px'
              }}
            >
              Claim Rewards
            </h3>
            <p
              style={{
                margin: '0.25rem 0 0 0',
                color: 'rgba(255,255,255,0.92)',
                fontSize: '0.85rem',
                lineHeight: 1.3
              }}
            >
              Enter a gift code to get Gems/Cash/Spins
            </p>
          </div>
        </div>

        {/* Middle Form Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: '1.25rem' }}>
          <h2
            style={{
              margin: '0 0 0.35rem 0',
              color: '#ffffff',
              fontSize: '1.4rem',
              fontWeight: 800,
              fontFamily: 'Georgia, serif'
            }}
          >
            Gift Code
          </h2>
          <p
            style={{
              margin: '0 0 1.25rem 0',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}
          >
            Enter a gift code to claim your rewards
          </p>

          {/* Input Box */}
          <div style={{ width: '100%', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Enter gift code"
              value={giftCode}
              onChange={(e) => {
                setGiftCode(e.target.value);
                setStatusMessage(null);
              }}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                borderRadius: '0.75rem',
                padding: '0.9rem 1.1rem',
                color: '#ffffff',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
                outline: 'none',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)'
              }}
            />
            {statusMessage && (
              <div
                style={{
                  fontSize: '0.85rem',
                  marginTop: '0.4rem',
                  color: statusMessage.includes('🎉') ? '#4ade80' : '#f87171',
                  textAlign: 'center',
                  fontWeight: 600
                }}
              >
                {statusMessage}
              </div>
            )}
          </div>

          {/* Claim Button */}
          <button
            onClick={handleClaim}
            style={{
              width: '100%',
              background: 'linear-gradient(180deg, #facc15 0%, #eab308 50%, #ca8a04 100%)',
              border: '1px solid rgba(254, 240, 138, 0.7)',
              borderRadius: '0.75rem',
              padding: '0.9rem 1.5rem',
              color: '#1e293b',
              fontWeight: 900,
              fontSize: '1.05rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(234, 179, 8, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
              transition: 'transform 0.1s ease',
              textAlign: 'center'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Claim
          </button>
        </div>

        {/* Footer Community Notice */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.4
          }}
        >
          Need more gift codes?{' '}
          <span
            style={{
              color: '#fbbf24',
              textDecoration: 'underline',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            onClick={() => {
              // Open community or telegram channel
              // @ts-ignore
              window.Telegram?.WebApp?.openTelegramLink?.('https://t.me/EarnCraftCommunity') ||
                window.open('https://t.me/EarnCraftCommunity', '_blank');
            }}
          >
            Join our community
          </span>{' '}
          for occasional airdrops.
        </div>
      </div>
    </div>
  );
};

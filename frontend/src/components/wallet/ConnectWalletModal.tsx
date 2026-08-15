import { useState, useEffect } from 'react';
import type { FC } from 'react';

export interface ConnectWalletModalProps {
  onClose: () => void;
  onSave: (data: { address: string; phone?: string }) => void;
  initialAddress?: string | null;
  initialPhone?: string | null;
}

export const ConnectWalletModal: FC<ConnectWalletModalProps> = ({
  onClose,
  onSave,
  initialAddress,
  initialPhone
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [phone, setPhone] = useState(initialPhone || '');
  const [address, setAddress] = useState(initialAddress || '');

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleGetPhone = () => {
    // Simulated auto-fill from telegram user or prompt
    setPhone('+1 (555) 019-2834');
  };

  const handleConnectTon = () => {
    // Simulated TON wallet connection
    const mockTonAddress = 'UQDr9a...8f9a';
    setAddress(mockTonAddress);
  };

  const handleSave = () => {
    if (!address.trim()) {
      alert('Please enter or connect a wallet address');
      return;
    }
    onSave({ address, phone });
    handleClose();
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
      {/* Dark overlay backdrop */}
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
          background: 'linear-gradient(180deg, #058245 0%, #024a27 100%)',
          borderTopLeftRadius: '1.5rem',
          borderTopRightRadius: '1.5rem',
          borderTop: '1px solid rgba(52, 211, 153, 0.5)',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.6)',
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.25rem 1.25rem 1.75rem 1.25rem',
          position: 'relative',
          zIndex: 1,
          boxSizing: 'border-box',
          fontFamily: 'Outfit, sans-serif'
        }}
      >
        {/* Header Title & Close Button */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: '0.75rem' }}>
          <h2
            style={{
              margin: 0,
              color: '#ffffff',
              fontSize: '1.3rem',
              fontWeight: 800,
              fontFamily: 'Georgia, serif'
            }}
          >
            Add USDT (TON)
          </h2>
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              right: 0,
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1.35rem',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.85
            }}
          >
            ✕
          </button>
        </div>

        {/* TON USDT Subtitle Section */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h3
            style={{
              margin: '0 0 0.15rem 0',
              color: '#ffffff',
              fontSize: '1.15rem',
              fontWeight: 800,
              fontFamily: 'Georgia, serif'
            }}
          >
            TON USDT
          </h3>
          <p
            style={{
              margin: 0,
              color: 'rgba(255,255,255,0.85)',
              fontSize: '0.85rem'
            }}
          >
            USDT on TON network
          </p>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Mobile Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: '0.95rem',
                color: '#ffffff',
                width: '85px',
                flexShrink: 0
              }}
            >
              Mobile
            </span>

            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(0, 0, 0, 0.22)',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                borderRadius: '0.75rem',
                padding: '0.35rem 0.45rem 0.35rem 0.75rem',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="++1  Click to get phone"
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontStyle: phone ? 'normal' : 'italic',
                  width: '100%'
                }}
              />

              <button
                onClick={handleGetPhone}
                style={{
                  background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                  border: '1px solid rgba(167, 243, 208, 0.6)',
                  borderRadius: '0.6rem',
                  padding: '0.35rem 1.1rem',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  flexShrink: 0
                }}
              >
                Get
              </button>
            </div>
          </div>

          {/* Wallet Address Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: '0.95rem',
                color: '#ffffff',
                width: '85px',
                flexShrink: 0,
                lineHeight: 1.2
              }}
            >
              Wallet<br />Address
            </span>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.22)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  borderRadius: '0.75rem',
                  padding: '0.65rem 0.75rem',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
                  minWidth: 0
                }}
              >
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Click to connect TC"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    width: '100%'
                  }}
                />
              </div>

              {/* Connect TON Button */}
              <button
                onClick={handleConnectTon}
                style={{
                  background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.6)',
                  borderRadius: '0.75rem',
                  padding: '0.6rem 0.85rem',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 2px 6px rgba(2, 132, 199, 0.4)',
                  flexShrink: 0,
                  whiteSpace: 'nowrap'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 9l10 13 10-13L12 2zm0 3.5l6.5 4.5L12 18.5 5.5 10 12 5.5z" />
                </svg>
                <span>Connect TON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons (Right-Aligned) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(6, 78, 59, 0.75)',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              borderRadius: '0.65rem',
              padding: '0.55rem 1.4rem',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            style={{
              background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
              border: '1px solid rgba(167, 243, 208, 0.6)',
              borderRadius: '0.65rem',
              padding: '0.55rem 1.6rem',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

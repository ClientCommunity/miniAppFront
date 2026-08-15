import { useState } from 'react';
import type { FC } from 'react';
import { ConnectWalletModal } from './ConnectWalletModal';
import { UserAgreementModal } from './UserAgreementModal';

export interface WalletPageProps {
  onBack: () => void;
}

export const WalletPage: FC<WalletPageProps> = ({ onBack }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletPhone, setWalletPhone] = useState<string | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  const handleConnectWallet = () => {
    setShowConnectModal(true);
  };

  const handleSaveWallet = (data: { address: string; phone?: string }) => {
    setWalletConnected(true);
    setWalletAddress(data.address);
    if (data.phone) setWalletPhone(data.phone);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #0c6340 0%, #032b1d 60%, #01170f 100%)',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        overflowY: 'auto',
        zIndex: 50,
        fontFamily: 'Outfit, sans-serif'
      }}
    >
      {/* Background Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '320px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Top Header & Stats Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 1rem 0.75rem 1rem',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '20px',
            padding: '0.35rem 0.85rem',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          &lt; Back
        </button>

        {/* Resource Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {/* Energy Badge */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'white',
              padding: '0.2rem 0.55rem',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 6px rgba(251, 191, 36, 0.6)'
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#1e293b' }}>⚡</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>0</span>
          </div>

          {/* Purple Diamond Badge with green + */}
          <div
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'white',
              padding: '0.2rem 0.65rem 0.2rem 0.5rem',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <img
              src="./assets/purple-diamond.png"
              alt="Diamond"
              style={{ width: '18px', height: '18px', objectFit: 'contain' }}
            />
            <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>760</span>

            {/* Green plus button */}
            <div
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                background: '#22c55e',
                color: 'white',
                fontSize: '10px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 4px rgba(34, 197, 94, 0.8)'
              }}
            >
              +
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Content */}
      <div
        style={{
          flex: 1,
          padding: '0.5rem 1.25rem 2rem 1.25rem',
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* 1. Balance Overview Card */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(135deg, rgba(3, 102, 57, 0.7) 0%, rgba(2, 44, 34, 0.85) 100%)',
              borderRadius: '1rem',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
              marginBottom: '1.5rem'
            }}
          >
            <span
              style={{
                color: '#ffffff',
                fontSize: '1.25rem',
                fontWeight: 800,
                fontFamily: 'Georgia, serif'
              }}
            >
              Balance
            </span>
            <span
              style={{
                color: '#ffffff',
                fontSize: '1.8rem',
                fontWeight: 900,
                fontFamily: 'Georgia, serif'
              }}
            >
              $ 0.00
            </span>
          </div>

          {/* 2. Wallets Container */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h2
              style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 0 0.75rem 0',
                fontFamily: 'Georgia, serif'
              }}
            >
              Wallets
            </h2>

            <div
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '1rem',
                border: '1px solid rgba(52, 211, 153, 0.25)',
                padding: '0.9rem',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)'
              }}
            >
              {/* Crypto Wallet Card */}
              <div
                style={{
                  background: 'rgba(6, 78, 59, 0.35)',
                  borderRadius: '0.85rem',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  padding: '0.9rem 1rem'
                }}
              >
                {/* Top Row: Tag + Connect Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{
                      background: 'rgba(6, 78, 59, 0.8)',
                      border: '1px solid rgba(52, 211, 153, 0.5)',
                      borderRadius: '1rem',
                      padding: '0.25rem 0.75rem',
                      color: '#6ee7b7',
                      fontSize: '0.85rem',
                      fontWeight: 700
                    }}
                  >
                    Crypto Wallet
                  </div>

                  <button
                    onClick={handleConnectWallet}
                    style={{
                      background: walletConnected
                        ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
                      border: '1px solid rgba(167, 243, 208, 0.6)',
                      borderRadius: '1.25rem',
                      padding: '0.35rem 1.35rem',
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: '0.95rem',
                      fontFamily: 'Georgia, serif',
                      cursor: 'pointer',
                      boxShadow: '0 0 14px rgba(34, 197, 94, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
                      transition: 'transform 0.1s ease'
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {walletConnected ? 'Edit' : 'Connect'}
                  </button>
                </div>

                {/* Divider Line */}
                <div
                  style={{
                    height: '1px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    margin: '0.75rem 0'
                  }}
                />

                {/* Bottom Row: Status */}
                <div
                  style={{
                    color: walletConnected ? '#a7f3d0' : 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}
                >
                  {walletConnected ? `Connected: ${walletAddress}` : 'Not connected'}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Records, Feedback & Agreement Area */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.65rem'
            }}
          >
            {/* Buttons Row */}
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                onClick={() => alert('No transaction records yet.')}
                style={{
                  background: 'rgba(6, 78, 59, 0.7)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  borderRadius: '0.6rem',
                  padding: '0.45rem 1.25rem',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}
              >
                Records
              </button>

              <button
                onClick={() => alert('Support: feedback@earncraft.app')}
                style={{
                  background: 'rgba(6, 78, 59, 0.7)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  borderRadius: '0.6rem',
                  padding: '0.45rem 1.25rem',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}
              >
                Feedback
              </button>
            </div>

            {/* Agreement Link */}
            <span
              style={{
                color: '#fbbf24',
                textDecoration: 'underline',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                paddingRight: '0.2rem'
              }}
              onClick={() => setShowAgreementModal(true)}
            >
              Agreement
            </span>
          </div>

          {/* 4. Fee Disclaimer */}
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.85rem',
              marginTop: '1.75rem',
              lineHeight: 1.4
            }}
          >
            Transaction fee ranges from 1% to 15%.
          </div>
        </div>

        {/* 5. Bottom Withdrawal CTA Button */}
        <div style={{ paddingTop: '2rem' }}>
          <button
            onClick={() => {
              if (!walletConnected) {
                setShowConnectModal(true);
              } else {
                alert('Withdrawal request submitted!');
              }
            }}
            style={{
              width: '100%',
              background: 'linear-gradient(180deg, #22c55e 0%, #15803d 100%)',
              border: '1px solid rgba(167, 243, 208, 0.6)',
              borderRadius: '1rem',
              padding: '1rem',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '1.05rem',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(34, 197, 94, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
              transition: 'transform 0.1s ease',
              textAlign: 'center'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Select a wallet to withdraw
          </button>
        </div>
      </div>

      {/* Connect Wallet Modal */}
      {showConnectModal && (
        <ConnectWalletModal
          onClose={() => setShowConnectModal(false)}
          onSave={handleSaveWallet}
          initialAddress={walletAddress}
          initialPhone={walletPhone}
        />
      )}

      {/* User Agreement Modal */}
      {showAgreementModal && (
        <UserAgreementModal onClose={() => setShowAgreementModal(false)} />
      )}
    </div>
  );
};

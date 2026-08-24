import { useState } from 'react';
import type { FC } from 'react';
import { ConnectWalletModal } from './ConnectWalletModal';
import { UserAgreementModal } from './UserAgreementModal';
import { WalletRecordsPage } from './WalletRecordsPage';
import { FeedbackModal } from './FeedbackModal';
import { haptics } from '../../utils/haptics';
import { throwConfetti } from '../../utils/confetti';

export interface WalletPageProps {
  onBack: () => void;
}

export const WalletPage: FC<WalletPageProps> = ({ onBack }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletPhone, setWalletPhone] = useState<string | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showRecordsPage, setShowRecordsPage] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1.0);
  const [isBtnPressed, setIsBtnPressed] = useState(false);

  const handleConnectWallet = () => {
    haptics.impact('light');
    setShowConnectModal(true);
  };

  const handleSaveWallet = (data: { address: string; phone?: string }) => {
    haptics.notification('success');
    setWalletConnected(true);
    setWalletAddress(data.address);
    if (data.phone) setWalletPhone(data.phone);
  };

  const handleWithdraw = () => {
    if (!walletConnected) {
      haptics.impact('medium');
      setShowConnectModal(true);
      return;
    }

    haptics.notification('success');
    haptics.playWinSound();
    throwConfetti();
    alert(`Withdrawal request of $${withdrawAmount.toFixed(2)} USDT (BEP20) submitted to ${walletAddress}!`);
  };

  const fee = withdrawAmount * 0.05;
  const netAmount = Math.max(0, withdrawAmount - fee);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% -10%, #057a44 0%, #024e2c 40%, #012a18 75%, #00170d 100%)',
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
          background: 'radial-gradient(circle, rgba(0, 230, 118, 0.28) 0%, rgba(5, 122, 68, 0.12) 50%, rgba(0,0,0,0) 75%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Top Header & Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1rem 0.5rem 1rem',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => {
            haptics.impact('light');
            onBack();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '16px',
            padding: '0.3rem 0.75rem',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          ‹ Back
        </button>

        {/* Resource Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {/* Energy */}
          <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.18rem 0.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <img src="./assets/energy_48-Bei1wi9i.png" alt="Energy" style={{ width: '15px', height: '15px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>50</span>
          </div>

          {/* Spins */}
          <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.18rem 0.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <img src="./assets/wheel-of-fortune.png" alt="Spins" style={{ width: '15px', height: '15px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>12</span>
          </div>

          {/* Diamonds */}
          <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.18rem 0.55rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <img src="./assets/purple-diamond.png" alt="Diamond" style={{ width: '15px', height: '15px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>760</span>
          </div>
        </div>
      </div>

      {/* Main Wallet Page Content */}
      <div
        style={{
          flex: 1,
          padding: '0.4rem 1rem 1.75rem 1rem',
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* 1. Compact Available Balance Banner with Tether (USDT ₮) Icon */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.65rem 0.95rem',
              background: 'linear-gradient(135deg, rgba(5, 115, 72, 0.65) 0%, rgba(2, 55, 36, 0.9) 100%)',
              borderRadius: '0.9rem',
              border: '1px solid rgba(0, 230, 118, 0.45)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
          >
            {/* Left: Tether (USDT) Coin Badge + Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              {/* Tether USDT ₮ SVG Coin Badge */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #26a17b 0%, #168462 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  fontFamily: 'sans-serif',
                  lineHeight: 1,
                  flexShrink: 0
                }}
              >
                ₮
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    lineHeight: 1.2
                  }}
                >
                  Available Balance
                </span>
                <span style={{ color: '#86efac', fontSize: '0.68rem', fontWeight: 600 }}>
                  USDT Tether (BEP-20)
                </span>
              </div>
            </div>

            {/* Right: Balance Amount */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
              <span
                style={{
                  color: '#facc15',
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  textShadow: '0 1px 4px rgba(0,0,0,0.5)'
                }}
              >
                $ 0.56
              </span>
            </div>
          </div>

          {/* 2. Connected Wallet Container */}
          <div>
            <h2
              style={{
                fontSize: '0.92rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 0 0.45rem 0'
              }}
            >
              Connected Wallet
            </h2>

            <div
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: '0.85rem',
                border: '1px solid rgba(0, 230, 118, 0.25)',
                padding: '0.65rem 0.85rem',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              {/* Top Row: Tag + Connect/Edit Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  style={{
                    background: 'rgba(217, 119, 6, 0.25)',
                    border: '1px solid rgba(251, 191, 36, 0.6)',
                    borderRadius: '0.75rem',
                    padding: '0.2rem 0.6rem',
                    color: '#fbbf24',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <span>🟡</span>
                  <span>USDT (BEP-20)</span>
                </div>

                <button
                  onClick={handleConnectWallet}
                  style={{
                    background: walletConnected
                      ? 'linear-gradient(180deg, #00e676 0%, #00a854 100%)'
                      : 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                    border: '1px solid rgba(167, 243, 208, 0.7)',
                    borderRadius: '0.65rem',
                    padding: '0.25rem 0.85rem',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0, 230, 118, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4)'
                  }}
                >
                  {walletConnected ? 'Edit' : 'Connect'}
                </button>
              </div>

              {/* Divider Line */}
              <div
                style={{
                  height: '1px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  margin: '0.5rem 0'
                }}
              />

              {/* Bottom Row: Status */}
              <div
                style={{
                  color: walletConnected ? '#a7f3d0' : 'rgba(255, 255, 255, 0.65)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  wordBreak: 'break-all'
                }}
              >
                {walletConnected ? `Connected: ${walletAddress}` : 'Not connected (Tap Connect to bind BEP-20 wallet)'}
              </div>
            </div>
          </div>

          {/* 3. Withdrawal Amount Stepper & Fee Calculator */}
          <div>
            <h2
              style={{
                fontSize: '0.92rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 0 0.45rem 0'
              }}
            >
              Withdraw Amount
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem', marginBottom: '0.45rem' }}>
              {[1.0, 2.5, 5.0, 10.0].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    haptics.selection();
                    setWithdrawAmount(amt);
                  }}
                  style={{
                    background:
                      withdrawAmount === amt
                        ? 'linear-gradient(180deg, #00e676 0%, #00a854 100%)'
                        : 'rgba(0, 0, 0, 0.3)',
                    border:
                      withdrawAmount === amt
                        ? '1px solid #86efac'
                        : '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '0.65rem',
                    padding: '0.45rem 0',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: withdrawAmount === amt ? '0 2px 8px rgba(0, 230, 118, 0.35)' : 'none',
                    transition: 'all 0.1s ease'
                  }}
                >
                  ${amt.toFixed(2)}
                </button>
              ))}
            </div>

            {/* Fee Preview Breakdown */}
            <div
              style={{
                background: 'rgba(0,0,0,0.22)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.65rem',
                padding: '0.45rem 0.75rem',
                fontSize: '0.74rem',
                display: 'flex',
                justifyContent: 'space-between',
                color: '#a7f3d0'
              }}
            >
              <span>Network Gas Fee (5%): ${fee.toFixed(2)}</span>
              <span>Net Payout: <b style={{ color: '#fbbf24' }}>${netAmount.toFixed(2)} USDT</b></span>
            </div>
          </div>

          {/* 4. Compact Records, Support & Agreement Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '0.15rem'
            }}
          >
            {/* Small User Agreement Link */}
            <span
              style={{
                color: '#fbbf24',
                textDecoration: 'underline',
                fontWeight: 600,
                fontSize: '0.76rem',
                cursor: 'pointer',
                opacity: 0.95
              }}
              onClick={() => {
                haptics.impact('light');
                setShowAgreementModal(true);
              }}
            >
              User Agreement 📜
            </span>

            {/* Compact Mini Action Buttons */}
            <div style={{ display: 'flex', gap: '0.45rem' }}>
              <button
                onClick={() => {
                  haptics.impact('light');
                  setShowRecordsPage(true);
                }}
                style={{
                  background: 'rgba(5, 115, 72, 0.45)',
                  border: '1px solid rgba(0, 230, 118, 0.35)',
                  borderRadius: '0.5rem',
                  padding: '0.3rem 0.7rem',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                Records 📋
              </button>

              <button
                onClick={() => {
                  haptics.impact('light');
                  setShowFeedbackModal(true);
                }}
                style={{
                  background: 'rgba(5, 115, 72, 0.45)',
                  border: '1px solid rgba(0, 230, 118, 0.35)',
                  borderRadius: '0.5rem',
                  padding: '0.3rem 0.7rem',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                Support 💬
              </button>
            </div>
          </div>
        </div>

        {/* 5. Compact Bottom Withdrawal CTA Button */}
        <div style={{ paddingTop: '0.5rem' }}>
          <button
            onClick={handleWithdraw}
            onMouseDown={() => setIsBtnPressed(true)}
            onMouseUp={() => setIsBtnPressed(false)}
            onMouseLeave={() => setIsBtnPressed(false)}
            onTouchStart={() => setIsBtnPressed(true)}
            onTouchEnd={() => setIsBtnPressed(false)}
            style={{
              width: '100%',
              background: 'linear-gradient(180deg, #00e676 0%, #00a854 60%, #008a3b 100%)',
              border: '1px solid rgba(167, 243, 208, 0.8)',
              borderRadius: '0.85rem',
              padding: '0.65rem 1rem',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: isBtnPressed
                ? '0 1px 0 #012a18, inset 0 2px 4px rgba(0,0,0,0.4)'
                : '0 3px 0 #012a18, 0 4px 12px rgba(0, 230, 118, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
              transform: isBtnPressed ? 'translateY(2px)' : 'translateY(0)',
              transition: 'transform 0.08s ease, box-shadow 0.08s ease',
              textAlign: 'center'
            }}
          >
            {walletConnected ? `Withdraw $${withdrawAmount.toFixed(2)} USDT (BEP20) 🚀` : 'Connect BEP-20 Wallet to Withdraw'}
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

      {/* Wallet Records / History Page */}
      {showRecordsPage && (
        <WalletRecordsPage onBack={() => setShowRecordsPage(false)} />
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal onClose={() => setShowFeedbackModal(false)} />
      )}
    </div>
  );
};

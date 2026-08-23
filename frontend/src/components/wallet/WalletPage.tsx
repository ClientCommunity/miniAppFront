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

      {/* Top Header & Navigation */}
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
          onClick={() => {
            haptics.impact('light');
            onBack();
          }}
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
          ‹ Back
        </button>

        {/* Resource Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {/* Energy */}
          <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.2rem 0.55rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <img src="./assets/energy_48-Bei1wi9i.png" alt="Energy" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>50</span>
          </div>

          {/* Spins */}
          <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.2rem 0.55rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <img src="./assets/wheel-of-fortune.png" alt="Spins" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>12</span>
          </div>

          {/* Diamonds */}
          <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.2rem 0.65rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <img src="./assets/purple-diamond.png" alt="Diamond" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>760</span>
          </div>
        </div>
      </div>

      {/* Main Wallet Page Content */}
      <div
        style={{
          flex: 1,
          padding: '0.5rem 1.25rem 2.5rem 1.25rem',
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* 1. Balance Banner */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.1rem 1.4rem',
              background: 'linear-gradient(135deg, rgba(3, 102, 57, 0.75) 0%, rgba(2, 44, 34, 0.9) 100%)',
              borderRadius: '1.25rem',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
              marginBottom: '1.25rem'
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
              Available Balance
            </span>
            <span
              style={{
                color: '#facc15',
                fontSize: '1.85rem',
                fontWeight: 900,
                fontFamily: 'Georgia, serif'
              }}
            >
              $ 0.56
            </span>
          </div>

          {/* 2. Wallets Container */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h2
              style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 0 0.65rem 0',
                fontFamily: 'Georgia, serif'
              }}
            >
              Connected Wallet
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
                      background: 'rgba(217, 119, 6, 0.25)',
                      border: '1px solid rgba(251, 191, 36, 0.6)',
                      borderRadius: '1rem',
                      padding: '0.25rem 0.75rem',
                      color: '#fbbf24',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <span>🟡</span>
                    <span>USDT (BEP-20)</span>
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
                      boxShadow: '0 0 14px rgba(34, 197, 94, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.5)'
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
                    margin: '0.75rem 0'
                  }}
                />

                {/* Bottom Row: Status */}
                <div
                  style={{
                    color: walletConnected ? '#a7f3d0' : 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    wordBreak: 'break-all'
                  }}
                >
                  {walletConnected ? `Connected: ${walletAddress}` : 'Not connected (Tap Connect to bind BEP-20 wallet)'}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Withdrawal Amount Stepper & Fee Calculator */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h2
              style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 0 0.65rem 0',
                fontFamily: 'Georgia, serif'
              }}
            >
              Withdraw Amount
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem', marginBottom: '0.65rem' }}>
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
                        ? 'linear-gradient(180deg, #10b981 0%, #047857 100%)'
                        : 'rgba(0, 0, 0, 0.25)',
                    border:
                      withdrawAmount === amt
                        ? '1px solid #6ee7b7'
                        : '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '0.75rem',
                    padding: '0.6rem 0',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    fontFamily: 'Georgia, serif',
                    cursor: 'pointer'
                  }}
                >
                  ${amt.toFixed(2)}
                </button>
              ))}
            </div>

            {/* Fee Preview Breakdown */}
            <div
              style={{
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.75rem',
                padding: '0.65rem 0.9rem',
                fontSize: '0.8rem',
                display: 'flex',
                justifyContent: 'space-between',
                color: '#a7f3d0'
              }}
            >
              <span>Network Gas Fee (5%): ${fee.toFixed(2)}</span>
              <span>Net Payout: <b style={{ color: '#fbbf24' }}>${netAmount.toFixed(2)} USDT</b></span>
            </div>
          </div>

          {/* 4. Records, Feedback & Agreement Area */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.5rem'
            }}
          >
            <span
              style={{
                color: '#fbbf24',
                textDecoration: 'underline',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
              onClick={() => {
                haptics.impact('light');
                setShowAgreementModal(true);
              }}
            >
              User Agreement 📜
            </span>

            {/* Buttons Row */}
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                onClick={() => {
                  haptics.impact('light');
                  setShowRecordsPage(true);
                }}
                style={{
                  background: 'rgba(6, 78, 59, 0.7)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  borderRadius: '0.6rem',
                  padding: '0.45rem 1.15rem',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
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
                  background: 'rgba(6, 78, 59, 0.7)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  borderRadius: '0.6rem',
                  padding: '0.45rem 1.15rem',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}
              >
                Support 💬
              </button>
            </div>
          </div>
        </div>

        {/* 5. Bottom Withdrawal CTA Button */}
        <div style={{ paddingTop: '1.5rem' }}>
          <button
            onClick={handleWithdraw}
            style={{
              width: '100%',
              background: 'linear-gradient(180deg, #22c55e 0%, #15803d 100%)',
              border: '1px solid rgba(167, 243, 208, 0.6)',
              borderRadius: '1rem',
              padding: '1rem',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '1.1rem',
              fontFamily: 'Georgia, serif',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(34, 197, 94, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
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

import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { ConnectWalletModal } from './ConnectWalletModal';
import { UserAgreementModal } from './UserAgreementModal';
import { WalletRecordsPage } from './WalletRecordsPage';
import { FeedbackModal } from './FeedbackModal';
import { haptics } from '../../utils/haptics';
import { throwConfetti } from '../../utils/confetti';
import { notifyToast } from '../../utils/debugToast';

import { getInitialWalletData, fetchWalletData, bindWallet, submitWithdrawal } from '../../services/dataService';

export interface WalletPageProps {
  onBack: () => void;
}

export const WalletPage: FC<WalletPageProps> = ({ onBack }) => {
  const initialData = getInitialWalletData();
  const [walletData, setWalletData] = useState<any>(initialData || {
    availableBalanceUsd: 0.76,
    connected: false,
    tonWalletAddress: '',
    minWithdrawalUsd: 1.0,
    presetAmounts: [1.0, 2.5, 5.0, 10.0],
    recentTransactions: []
  });
  const [walletConnected, setWalletConnected] = useState(walletData.connected || false);
  const [walletAddress, setWalletAddress] = useState<string | null>(walletData.tonWalletAddress || null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showRecordsPage, setShowRecordsPage] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [customAmountStr, setCustomAmountStr] = useState<string>('1.00');
  const [isBtnPressed, setIsBtnPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(() => initialData === null);

  useEffect(() => {
    fetchWalletData().then((data) => {
      if (data) {
        setWalletData(data);
        if (data.connected !== undefined) setWalletConnected(data.connected);
        if (data.tonWalletAddress) setWalletAddress(data.tonWalletAddress);
        if (data.presetAmounts && data.presetAmounts.length > 0) {
          setCustomAmountStr(data.presetAmounts[0].toFixed(2));
        }
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, []);

  const handleConnectWallet = () => {
    haptics.impact('light');
    setShowConnectModal(true);
  };

  const handleSaveWallet = async (data: { address: string; phone?: string }) => {
    haptics.notification('success');
    setWalletConnected(true);
    setWalletAddress(data.address);
    notifyToast('✓ BEP-20 Wallet address connected!', 'success', 3000);
    await bindWallet(data.address);
  };

  const withdrawAmount = Math.max(0, parseFloat(customAmountStr) || 0);
  const fee = withdrawAmount * 0.05;
  const netAmount = Math.max(0, withdrawAmount - fee);

  const handleWithdraw = async () => {
    if (!walletConnected) {
      haptics.impact('medium');
      setShowConnectModal(true);
      return;
    }

    const minAmt = walletData.minWithdrawalUsd || 1.0;
    if (withdrawAmount < minAmt) {
      notifyToast(`Minimum withdrawal is $${minAmt.toFixed(2)} USDT`, 'error', 3000);
      return;
    }

    const maxAmt = walletData.availableBalanceUsd || 0;
    if (withdrawAmount > maxAmt) {
      notifyToast(`Amount exceeds available balance ($${maxAmt.toFixed(2)})`, 'error', 3000);
      return;
    }

    haptics.notification('success');
    haptics.playWinSound();
    throwConfetti();
    notifyToast(`🚀 Withdrawal request for $${withdrawAmount.toFixed(2)} USDT submitted!`, 'success', 3500);
    await submitWithdrawal(withdrawAmount);
  };

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
          {/* Energy Balance */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.42)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: '#ffffff',
              padding: '0.18rem 0.55rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              boxShadow: '0 3px 8px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
              height: '28px',
              boxSizing: 'border-box'
            }}
          >
            <img src="./assets/energy_48-Bei1wi9i.png" alt="Energy" style={{ width: '17px', height: '17px', objectFit: 'contain', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
            <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>50</span>
          </div>

          {/* Spin Balance */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.42)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: '#ffffff',
              padding: '0.18rem 0.55rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              boxShadow: '0 3px 8px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
              height: '28px',
              boxSizing: 'border-box'
            }}
          >
            <img src="./assets/ticket_animated.gif" alt="Spins" style={{ width: '26px', height: '26px', objectFit: 'contain', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} />
            <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>12</span>
          </div>

          {/* Diamond Balance */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.42)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: '#ffffff',
              padding: '0.18rem 0.55rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              boxShadow: '0 3px 8px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
              height: '28px',
              boxSizing: 'border-box'
            }}
          >
            <img src="./assets/diamond_animated.gif" alt="Diamond" style={{ width: '23px', height: '23px', objectFit: 'contain', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} />
            <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>760</span>
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
          {isLoading ? (
            <div
              className="skeleton-glow-box"
              style={{
                height: '62px',
                borderRadius: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 0.95rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ width: '100px', height: '12px', borderRadius: '4px', background: 'rgba(255,255,255,0.15)' }} />
                  <div style={{ width: '70px', height: '9px', borderRadius: '4px', background: 'rgba(52,211,153,0.2)' }} />
                </div>
              </div>
              <div style={{ width: '60px', height: '22px', borderRadius: '6px', background: 'rgba(254,240,138,0.25)' }} />
            </div>
          ) : (
            /* 1. Compact Available Balance Banner with Tether (USDT ₮) Icon */
            <div
              className="page-reveal-fade"
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
                  $ {walletData.availableBalanceUsd.toFixed(2)}
                </span>
              </div>
            </div>
          )}

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <h2
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: 0
                }}
              >
                Withdraw Amount (USDT)
              </h2>
              <span style={{ color: '#86efac', fontSize: '0.72rem', fontWeight: 600 }}>
                Min: ${walletData.minWithdrawalUsd?.toFixed(2) || '1.00'}
              </span>
            </div>

            {/* Quick Preset Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem', marginBottom: '0.5rem' }}>
              {[1.0, 2.5, 5.0, 10.0].map((amt) => {
                const isSelected = Math.abs(withdrawAmount - amt) < 0.001;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      haptics.selection();
                      setCustomAmountStr(amt.toFixed(2));
                    }}
                    style={{
                      background:
                        isSelected
                          ? 'linear-gradient(180deg, #00e676 0%, #00a854 100%)'
                          : 'rgba(0, 0, 0, 0.3)',
                      border:
                        isSelected
                          ? '1px solid #86efac'
                          : '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '0.65rem',
                      padding: '0.45rem 0',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 2px 8px rgba(0, 230, 118, 0.35)' : 'none',
                      transition: 'all 0.1s ease'
                    }}
                  >
                    ${amt.toFixed(2)}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input Bar with MAX Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(52, 211, 153, 0.45)',
                borderRadius: '0.75rem',
                padding: '0.4rem 0.65rem 0.4rem 0.75rem',
                gap: '0.4rem',
                marginBottom: '0.45rem',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              <span style={{ color: '#fbbf24', fontWeight: 900, fontSize: '1.05rem' }}>$</span>
              <input
                type="number"
                step="any"
                min="1"
                value={customAmountStr}
                onChange={(e) => setCustomAmountStr(e.target.value)}
                placeholder="Enter custom amount..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  fontFamily: 'monospace'
                }}
              />
              <button
                type="button"
                onClick={() => {
                  haptics.selection();
                  const maxVal = walletData.availableBalanceUsd || 0;
                  setCustomAmountStr(maxVal.toFixed(2));
                }}
                style={{
                  background: 'linear-gradient(180deg, rgba(251, 191, 36, 0.3) 0%, rgba(217, 119, 6, 0.3) 100%)',
                  border: '1px solid #fbbf24',
                  color: '#fbbf24',
                  borderRadius: '6px',
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.74rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  letterSpacing: '0.5px'
                }}
              >
                MAX
              </button>
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

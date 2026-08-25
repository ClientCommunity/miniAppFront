import { useState, useEffect } from 'react';
import './App.css';
import { SpinWheel } from './components/SpinWheel';
import type { SpinSegment } from './components/SpinWheel';
import { RewardCard } from './components/RewardCard';
import { FeatureCard } from './components/FeatureCard';
import { TaskBanner } from './components/TaskBanner';
import { DailyRewardsModal } from './components/DailyRewardsModal';
import { GiftCodeModal } from './components/GiftCodeModal';
import { TeamModal } from './components/TeamModal';
import { ContestLeaderboardModal } from './components/ContestLeaderboardModal';
import { OutOfSpinsModal } from './components/OutOfSpinsModal';
import { RafflePage } from './components/raffle/RafflePage';
import { TasksPage } from './components/tasks/TasksPage';
import { WalletPage } from './components/wallet/WalletPage';
import { AppLaunchSplash } from './components/skeleton/AppLaunchSplash';
import { requestServerSpin } from './services/spinService';
import { throwConfetti } from './utils/confetti';
import { haptics } from './utils/haptics';
import {
  getInitialWheelSegments,
  getInitialMockTasksBanner,
  getInitialFeatureCards,
  getInitialUserProfile,
  authenticateTelegram
} from './services/dataService';
import type { UserProfile } from './types/api';
import { DebugToastContainer } from './components/debug/DebugToastContainer';
import { notifyToast } from './utils/debugToast';
import appConfig from './config.json';
import api from './api/client';

const WHEEL_SEGMENTS = getInitialWheelSegments();
const MOCK_TASKS = getInitialMockTasksBanner();
const FEATURE_CARDS = getInitialFeatureCards();
const LEFT_CARDS = FEATURE_CARDS.left as Array<{
  title: string;
  icon: string;
  variant: 'emerald' | 'colorful' | 'gold';
  badge?: string;
  badgeColor?: 'gold' | 'red' | 'emerald';
}>;
const RIGHT_CARDS = FEATURE_CARDS.right as Array<{
  title: string;
  icon: string;
  variant: 'emerald' | 'colorful' | 'gold';
  badge?: string;
  badgeColor?: 'gold' | 'red' | 'emerald';
}>;

function App() {
  const [currentPage, setCurrentPage] = useState<'main' | 'raffle' | 'tasks' | 'wallet'>('main');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showContestModal, setShowContestModal] = useState(false);
  const [showOutOfSpinsModal, setShowOutOfSpinsModal] = useState(false);
  const [rewardText, setRewardText] = useState('');
  const [lastServerSpin, setLastServerSpin] = useState<any>(null);
  const [winningReward, setWinningReward] = useState<{
    name: string;
    amount: string;
    image: string;
    value: string;
  } | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getInitialUserProfile());

  const navigateTo = (page: 'main' | 'raffle' | 'tasks' | 'wallet') => {
    haptics.impact('light');
    setCurrentPage(page);
  };

  // Responsive Wheel Sizing for Mobile Viewports
  const [wheelSize, setWheelSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const w = window.innerWidth;
      if (w < 360) return 220;
      if (w < 390) return 235;
      if (w < 430) return 245;
      if (w < 600) return 260;
      return 280;
    }
    return 240;
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 360) setWheelSize(220);
      else if (w < 390) setWheelSize(235);
      else if (w < 430) setWheelSize(245);
      else if (w < 600) setWheelSize(260);
      else setWheelSize(280);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Show Daily Rewards after 10 seconds
    const timer = setTimeout(() => {
      setShowDailyRewards(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Telegram Authentication & Deep-Link Referral Boot Sync
  useEffect(() => {
    // @ts-ignore
    const tg = window.Telegram?.WebApp;
    if (tg?.ready) {
      tg.ready();
      tg.expand?.();
    }

    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash);

    const initData = tg?.initData || '';
    const startParam =
      tg?.initDataUnsafe?.start_param ||
      searchParams.get('tgWebAppStartParam') ||
      searchParams.get('startapp') ||
      searchParams.get('start_param') ||
      hashParams.get('tgWebAppStartParam') ||
      '';

    if (startParam) {
      notifyToast(`🎟 Referral Detected: ${startParam}`, 'info', 3500);
    }

    if (appConfig.useMockData) {
      notifyToast('🟡 Mock Mode Active (Using data.json)', 'info', 4000);
    } else {
      notifyToast(`🔗 Connecting to ${api.getBaseUrl()}`, 'info', 3000);
    }

    authenticateTelegram(initData, startParam).then((res) => {
      if (res.user) {
        setUserProfile(res.user);
        if (!appConfig.useMockData) {
          notifyToast('🟢 Backend Connection Established!', 'success', 3500);
        }
      } else if (!appConfig.useMockData) {
        notifyToast(`🔴 Failed to authenticate on server: ${res.error || 'Check backend'}`, 'error', 5000);
      }
    });
  }, []);

    const handleSpinEnd = (winner: SpinSegment) => {
      // Prioritize live reward data returned by server API
      const serverReward = lastServerSpin?.reward;
      const rewardName = serverReward?.label || winner.label || 'Reward';
      const rewardImage = serverReward?.image || winner.image || './assets/diamond_animated.gif';
      
      let rewardAmount = serverReward?.amount;
      if (!rewardAmount) {
        if (winner.value === 'coins') rewardAmount = '+$0.20 USDT';
        else if (winner.value === 'jackpot') rewardAmount = '$10.00 Jackpot';
        else if (winner.value === 'tickets' || winner.value === 'spins') rewardAmount = '+1 Free Spin';
        else rewardAmount = '+80 💎';
      }

      setRewardText(rewardName);
      setWinningReward({
        name: rewardName,
        amount: rewardAmount,
        image: rewardImage,
        value: serverReward?.value || winner.value
      });

      setShowRewardModal(true);
      haptics.notification('success');
      haptics.playWinSound();

      if (winner.value !== '0' && winner.label !== 'Empty') {
        throwConfetti();
      }

      // Update user balances from server balance or optimistic calculation
      if (lastServerSpin?.userBalance) {
        const ub = lastServerSpin.userBalance;
        setUserProfile((prev) => ({
          ...prev,
          spins: ub.spins ?? prev.spins,
          diamonds: ub.diamonds ?? prev.diamonds,
          balance_usd: ub.balance_usd ?? prev.balance_usd,
          energy: ub.energy ?? prev.energy,
          goal_left: ub.goal_left ?? Math.max(0, (prev.goal_usd || 1.0) - (ub.balance_usd ?? prev.balance_usd))
        }));
      } else {
        setUserProfile((prev) => {
          const isCoin = winner.value === 'coins';
          const isGem = winner.value === 'gem';
          const isJackpot = winner.value === 'jackpot';
          const isTicket = winner.value === 'tickets' || winner.value === 'spins';
          const newBal = isCoin ? prev.balance_usd + 0.2 : isJackpot ? 1.0 : prev.balance_usd;
          return {
            ...prev,
            spins: Math.max(0, prev.spins - (isTicket ? 0 : 1)),
            diamonds: isGem ? prev.diamonds + 80 : prev.diamonds,
            balance_usd: newBal,
            goal_left: Math.max(0, (prev.goal_usd || 1.0) - newBal)
          };
        });
      }
    };

    const handleCollect = () => {
      haptics.impact('medium');
      setShowRewardModal(false);
    };

    const progressPercent = Math.min(
      100,
      Math.max(0, Math.round((userProfile.balance_usd / (userProfile.goal_usd || 1.0)) * 100))
    );

    return (
      <>
        {/* Floating Debug Toast Container */}
        <DebugToastContainer />

        {/* 1. INITIAL APP LAUNCH SPLASH (1.8s) */}
        {isInitialLoading && (
          <AppLaunchSplash onLoaded={() => setIsInitialLoading(false)} duration={1800} />
        )}

        <div className="layout-container" style={{ height: '100dvh', overflow: 'hidden', padding: '0.25rem 0.5rem 0.5rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0', justifyContent: 'center' }}>

      {/* Top Header / Asset Balances */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem',
        marginTop: '0.25rem',
        padding: '0 0.25rem'
      }}>
        {/* User Profile (Left) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={userProfile.photo_url}
              alt="Profile"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '2px solid #00e676',
                boxShadow: '0 0 10px rgba(0, 230, 118, 0.5)'
              }}
            />
            {/* Level badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                background: '#f59e0b',
                color: '#1e293b',
                fontSize: '9px',
                fontWeight: 900,
                padding: '1px 4px',
                borderRadius: '6px',
                border: '1px solid #ffffff'
              }}
            >
              LV{userProfile.level || 1}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '0.88rem', lineHeight: 1.1 }}>
              {userProfile.first_name || 'Player'}
            </span>
            <span style={{ color: '#a7f3d0', fontSize: '0.68rem', fontWeight: 600 }}>ID: {userProfile.id}</span>
          </div>
        </div>

        {/* Asset Balances (Right) */}
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
            <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>{userProfile.energy}</span>
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
            <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>{userProfile.spins}</span>
          </div>

          {/* Diamond Balance (+ Deposit Badge) */}
          <div
            onClick={() => navigateTo('tasks')}
            style={{
              position: 'relative',
              background: 'rgba(0, 0, 0, 0.42)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: '#ffffff',
              padding: '0.18rem 0.65rem 0.18rem 0.45rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              cursor: 'pointer',
              boxShadow: '0 3px 8px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
              height: '28px',
              boxSizing: 'border-box',
              transition: 'transform 0.1s ease'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img src="./assets/diamond_animated.gif" alt="Diamond" style={{ width: '23px', height: '23px', objectFit: 'contain', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} />
            <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>{userProfile.diamonds}</span>

            {/* Glowing plus badge */}
            <div
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                background: 'linear-gradient(180deg, #00e676 0%, #00a854 100%)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 6px rgba(0, 230, 118, 0.9), inset 0 1px 1px rgba(255,255,255,0.6)',
                border: '1px solid #ffffff'
              }}
            >
              +
            </div>
          </div>
        </div>
      </div>

      {/* Main Single-Screen Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flex: 1, paddingBottom: '0.25rem' }}>

        {/* Left Column (4 Cards Vertical) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.42rem', flexShrink: 0, justifyContent: 'center' }}>
          {LEFT_CARDS.map(card => (
            <FeatureCard
              key={card.title}
              {...card}
              onClick={
                card.title === 'Raffle'
                  ? () => navigateTo('raffle')
                  : card.title === 'Contest'
                    ? () => setShowContestModal(true)
                    : card.title === 'Gift'
                      ? () => setShowGiftModal(true)
                      : card.title === 'Team'
                        ? () => setShowTeamModal(true)
                        : undefined
              }
            />
          ))}
        </div>

        {/* Center Wheel & Progress Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: '1 1 auto', minWidth: 0, padding: '0 0.25rem', marginTop: '-32px' }}>
          {/* Balance Display with Sparkle Glow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <img
              src="./assets/icon-gold.png"
              alt="Coin"
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 6px rgba(250, 204, 21, 0.5))'
              }}
            />
            <span
              style={{
                color: '#FFE81A',
                fontWeight: 900,
                fontSize: '1.85rem',
                fontStyle: 'italic',
                fontFamily: 'Georgia, serif',
                textShadow: '0 2px 6px rgba(0,0,0,0.6), 0 0 10px rgba(254, 240, 138, 0.4)'
              }}
            >
              ${userProfile.balance_usd.toFixed(2)}
            </span>
          </div>

          {/* Upgraded Liquid Gold Milestone Progress Bar */}
          <div
            style={{
              width: '100%',
              maxWidth: '250px',
              height: '14px',
              background: 'rgba(0, 0, 0, 0.35)',
              borderRadius: '10px',
              position: 'relative',
              marginBottom: '0.4rem',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            {/* Shimmering Fill */}
            <div
              className="liquid-gold-shimmer"
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                borderRadius: '8px',
                position: 'relative',
                boxShadow: '0 0 8px rgba(250, 204, 21, 0.6)'
              }}
            >
              {/* Glowing Particle Tip */}
              <div
                style={{
                  position: 'absolute',
                  right: '-6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '14px',
                  height: '14px',
                  background: '#ffffff',
                  borderRadius: '50%',
                  boxShadow: '0 0 12px 4px rgba(254, 240, 138, 0.9), 0 0 4px #fbbf24',
                  zIndex: 2
                }}
              />
            </div>

            {/* $1 Goal Milestone Pin */}
            <div
              style={{
                position: 'absolute',
                right: '4px',
                top: '-18px',
                fontSize: '0.68rem',
                fontWeight: 900,
                color: '#fef08a',
                fontFamily: 'Georgia, serif',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              $1 Goal 🏁
            </div>
          </div>

          {/* Helper Text */}
          <div
            style={{
              color: '#d1fae5',
              fontSize: '0.82rem',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              opacity: 0.95,
              marginBottom: '1.1rem',
              textShadow: '0 1px 3px rgba(0,0,0,0.7)'
            }}
          >
            Only <span style={{ color: '#fbbf24', fontWeight: 800 }}>${Math.max(0, (userProfile.goal_usd || 1.0) - userProfile.balance_usd).toFixed(2)}</span> to cash out $1 instant USDT (BEP20)!
          </div>

          <SpinWheel
            segments={WHEEL_SEGMENTS}
            spins={userProfile.spins}
            diamonds={userProfile.diamonds}
            onOutOfSpins={() => setShowOutOfSpinsModal(true)}
            onSpinRequest={async () => {
              if (userProfile.spins <= 0 && userProfile.diamonds < 1000) {
                setShowOutOfSpinsModal(true);
                haptics.notification('warning');
                throw new Error('Insufficient spins and diamonds');
              }

              const method = userProfile.spins > 0 ? 'spins' : 'diamonds';
              if (method === 'diamonds') {
                notifyToast('💎 Used 1,000 Diamonds for 1 Spin!', 'info', 3000);
              }

              const serverResult = await requestServerSpin(WHEEL_SEGMENTS, method);
              setLastServerSpin(serverResult);
              return serverResult.targetIndex;
            }}
            onSpinEnd={handleSpinEnd}
            theme="emerald"
            size={wheelSize}
          />
        </div>

        {/* Right Column (3 Cards Vertical) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.78rem', justifyContent: 'center', flexShrink: 0 }}>
          {RIGHT_CARDS.map(card => (
            <FeatureCard
              key={card.title}
              {...card}
              onClick={
                card.title === '+ Spins'
                  ? () => navigateTo('tasks')
                  : card.title === 'Sign In'
                    ? () => setShowDailyRewards(true)
                    : card.title === 'Wallet'
                      ? () => navigateTo('wallet')
                      : undefined
              }
            />
          ))}
        </div>

      </div>

      {/* Task Banner Peek-a-boo Carousel */}
      <div
        className="hide-scrollbar"
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          gap: '0.75rem',
          padding: '0.25rem 0',
          width: '100%',
          flexShrink: 0,
          WebkitOverflowScrolling: 'touch',
        }}>
        {MOCK_TASKS.map((task: any, i: number) => (
          <TaskBanner key={i} {...task} onClick={() => navigateTo('tasks')} />
        ))}
      </div>

      {/* Unified Bottom Invite CTA Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingTop: '0.25rem',
        paddingBottom: '0.25rem',
        flexShrink: 0
      }}>
        <div
          onClick={() => {
            haptics.impact('light');
            setShowTeamModal(true);
          }}
          style={{
            width: '100%',
            maxWidth: '360px',
            height: '44px',
            background: 'linear-gradient(135deg, rgba(6, 125, 78, 0.72) 0%, rgba(1, 45, 28, 0.92) 100%)',
            border: '1px solid rgba(0, 230, 118, 0.55)',
            borderRadius: '1.25rem',
            padding: '0 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.65rem',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxSizing: 'border-box',
            transition: 'transform 0.1s ease'
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {/* Left: Ticket GIF */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <img
              src="./assets/ticket_animated.gif"
              alt="Spin Ticket"
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
              }}
            />
          </div>

          {/* Center: CTA Text */}
          <div style={{ fontWeight: 800, fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem', color: '#ffffff', textAlign: 'center', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Invite Friends &amp; Earn Free Spins
          </div>

          {/* Right: Sleek Forward Arrow Badge */}
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'linear-gradient(180deg, #00e676 0%, #00a854 100%)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0, 230, 118, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.6)',
              flexShrink: 0
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* Reward Modal */}
      {showRewardModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <RewardCard
            rewardName={winningReward?.name || 'Congratulations!'}
            rewardAmount={winningReward?.amount || rewardText || '+80 💎'}
            rewardImage={winningReward?.image || './assets/diamond_animated.gif'}
            onCollect={handleCollect}
          />
        </div>
      )}

      {/* Daily Rewards Modal (10s Pop-up) */}
      {showDailyRewards && (
        <DailyRewardsModal
          onClose={() => setShowDailyRewards(false)}
          onClaimSuccess={(gems) => {
            setUserProfile((prev) => ({
              ...prev,
              diamonds: prev.diamonds + (gems || 80)
            }));
          }}
        />
      )}

      {/* Gift Code Modal */}
      {showGiftModal && (
        <GiftCodeModal onClose={() => setShowGiftModal(false)} />
      )}

      {/* Team Modal */}
      {showTeamModal && (
        <TeamModal onClose={() => setShowTeamModal(false)} />
      )}

      {/* Contest Leaderboard Modal */}
      {showContestModal && (
        <ContestLeaderboardModal onClose={() => setShowContestModal(false)} />
      )}

      {/* Out of Spins Modal */}
      {showOutOfSpinsModal && (
        <OutOfSpinsModal
          diamonds={userProfile.diamonds}
          onClose={() => setShowOutOfSpinsModal(false)}
          onInvite={() => {
            setShowOutOfSpinsModal(false);
            setShowTeamModal(true);
          }}
          onTasks={() => {
            setShowOutOfSpinsModal(false);
            navigateTo('tasks');
          }}
        />
      )}

      {/* Raffle Page Overlay */}
      {currentPage === 'raffle' && (
        <RafflePage onBack={() => navigateTo('main')} />
      )}

      {/* Tasks Page Overlay */}
      {currentPage === 'tasks' && (
        <TasksPage onBack={() => navigateTo('main')} />
      )}

      {/* Wallet Page Overlay */}
      {currentPage === 'wallet' && (
        <WalletPage onBack={() => navigateTo('main')} />
      )}
    </div>
  </>
  );
}

export default App;

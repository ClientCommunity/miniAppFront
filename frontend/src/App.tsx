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
import { RafflePage } from './components/raffle/RafflePage';
import { TasksPage } from './components/tasks/TasksPage';
import { WalletPage } from './components/wallet/WalletPage';
import { requestServerSpin } from './services/spinService';
import { throwConfetti } from './utils/confetti';
import { haptics } from './utils/haptics';

const WHEEL_SEGMENTS: SpinSegment[] = [
  { label: 'Diamond', value: 'gem', image: './assets/diamond_animated.gif' },
  { label: 'Coins', value: 'coins', image: './assets/SingleCoin_animated.gif' },
  { label: 'Diamond', value: 'gem', image: './assets/diamond_animated.gif' },
  { label: 'Jackpot', value: 'jackpot', image: './assets/coinSack_animated.gif' },
  { label: 'Tickets', value: 'tickets', image: './assets/ticket_animated.gif' },
  { label: 'Diamond', value: 'gem', image: './assets/diamond_animated.gif' }
];

const MOCK_TASKS = [
  { title: 'Active Tasks Available!', subtitle: 'Earn more coins now', icon: '🎯', rewardAmount: 60 },
  { title: 'Join Telegram Channel', subtitle: 'Stay updated', icon: '📣', rewardAmount: 500 },
  { title: 'Daily Check-in', subtitle: 'Come back tomorrow', icon: '📅', rewardAmount: 100 }
];

const LEFT_CARDS = [
  { title: 'Raffle', icon: './assets/raffleFeatureCardIcon.png', variant: 'emerald' as const, badge: 'HOT', badgeColor: 'gold' as const },
  { title: 'Contest', icon: './assets/contestTrophy_animated.gif', variant: 'colorful' as const },
  { title: 'Gift', icon: './assets/GiftBox_animated.gif', variant: 'gold' as const, badge: 'FREE', badgeColor: 'red' as const },
  { title: 'Team', icon: './assets/inviteFeatureCardIcon.png', variant: 'emerald' as const }
];

const RIGHT_CARDS = [
  { title: '+ Spins', icon: './assets/SpinWheel_animated.gif', variant: 'colorful' as const, badge: 'NEW', badgeColor: 'emerald' as const },
  { title: 'Sign In', icon: './assets/signin-iconFetareCardIcon.png', variant: 'emerald' as const, badge: '1', badgeColor: 'red' as const },
  { title: 'Wallet', icon: './assets/SingleCoin_animated.gif', variant: 'gold' as const }
];

function App() {
  const [currentPage, setCurrentPage] = useState<'main' | 'raffle' | 'tasks' | 'wallet'>('main');
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showContestModal, setShowContestModal] = useState(false);
  const [rewardText, setRewardText] = useState('');
  const [tgUser, setTgUser] = useState<any>(null);

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

  useEffect(() => {
    // @ts-ignore
    const tg = window.Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user) {
      setTgUser(tg.initDataUnsafe.user);
    }
  }, []);

  const userToDisplay = tgUser || {
    first_name: 'Player',
    id: '123456789',
    photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player_one'
  };

  const handleSpinEnd = (winner: SpinSegment) => {
    setRewardText(winner.label);
    setShowRewardModal(true);
    haptics.notification('success');
    haptics.playWinSound();

    if (winner.value !== '0' && winner.label !== 'Empty') {
      throwConfetti();
    }
  };

  const handleCollect = () => {
    haptics.impact('medium');
    setShowRewardModal(false);
  };

  return (
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
              src={userToDisplay.photo_url}
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
              LV1
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '0.88rem', lineHeight: 1.1 }}>
              {userToDisplay.first_name}
            </span>
            <span style={{ color: '#a7f3d0', fontSize: '0.68rem', fontWeight: 600 }}>ID: {userToDisplay.id}</span>
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

          {/* Diamond Balance (+ Deposit Badge) */}
          <div 
            onClick={() => setCurrentPage('tasks')}
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
            <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>124</span>

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
                  ? () => setCurrentPage('raffle')
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: '1 1 auto', minWidth: 0, padding: '0 0.25rem', marginTop: '-20px' }}>
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
              $0.56
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
                width: '56%',
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
              marginBottom: '1.4rem',
              textShadow: '0 1px 3px rgba(0,0,0,0.7)'
            }}
          >
            Only <span style={{ color: '#fbbf24', fontWeight: 800 }}>$0.44</span> to cash out $1 instant USDT (BEP20)!
          </div>

          <SpinWheel
            segments={WHEEL_SEGMENTS}
            onSpinRequest={async () => {
              const serverResult = await requestServerSpin(WHEEL_SEGMENTS);
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
                  ? () => setCurrentPage('tasks')
                  : card.title === 'Sign In'
                  ? () => setShowDailyRewards(true)
                  : card.title === 'Wallet'
                  ? () => setCurrentPage('wallet')
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
        {MOCK_TASKS.map((task, i) => (
          <TaskBanner key={i} {...task} onClick={() => setCurrentPage('tasks')} />
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
            rewardText={rewardText}
            onCollect={handleCollect}
          />
        </div>
      )}

      {/* Daily Rewards Modal (10s Pop-up) */}
      {showDailyRewards && (
        <DailyRewardsModal onClose={() => setShowDailyRewards(false)} />
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

      {/* Raffle Page Overlay */}
      {currentPage === 'raffle' && (
        <RafflePage onBack={() => setCurrentPage('main')} />
      )}

      {/* Tasks Page Overlay */}
      {currentPage === 'tasks' && (
        <TasksPage onBack={() => setCurrentPage('main')} />
      )}

      {/* Wallet Page Overlay */}
      {currentPage === 'wallet' && (
        <WalletPage onBack={() => setCurrentPage('main')} />
      )}
    </div>
  );
}

export default App;

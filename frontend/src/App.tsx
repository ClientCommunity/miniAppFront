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
  { label: 'Diamond', value: 'gem', image: './assets/purple-diamond.png' },
  { label: 'Coins', value: 'coins', image: './assets/coin_3d.png' },
  { label: 'Diamond', value: 'gem', image: './assets/purple-diamond.png' },
  { label: 'Jackpot', value: 'jackpot', image: './assets/money_bag_3d.png' },
  { label: 'Tickets', value: 'tickets', image: './assets/admission_tickets_3d.png' },
  { label: 'Diamond', value: 'gem', image: './assets/purple-diamond.png' }
];

const MOCK_TASKS = [
  { title: 'Active Tasks Available!', subtitle: 'Earn more coins now', icon: '🎯', rewardAmount: 60 },
  { title: 'Join Telegram Channel', subtitle: 'Stay updated', icon: '📣', rewardAmount: 500 },
  { title: 'Daily Check-in', subtitle: 'Come back tomorrow', icon: '📅', rewardAmount: 100 }
];

const LEFT_CARDS = [
  { title: 'Raffle', icon: './assets/raffleFeatureCardIcon.png', variant: 'emerald' as const, badge: 'HOT', badgeColor: 'gold' as const },
  { title: 'Contest', icon: './assets/contestFeatureCardIcon.png', variant: 'colorful' as const },
  { title: 'Gift', icon: './assets/giftcodeFeatureCardIcon.png', variant: 'gold' as const, badge: 'FREE', badgeColor: 'red' as const },
  { title: 'Team', icon: './assets/inviteFeatureCardIcon.png', variant: 'emerald' as const }
];

const RIGHT_CARDS = [
  { title: '+ Spins', icon: './assets/wheel-of-fortune.png', variant: 'colorful' as const, badge: 'NEW', badgeColor: 'emerald' as const },
  { title: 'Sign In', icon: './assets/signin-iconFetareCardIcon.png', variant: 'emerald' as const, badge: '1', badgeColor: 'red' as const },
  { title: 'Wallet', icon: './assets/icon-gold.png', variant: 'gold' as const }
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
                border: '2px solid #34d399',
                boxShadow: '0 0 8px rgba(52, 211, 153, 0.4)'
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          {/* Energy Balance */}
          <div
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              padding: '0.22rem 0.55rem',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}
          >
            <img src="./assets/energy_48-Bei1wi9i.png" alt="Energy" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>50</span>
          </div>

          {/* Spin Balance */}
          <div
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              padding: '0.22rem 0.55rem',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}
          >
            <img src="./assets/wheel-of-fortune.png" alt="Spins" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>12</span>
          </div>

          {/* Diamond Balance */}
          <div 
            onClick={() => setCurrentPage('tasks')}
            style={{ 
              position: 'relative',
              background: 'rgba(255,255,255,0.1)', 
              backdropFilter: 'blur(8px)', 
              border: '1px solid rgba(255,255,255,0.15)', 
              color: 'white', 
              padding: '0.2rem 0.65rem 0.2rem 0.5rem', 
              borderRadius: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.25rem',
              cursor: 'pointer',
              transition: 'transform 0.1s ease'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img src="./assets/purple-diamond.png" alt="Diamond" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>124</span>

            {/* Green plus badge */}
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

      {/* Main Single-Screen Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flex: 1, paddingBottom: '0.25rem' }}>

        {/* Left Column (4 Cards Vertical) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
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
            Only <span style={{ color: '#fbbf24', fontWeight: 800 }}>$0.44</span> to cash out $1 instant TON USDT!
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center', flexShrink: 0 }}>
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

      {/* Invite Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        width: '100%',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        flexShrink: 0
      }}>
        <div
          className="card"
          style={{
            width: '65%',
            background: 'linear-gradient(145deg, var(--task-card-bg-start) 0%, var(--task-card-bg-end) 100%)',
            border: '1px solid var(--task-card-border)',
            borderRadius: 'var(--border-radius-md)',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 4px 6px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src="./assets/spin-ticket.png" 
              alt="Spin Ticket" 
              style={{ 
                width: '28px', 
                height: '28px', 
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' 
              }} 
            />
          </div>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-family-display)', fontSize: '0.95rem', color: 'white' }}>
            Invite to earn spins
          </div>
        </div>

        <button
          style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(145deg, var(--task-card-bg-start) 0%, var(--task-card-bg-end) 100%)',
            border: '1px solid var(--task-card-border)',
            borderRadius: 'var(--border-radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 4px 6px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            flexShrink: 0,
            padding: 0
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
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

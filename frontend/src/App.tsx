import { useState, useEffect } from 'react';
import './App.css';
import { SpinWheel } from './components/SpinWheel';
import type { SpinSegment } from './components/SpinWheel';
import { RewardCard } from './components/RewardCard';
import { FeatureCard } from './components/FeatureCard';
import { TaskBanner } from './components/TaskBanner';
import { DailyRewardsModal } from './components/DailyRewardsModal';
import { throwConfetti } from './utils/confetti';

const WHEEL_SEGMENTS: SpinSegment[] = [
  { label: 'Gem', value: 'gem', image: './assets/gem_stone_3d.png' },
  { label: 'Coins', value: 'coins', image: './assets/coin_3d.png' },
  { label: 'Empty', value: '0' },
  { label: 'Jackpot', value: 'jackpot', image: './assets/money_bag_3d.png' },
  { label: 'Tickets', value: 'tickets', image: './assets/admission_tickets_3d.png' },
  { label: 'Empty', value: '0' }
];

const MOCK_TASKS = [
  { title: 'Active Tasks Available!', subtitle: 'Earn more coins now', icon: '🎯', rewardAmount: 60 },
  { title: 'Join Telegram Channel', subtitle: 'Stay updated', icon: '📣', rewardAmount: 500 },
  { title: 'Daily Check-in', subtitle: 'Come back tomorrow', icon: '📅', rewardAmount: 100 }
];

const LEFT_CARDS = [
  { title: 'Raffle', icon: './assets/raffleFeatureCardIcon.png', variant: 'emerald' as const },
  { title: 'Contest', icon: './assets/contestFeatureCardIcon.png', variant: 'colorful' as const },
  { title: 'Gift', icon: './assets/giftcodeFeatureCardIcon.png', variant: 'gold' as const },
  { title: 'Team', icon: './assets/inviteFeatureCardIcon.png', variant: 'emerald' as const }
];

const RIGHT_CARDS = [
  { title: '+ Spins', icon: './assets/wheel-of-fortune.png', variant: 'colorful' as const },
  { title: 'Sign In', icon: './assets/signin-iconFetareCardIcon.png', variant: 'emerald' as const },
  { title: 'Wallet', icon: './assets/icon-gold.png', variant: 'gold' as const }
];

function App() {
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  const [rewardText, setRewardText] = useState('');
  const [tgUser, setTgUser] = useState<any>(null);

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

    if (winner.value !== '0' && winner.label !== 'Empty') {
      throwConfetti();
    }
  };

  const handleCollect = () => {
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
          <img
            src={userToDisplay.photo_url}
            alt="Profile"
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '0.85rem', lineHeight: 1.1 }}>{userToDisplay.first_name}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>ID: {userToDisplay.id}</span>
          </div>
        </div>

        {/* Asset Balances (Right) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Energy Balance */}
          <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <img src="./assets/energy_48-Bei1wi9i.png" alt="Energy" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>50</span>
          </div>

          {/* Spin Balance */}
          <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <img src="./assets/wheel-of-fortune.png" alt="Spins" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>12</span>
          </div>

          {/* Diamond Balance */}
          <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <img src="./assets/purple-diamond.png" alt="Diamond" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>124</span>
          </div>
        </div>
      </div>

      {/* Main Single-Screen Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flex: 1, paddingBottom: '0.25rem' }}>

        {/* Left Column (4 Cards Vertical) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
          {LEFT_CARDS.map(card => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>

        {/* Center Wheel */}
        <div style={{ display: 'flex', justifyContent: 'center', flex: '1 1 auto', minWidth: 0, padding: '0 0.25rem' }}>
          <SpinWheel
            segments={WHEEL_SEGMENTS}
            onSpinEnd={handleSpinEnd}
            theme="emerald"
            size={300}
          />
        </div>

        {/* Right Column (3 Cards Vertical) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center', flexShrink: 0 }}>
          {RIGHT_CARDS.map(card => (
            <FeatureCard
              key={card.title}
              {...card}
              onClick={card.title === 'Sign In' ? () => setShowDailyRewards(true) : undefined}
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
          <TaskBanner key={i} {...task} />
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
          <div style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }}>
            ✉️
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
    </div>
  );
}

export default App;

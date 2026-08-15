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
import { RafflePage } from './components/raffle/RafflePage';
import { TasksPage } from './components/tasks/TasksPage';
import { WalletPage } from './components/wallet/WalletPage';
import { throwConfetti } from './utils/confetti';

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
  const [currentPage, setCurrentPage] = useState<'main' | 'raffle' | 'tasks' | 'wallet'>('main');
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
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
          
          {/* Balance Display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <img src="./assets/icon-gold.png" alt="Coin" style={{ width: '30px', height: '30px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
            <span style={{ 
              color: '#FFE81A', 
              fontWeight: 900, 
              fontSize: '1.75rem', 
              fontStyle: 'italic',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}>$0.56</span>
          </div>

          {/* Progress Bar */}
          <div style={{ 
            width: '100%', 
            maxWidth: '240px', 
            height: '13px', 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: '10px',
            position: 'relative',
            marginBottom: '0.5rem',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)'
          }}>
            {/* Fill */}
            <div style={{
              width: '56%',
              height: '100%',
              background: 'linear-gradient(90deg, #F5A623 0%, #F8E71C 100%)',
              borderRadius: '10px',
              position: 'relative',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              {/* Glowing Particle Tip */}
              <div style={{
                position: 'absolute',
                right: '-7px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '13px',
                height: '13px',
                background: 'rgba(255, 230, 0, 0.8)',
                borderRadius: '50%',
                boxShadow: '0 0 15px 5px rgba(248, 231, 28, 0.8)',
                filter: 'blur(1.5px)'
              }} />
            </div>
          </div>

          {/* Helper Text */}
          <div style={{ 
            color: 'white', 
            fontSize: '0.85rem', 
            fontFamily: 'Georgia, serif', 
            fontStyle: 'italic', 
            opacity: 0.95,
            marginBottom: '1.75rem',
            textShadow: '0 1px 3px rgba(0,0,0,0.6)'
          }}>
            Only $0.44 to cash out $1 !
          </div>

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

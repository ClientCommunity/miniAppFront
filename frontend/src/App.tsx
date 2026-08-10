import { useState } from 'react';
import './App.css';
import { SpinWheel } from './components/SpinWheel';
import type { SpinSegment } from './components/SpinWheel';
import { RewardCard } from './components/RewardCard';
import { FeatureCard } from './components/FeatureCard';
import { throwConfetti } from './utils/confetti';

const WHEEL_SEGMENTS: SpinSegment[] = [
  { label: 'Gem', value: 'gem', image: './assets/gem_stone_3d.png' },
  { label: 'Coins', value: 'coins', image: './assets/coin_3d.png' },
  { label: 'Empty', value: '0' },
  { label: 'Jackpot', value: 'jackpot', image: './assets/money_bag_3d.png' },
  { label: 'Tickets', value: 'tickets', image: './assets/admission_tickets_3d.png' },
  { label: 'Empty', value: '0' }
];

const LEFT_CARDS = [
  { title: 'Raffle', icon: '🎫', variant: 'emerald' as const, badgeText: 'Live' },
  { title: 'Contest', icon: '🏆', variant: 'colorful' as const },
  { title: 'Gift', icon: '🎁', variant: 'gold' as const },
  { title: 'Team', icon: '🤝', variant: 'emerald' as const }
];

const RIGHT_CARDS = [
  { title: '+ Spins', icon: '🔄', variant: 'colorful' as const, badgeText: 'Hot' },
  { title: 'Sign In', icon: '✅', variant: 'emerald' as const },
  { title: 'Wallet', icon: '💰', variant: 'gold' as const }
];

function App() {
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardText, setRewardText] = useState('');

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
    <div className="layout-container">
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem', color: 'var(--emerald-400)' }}>Lucky Spin</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Test your luck and win coins!</p>
      </div>

      {/* Center Wheel (Always at top) */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '3rem' }}>
        <SpinWheel 
          segments={WHEEL_SEGMENTS}
          onSpinEnd={handleSpinEnd}
          theme="emerald"
        />
      </div>

      {/* 2-Column Mobile Friendly Card Layout */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '1rem', 
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        
        {/* Left Column (4 Cards Vertical) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {LEFT_CARDS.map(card => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>

        {/* Right Column (3 Cards Vertical) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {RIGHT_CARDS.map(card => (
            <FeatureCard key={card.title} {...card} />
          ))}
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
    </div>
  );
}

export default App;

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
  { title: 'Raffle', icon: '🎫', variant: 'emerald' as const },
  { title: 'Contest', icon: '🏆', variant: 'colorful' as const },
  { title: 'Gift', icon: '🎁', variant: 'gold' as const },
  { title: 'Team', icon: '🤝', variant: 'emerald' as const }
];

const RIGHT_CARDS = [
  { title: '+ Spins', icon: '🔄', variant: 'colorful' as const },
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
    <div className="layout-container" style={{ height: '100dvh', overflow: 'hidden', padding: '0.5rem 0.5rem 4rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0', justifyContent: 'center' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '1rem', marginTop: '0.5rem' }}>
        <h1 style={{ marginBottom: '0.2rem', color: 'var(--emerald-400)', fontSize: '1.8rem' }}>Lucky Spin</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Test your luck and win coins!</p>
      </div>

      {/* Main Single-Screen Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flex: 1, paddingBottom: '1rem' }}>
        
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

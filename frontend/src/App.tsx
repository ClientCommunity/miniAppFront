import { useState } from 'react';
import './App.css';
import { SpinWheel } from './components/SpinWheel';
import type { SpinSegment } from './components/SpinWheel';
import { RewardCard } from './components/RewardCard';
import { throwConfetti } from './utils/confetti';

const WHEEL_SEGMENTS: SpinSegment[] = [
  { label: '100 Coins', value: '100' },
  { label: '500 Coins', value: '500' },
  { label: 'Empty', value: '0' },
  { label: '1000 Coins', value: '1000' },
  { label: '200 Coins', value: '200' },
  { label: 'Empty', value: '0' }
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
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem', color: 'var(--emerald-400)' }}>Daily Spin</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Test your luck and win coins!</p>
        
        <SpinWheel 
          segments={WHEEL_SEGMENTS}
          onSpinEnd={handleSpinEnd}
          theme="emerald"
        />
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

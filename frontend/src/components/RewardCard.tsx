import { useState, type FC } from 'react';

interface RewardCardProps {
  rewardText?: string;
  onCollect?: () => void;
}

export const RewardCard: FC<RewardCardProps> = ({ rewardText = '1000 Coins', onCollect }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div 
      className="reward-card"
      style={{
        position: 'relative',
        background: 'linear-gradient(160deg, rgba(6, 78, 59, 0.4) 0%, rgba(2, 44, 34, 0.7) 100%)',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        width: '100%',
        maxWidth: '360px',
        border: '1px solid rgba(52, 211, 153, 0.3)',
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 20px 40px rgba(0, 0, 0, 0.5)',
        color: 'white',
        textAlign: 'center',
        margin: '0 auto',
        overflow: 'hidden'
      }}
    >
      {/* Glowing orb behind icon */}
      <div style={{
        position: 'absolute', 
        top: 0, 
        left: '50%', 
        transform: 'translateX(-50%)', 
        width: '200px', 
        height: '200px', 
        background: 'radial-gradient(circle, rgba(52, 211, 153, 0.25) 0%, rgba(0,0,0,0) 70%)', 
        borderRadius: '50%', 
        pointerEvents: 'none'
      }}></div>
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '4.5rem', marginBottom: '0.5rem', filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.4))', transform: 'scale(1.1)' }}>
          🎉
        </div>
        <div style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', fontWeight: 700, color: 'var(--emerald-400)', marginBottom: '0.5rem' }}>
          Congratulations
        </div>
        <h2 style={{
          marginBottom: '1.5rem', 
          fontFamily: 'var(--font-family-display)', 
          fontSize: '2.2rem', 
          fontWeight: 800, 
          background: 'linear-gradient(to right, #fbbf24, #f59e0b)', 
          WebkitBackgroundClip: 'text', 
          color: 'transparent', 
          lineHeight: 1.1
        }}>
          {rewardText}
        </h2>
        
        <button 
          onClick={onCollect}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          style={{
            width: '100%',
            padding: '0.8rem 1.5rem',
            borderRadius: '12px',
            background: 'linear-gradient(to bottom, #fbbf24, #f59e0b)',
            color: '#451a03',
            border: 'none',
            boxShadow: isPressed ? '0 0px 0 #b45309, 0 2px 5px rgba(245, 158, 11, 0.3)' : '0 4px 0 #b45309, 0 8px 15px rgba(245, 158, 11, 0.3)',
            fontSize: '1.05rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transition: 'transform 0.1s, box-shadow 0.1s',
            transform: isPressed ? 'translateY(4px) scale(0.98)' : 'translateY(0) scale(1)'
          }}
        >
          Collect Reward
        </button>
      </div>
    </div>
  );
};

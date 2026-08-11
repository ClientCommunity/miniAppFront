import { useState } from 'react';
import type { FC } from 'react';

export interface TaskBannerProps {
  title: string;
  subtitle: string;
  icon: string;
  rewardAmount?: number;
  rewardIcon?: string;
  onClick?: () => void;
}

export const TaskBanner: FC<TaskBannerProps> = ({
  title,
  subtitle,
  icon,
  rewardAmount,
  rewardIcon = './assets/purple-diamond.png',
  onClick
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isBtnPressed, setIsBtnPressed] = useState(false);

  const renderReward = () => {
    if (!rewardAmount) return 'Go';
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
        {rewardIcon.endsWith('.png') ? (
          <img src={rewardIcon} alt="Reward" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
        ) : (
          rewardIcon
        )}
        <span>{rewardAmount}</span>
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className="card task-banner"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 1rem',
        background: 'linear-gradient(145deg, var(--task-card-bg-start) 0%, var(--task-card-bg-end) 100%)',
        borderRadius: 'var(--border-radius-md)',
        border: '1px solid var(--task-card-border)',
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 4px 6px rgba(0, 0, 0, 0.2)',
        color: 'white',
        cursor: 'pointer',
        transform: isPressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'transform 0.1s ease',
        minWidth: '85%', // For the peek-a-boo effect
        scrollSnapAlign: 'center',
        flexShrink: 0,
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }}>
          {icon}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-family-display)', fontSize: '0.95rem', lineHeight: 1.1 }}>
            {title}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', marginTop: '0.1rem' }}>
            {subtitle}
          </div>
        </div>
      </div>
      
      <button 
        onMouseDown={(e) => { e.stopPropagation(); setIsBtnPressed(true); }}
        onMouseUp={(e) => { e.stopPropagation(); setIsBtnPressed(false); }}
        onMouseLeave={() => setIsBtnPressed(false)}
        onTouchStart={(e) => { e.stopPropagation(); setIsBtnPressed(true); }}
        onTouchEnd={(e) => { e.stopPropagation(); setIsBtnPressed(false); }}
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: '0.35rem 1rem', 
          borderRadius: 'var(--border-radius-sm)', 
          background: 'var(--task-banner-btn-bg)', 
          color: 'var(--task-banner-btn-text)', 
          border: '1px solid var(--task-banner-btn-border)', 
          boxShadow: isBtnPressed 
            ? '0 0px 0 rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0,0,0,0.15)' 
            : '0 4px 0 rgba(0, 0, 0, 0.25), 0 5px 5px rgba(0,0,0,0.15)', 
          fontSize: '0.85rem', 
          fontWeight: 900, 
          whiteSpace: 'nowrap',
          margin: 0,
          transition: 'transform 0.1s, box-shadow 0.1s',
          transform: isBtnPressed ? 'translateY(4px) scale(0.98)' : 'translateY(0) scale(1)',
          cursor: 'pointer'
        }}
      >
        {renderReward()}
      </button>
    </div>
  );
};

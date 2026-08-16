import { useState } from 'react';
import type { FC } from 'react';
import { haptics } from '../utils/haptics';

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

  const handleClick = () => {
    haptics.impact('light');
    haptics.playClickSound();
    if (onClick) onClick();
  };

  const renderReward = () => {
    if (!rewardAmount) return 'GO';
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
        {rewardIcon.endsWith('.png') ? (
          <img src={rewardIcon} alt="Reward" style={{ width: '15px', height: '15px', objectFit: 'contain' }} />
        ) : (
          rewardIcon
        )}
        <span>{rewardAmount}</span>
      </span>
    );
  };

  return (
    <div
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 1rem',
        background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.85) 0%, rgba(2, 44, 34, 0.95) 100%)',
        borderRadius: '1.25rem',
        border: '1px solid rgba(52, 211, 153, 0.45)',
        boxShadow: isPressed
          ? '0 2px 6px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.2)'
          : '0 8px 20px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
        color: '#ffffff',
        cursor: 'pointer',
        transform: isPressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s ease',
        minWidth: '85%',
        scrollSnapAlign: 'center',
        flexShrink: 0,
        boxSizing: 'border-box',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      {/* Left Icon & Text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ fontSize: '1.6rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>
          {icon}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontWeight: 800, fontFamily: 'Georgia, serif', fontSize: '0.98rem', lineHeight: 1.15, color: '#ffffff' }}>
            {title}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)', marginTop: '0.15rem' }}>
            {subtitle}
          </div>
        </div>
      </div>

      {/* 3D Action Button */}
      <button
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsBtnPressed(true);
        }}
        onMouseUp={(e) => {
          e.stopPropagation();
          setIsBtnPressed(false);
        }}
        onMouseLeave={() => setIsBtnPressed(false)}
        onTouchStart={(e) => {
          e.stopPropagation();
          setIsBtnPressed(true);
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          setIsBtnPressed(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        style={{
          padding: '0.45rem 1.15rem',
          borderRadius: '0.85rem',
          background: 'linear-gradient(180deg, #10b981 0%, #047857 100%)',
          color: '#ffffff',
          border: '1px solid rgba(167, 243, 208, 0.7)',
          boxShadow: isBtnPressed
            ? '0 1px 0 #022c22, inset 0 2px 4px rgba(0,0,0,0.4)'
            : '0 4px 0 #022c22, 0 6px 12px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.5)',
          fontSize: '0.88rem',
          fontWeight: 900,
          fontFamily: 'Georgia, serif',
          whiteSpace: 'nowrap',
          margin: 0,
          cursor: 'pointer',
          transform: isBtnPressed ? 'translateY(3px)' : 'translateY(0)',
          transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}
      >
        {renderReward()}
      </button>
    </div>
  );
};

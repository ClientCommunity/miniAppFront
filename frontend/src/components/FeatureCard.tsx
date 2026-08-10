import { useState } from 'react';
import type { FC } from 'react';

export interface FeatureCardProps {
  title: string;
  icon: string;
  variant?: 'emerald' | 'colorful' | 'gold';
  onClick?: () => void;
}

export const FeatureCard: FC<FeatureCardProps> = ({
  title,
  icon,
  variant = 'emerald',
  onClick
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`card card-${variant}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.2rem 0 0 0',
        position: 'relative',
        cursor: 'pointer',
        textAlign: 'center',
        width: 'clamp(48px, 15vw, 64px)',
        aspectRatio: '64 / 76',
        borderRadius: 'var(--border-radius-sm)',
        overflow: 'hidden',
        transform: isPressed ? 'scale(0.92)' : 'scale(1)',
        transition: 'transform 0.1s ease',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <div style={{ fontSize: '1.8rem', lineHeight: 1, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}>
          {icon}
        </div>
      </div>
      
      <div 
        className="card-title" 
        style={{
          width: '100%', 
          background: 'var(--feature-card-btn-bg)', 
          color: 'white', 
          margin: 0, 
          padding: '0.25rem 0', 
          fontSize: '0.65rem', 
          fontWeight: 800, 
          textTransform: 'uppercase', 
          letterSpacing: '0.02em', 
          borderRadius: '2px', 
          border: '1px solid var(--feature-card-btn-border)', 
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {title}
      </div>
    </div>
  );
};

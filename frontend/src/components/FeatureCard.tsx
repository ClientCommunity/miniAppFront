import { useState } from 'react';
import type { FC } from 'react';

export interface FeatureCardProps {
  title: string;
  icon: string;
  variant?: 'emerald' | 'colorful' | 'gold';
  badgeText?: string;
  onClick?: () => void;
}

export const FeatureCard: FC<FeatureCardProps> = ({
  title,
  icon,
  variant = 'emerald',
  badgeText,
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
        padding: '1rem 0 0 0',
        position: 'relative',
        cursor: 'pointer',
        textAlign: 'center',
        aspectRatio: '3 / 4',
        borderRadius: 'var(--border-radius-md)',
        overflow: 'hidden',
        transform: isPressed ? 'scale(0.95)' : 'scale(1)',
        transition: 'transform 0.1s ease',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      {badgeText && (
        <span 
          className={`badge badge-${variant === 'gold' ? 'gold' : 'emerald'}`}
          style={{
            position: 'absolute', 
            top: '0.4rem', 
            right: '0.4rem', 
            fontSize: '0.65rem', 
            padding: '0.15rem 0.4rem', 
            boxShadow: 'var(--shadow-sm)', 
            zIndex: 2
          }}
        >
          {badgeText}
        </span>
      )}
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <div style={{ fontSize: '3rem', lineHeight: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))', marginBottom: '0.5rem' }}>
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
          padding: '0.6rem 0', 
          fontSize: '0.85rem', 
          fontWeight: 700, 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em', 
          borderRadius: 'var(--border-radius-sm)', 
          border: '2px solid var(--feature-card-btn-border)', 
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {title}
      </div>
    </div>
  );
};

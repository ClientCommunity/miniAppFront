import type { FC } from 'react';
import type { ReadyToClaimItem } from './types';

export interface ReadyToClaimCardProps {
  item: ReadyToClaimItem;
}

export const ReadyToClaimCard: FC<ReadyToClaimCardProps> = ({ item }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 0.9rem',
        background: 'linear-gradient(90deg, #028a4c 0%, #00b05b 50%, #028a4c 100%)',
        borderRadius: '12px',
        border: '1px solid rgba(52, 211, 153, 0.6)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
        color: 'white',
        transition: 'transform 0.15s ease'
      }}
    >
      {/* Left Icon & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <img
          src={item.icon || './assets/inviteFeatureCardIcon.png'}
          alt="Invite"
          style={{
            width: '36px',
            height: '36px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
        />
        <span
          style={{
            fontWeight: 700,
            fontSize: '0.95rem',
            color: '#ffffff',
            fontFamily: 'Georgia, serif',
            letterSpacing: '0.2px'
          }}
        >
          {item.title}
        </span>
      </div>

      {/* Right Claim Pill Button */}
      <button
        onClick={item.onClaim}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: 'linear-gradient(180deg, #00d66c 0%, #009949 100%)',
          border: '1px solid rgba(167, 243, 208, 0.6)',
          borderRadius: '20px',
          padding: '0.35rem 1rem',
          color: '#ffffff',
          fontWeight: 900,
          fontStyle: 'italic',
          fontFamily: 'Georgia, serif',
          fontSize: '0.95rem',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
          cursor: 'pointer',
          transition: 'transform 0.1s ease',
          whiteSpace: 'nowrap'
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <img
          src="./assets/purple-diamond.png"
          alt="Diamond"
          style={{ width: '15px', height: '15px', objectFit: 'contain' }}
        />
        <span>{item.rewardGems}</span>
      </button>
    </div>
  );
};

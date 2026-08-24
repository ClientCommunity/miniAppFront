import { useState } from 'react';
import type { FC } from 'react';
import type { TaskItem } from './types';
import { haptics } from '../../utils/haptics';

export interface TaskCardProps {
  task: TaskItem;
  onClaim?: () => void;
}

export const TaskCard: FC<TaskCardProps> = ({ task, onClaim }) => {
  const [isBtnPressed, setIsBtnPressed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleAction = () => {
    haptics.impact('medium');
    haptics.playClickSound();

    if (task.onAction) {
      task.onAction();
    } else {
      setIsChecking(true);
      setTimeout(() => {
        setIsChecking(false);
        if (onClaim) onClaim();
      }, 1000);
    }
  };

  const getButtonText = () => {
    if (isChecking) return '...';
    if (task.status === 'completed') return 'Claim';
    return task.buttonText || (task.category === 'socials' ? 'Start' : 'Go');
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.55rem 0.85rem',
        background: 'linear-gradient(135deg, rgba(5, 105, 65, 0.55) 0%, rgba(2, 52, 34, 0.85) 100%)',
        borderRadius: '0.9rem',
        border: '1px solid rgba(0, 230, 118, 0.4)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
        color: 'white',
        gap: '0.75rem',
        fontFamily: 'Outfit, sans-serif',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'transform 0.12s ease, border-color 0.12s ease'
      }}
    >
      {/* Left Icon Thumbnail */}
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)'
        }}
      >
        {typeof task.icon === 'string' &&
        (task.icon.endsWith('.png') || task.icon.endsWith('.jpg') || task.icon.endsWith('.svg') || task.isIconImage) ? (
          <img
            src={task.icon}
            alt="Task Icon"
            style={{
              width: '24px',
              height: '24px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
          />
        ) : (
          <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{task.icon || '🎯'}</span>
        )}
      </div>

      {/* Middle: Title & Reward Info Stack */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        {/* Title */}
        <div
          style={{
            fontWeight: 700,
            fontSize: '0.86rem',
            color: '#ffffff',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {task.title}
        </div>

        {/* Bottom Row: Reward Badge & Optional Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Saturated Reward Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              color: '#fde047',
              fontSize: '0.74rem',
              fontWeight: 800
            }}
          >
            <img
              src="./assets/diamond_animated.gif"
              alt="Diamond"
              style={{ width: '22px', height: '22px', objectFit: 'contain' }}
            />
            <span>+{task.rewardGems || 100}</span>
          </div>

          {/* Progress Indicator */}
          {task.progress && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.7rem',
                color: '#a7f3d0',
                fontWeight: 600
              }}
            >
              <span>•</span>
              <span>{task.progress.current}/{task.progress.total}</span>
              <div
                style={{
                  width: '32px',
                  height: '4px',
                  background: 'rgba(0,0,0,0.4)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, (task.progress.current / task.progress.total) * 100)}%`,
                    height: '100%',
                    background: '#10b981',
                    borderRadius: '3px'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Sleek 3D Action Pill Button */}
      {!task.hideButton && (
        <button
          onClick={handleAction}
          onMouseDown={() => setIsBtnPressed(true)}
          onMouseUp={() => setIsBtnPressed(false)}
          onMouseLeave={() => setIsBtnPressed(false)}
          onTouchStart={() => setIsBtnPressed(true)}
          onTouchEnd={() => setIsBtnPressed(false)}
          disabled={isChecking}
          style={{
            background: isChecking
              ? 'rgba(255,255,255,0.2)'
              : task.status === 'completed'
              ? 'linear-gradient(180deg, #00e676 0%, #00a854 100%)'
              : 'linear-gradient(180deg, #facc15 0%, #eab308 60%, #ca8a04 100%)',
            color: task.status === 'completed' ? '#ffffff' : '#1e293b',
            border: task.status === 'completed'
              ? '1px solid rgba(167, 243, 208, 0.8)'
              : '1px solid rgba(254, 240, 138, 0.8)',
            borderRadius: '0.65rem',
            padding: '0.35rem 0.85rem',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: isChecking ? 'default' : 'pointer',
            boxShadow: isBtnPressed
              ? '0 1px 0 #854d0e, inset 0 1px 2px rgba(0,0,0,0.3)'
              : '0 2.5px 0 #854d0e, 0 3px 6px rgba(0,0,0,0.25)',
            transform: isBtnPressed ? 'translateY(2px)' : 'translateY(0)',
            transition: 'transform 0.08s ease, box-shadow 0.08s ease',
            flexShrink: 0,
            minWidth: '58px',
            textAlign: 'center'
          }}
        >
          {getButtonText()}
        </button>
      )}
    </div>
  );
};

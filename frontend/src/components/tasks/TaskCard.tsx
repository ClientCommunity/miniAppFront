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

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1rem',
        background: 'linear-gradient(135deg, rgba(3, 102, 57, 0.75) 0%, rgba(2, 44, 34, 0.9) 100%)',
        borderRadius: '1rem',
        border: '1px solid rgba(52, 211, 153, 0.45)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
        color: 'white',
        gap: '0.85rem',
        marginBottom: '0.65rem',
        fontFamily: 'Outfit, sans-serif'
      }}
    >
      {/* Left Icon & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
        {/* Icon Thumbnail */}
        {task.isPlaceholder ? (
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.15)',
              flexShrink: 0
            }}
          />
        ) : typeof task.icon === 'string' &&
          (task.icon.endsWith('.png') || task.icon.endsWith('.jpg') || task.icon.endsWith('.svg') || task.isIconImage) ? (
          <img
            src={task.icon}
            alt="Task Icon"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              objectFit: 'contain',
              flexShrink: 0,
              filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))'
            }}
          />
        ) : (
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              flexShrink: 0
            }}
          >
            {task.icon || '🎯'}
          </div>
        )}

        {/* Title / Progress */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {task.isPlaceholder ? (
            <div
              style={{
                height: '14px',
                width: '80%',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px'
              }}
            />
          ) : (
            <>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: '#ffffff',
                  fontFamily: 'Georgia, serif',
                  lineHeight: 1.25,
                  wordBreak: 'break-word'
                }}
              >
                {task.title}
              </div>

              {/* Multi-step progress bar if available */}
              {task.progress && (
                <div style={{ marginTop: '0.35rem', width: '90%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#a7f3d0', marginBottom: '0.15rem' }}>
                    <span>Progress</span>
                    <span>{task.progress.current} / {task.progress.total}</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(100, (task.progress.current / task.progress.total) * 100)}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Action & Reward Stack */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexShrink: 0
        }}
      >
        {/* Reward Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'rgba(0, 0, 0, 0.35)',
            padding: '0.35rem 0.65rem',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            fontWeight: 800,
            fontSize: '0.85rem',
            color: '#fef08a'
          }}
        >
          <img
            src="./assets/purple-diamond.png"
            alt="Diamond"
            style={{ width: '15px', height: '15px', objectFit: 'contain' }}
          />
          <span>+{task.rewardGems || 100}</span>
        </div>

        {/* Action Button */}
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
                : 'linear-gradient(180deg, #facc15 0%, #eab308 50%, #ca8a04 100%)',
              color: '#1e293b',
              border: '1px solid rgba(254, 240, 138, 0.7)',
              borderRadius: '0.75rem',
              padding: '0.45rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 900,
              fontFamily: 'Georgia, serif',
              cursor: isChecking ? 'default' : 'pointer',
              boxShadow: isBtnPressed
                ? '0 1px 0 #854d0e, inset 0 2px 3px rgba(0,0,0,0.3)'
                : '0 3px 0 #854d0e, 0 4px 8px rgba(0,0,0,0.3)',
              transform: isBtnPressed ? 'translateY(2px)' : 'translateY(0)',
              transition: 'transform 0.1s ease, box-shadow 0.1s ease',
              minWidth: '55px',
              textAlign: 'center'
            }}
          >
            {isChecking ? '...' : 'GO'}
          </button>
        )}
      </div>
    </div>
  );
};

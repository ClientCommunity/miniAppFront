import { useState } from 'react';
import type { FC } from 'react';
import type { TaskItem } from './types';
import { haptics } from '../../utils/haptics';
import { notifyToast } from '../../utils/debugToast';

export interface TaskCardProps {
  task: TaskItem;
  isVerifying?: boolean;
  onClaim?: () => void;
}

export const TaskCard: FC<TaskCardProps> = ({ task, isVerifying = false, onClaim }) => {
  const [isBtnPressed, setIsBtnPressed] = useState(false);
  const [hasOpenedLink, setHasOpenedLink] = useState(false);

  const targetUrl = task.actionUrl || task.action_url;
  const isSocialTask = task.category === 'socials' || !!targetUrl;

  const handleAction = () => {
    if (isVerifying || task.status === 'completed') return;

    haptics.impact('medium');
    haptics.playClickSound();

    if (task.onAction) {
      task.onAction();
      return;
    }

    // If it's a link/social task and user hasn't opened it yet
    if (isSocialTask && targetUrl && !hasOpenedLink) {
      setHasOpenedLink(true);
      const tg = (window as any)?.Telegram?.WebApp;
      if (targetUrl.startsWith('https://t.me/') && tg && typeof tg.openTelegramLink === 'function') {
        tg.openTelegramLink(targetUrl);
      } else if (tg && typeof tg.openLink === 'function') {
        tg.openLink(targetUrl);
      } else {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
      notifyToast('Task opened! Return and tap Check to verify.', 'info', 3000);
      return;
    }

    // Trigger verification and claim check
    if (onClaim) {
      onClaim();
    }
  };

  const getButtonText = () => {
    if (isVerifying) return 'Verifying...';
    if (task.status === 'completed') return 'Done ✓';
    if (isSocialTask && !hasOpenedLink) {
      return task.buttonText || (task.category === 'socials' ? 'Start' : 'Go');
    }
    return 'Check';
  };

  const isCompleted = task.status === 'completed';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.55rem 0.85rem',
        background: isCompleted
          ? 'linear-gradient(135deg, rgba(5, 75, 45, 0.4) 0%, rgba(2, 40, 25, 0.6) 100%)'
          : 'linear-gradient(135deg, rgba(5, 105, 65, 0.55) 0%, rgba(2, 52, 34, 0.85) 100%)',
        borderRadius: '0.9rem',
        border: isCompleted
          ? '1px solid rgba(0, 230, 118, 0.2)'
          : '1px solid rgba(0, 230, 118, 0.4)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
        color: 'white',
        gap: '0.75rem',
        fontFamily: 'Outfit, sans-serif',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        opacity: isCompleted ? 0.75 : 1,
        transition: 'transform 0.12s ease, border-color 0.12s ease, opacity 0.2s ease'
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
        (task.icon.endsWith('.png') || task.icon.endsWith('.jpg') || task.icon.endsWith('.svg') || task.icon.endsWith('.gif') || task.icon.endsWith('.webp') || task.icon.includes('/') || task.isIconImage) ? (
          <img
            src={task.icon}
            alt="Task Icon"
            style={{
              width: task.icon.endsWith('.gif') ? '28px' : '24px',
              height: task.icon.endsWith('.gif') ? '28px' : '24px',
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
          onMouseDown={() => !isVerifying && setIsBtnPressed(true)}
          onMouseUp={() => setIsBtnPressed(false)}
          onMouseLeave={() => setIsBtnPressed(false)}
          onTouchStart={() => !isVerifying && setIsBtnPressed(true)}
          onTouchEnd={() => setIsBtnPressed(false)}
          disabled={isVerifying || isCompleted}
          style={{
            background: isVerifying
              ? 'rgba(255, 255, 255, 0.18)'
              : isCompleted
              ? 'rgba(16, 185, 129, 0.3)'
              : hasOpenedLink
              ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(180deg, #facc15 0%, #eab308 60%, #ca8a04 100%)',
            color: isCompleted ? '#6ee7b7' : hasOpenedLink || isVerifying ? '#ffffff' : '#1e293b',
            border: isCompleted
              ? '1px solid rgba(52, 211, 153, 0.4)'
              : hasOpenedLink
              ? '1px solid rgba(167, 243, 208, 0.8)'
              : '1px solid rgba(254, 240, 138, 0.8)',
            borderRadius: '0.65rem',
            padding: '0.35rem 0.85rem',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: isVerifying || isCompleted ? 'default' : 'pointer',
            boxShadow: isBtnPressed
              ? '0 1px 0 #854d0e, inset 0 1px 2px rgba(0,0,0,0.3)'
              : hasOpenedLink
              ? '0 2px 0 #064e3b, 0 3px 6px rgba(0,0,0,0.25)'
              : '0 2.5px 0 #854d0e, 0 3px 6px rgba(0,0,0,0.25)',
            transform: isBtnPressed ? 'translateY(2px)' : 'translateY(0)',
            transition: 'transform 0.08s ease, box-shadow 0.08s ease, background 0.15s ease',
            flexShrink: 0,
            minWidth: '68px',
            textAlign: 'center'
          }}
        >
          {getButtonText()}
        </button>
      )}
    </div>
  );
};

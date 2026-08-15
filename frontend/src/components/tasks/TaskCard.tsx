import type { FC } from 'react';
import type { TaskItem } from './types';

export interface TaskCardProps {
  task: TaskItem;
}

export const TaskCard: FC<TaskCardProps> = ({ task }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 0.9rem',
        background: 'linear-gradient(135deg, rgba(3, 102, 57, 0.8) 0%, rgba(2, 68, 38, 0.9) 100%)',
        borderRadius: '12px',
        border: '1px solid rgba(52, 211, 153, 0.4)',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        color: 'white',
        gap: '0.85rem',
        transition: 'transform 0.15s ease'
      }}
    >
      {/* Left Icon & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
        {/* Icon Thumbnail */}
        {task.isPlaceholder ? (
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.2)',
              flexShrink: 0
            }}
          />
        ) : typeof task.icon === 'string' && (task.icon.endsWith('.png') || task.icon.endsWith('.jpg') || task.icon.endsWith('.svg') || task.isIconImage) ? (
          <img
            src={task.icon}
            alt="Task Icon"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              objectFit: 'contain',
              flexShrink: 0,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
          />
        ) : (
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(0, 0, 0, 0.25)',
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

        {/* Title / Description */}
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
            <div
              style={{
                fontWeight: 600,
                fontSize: '0.95rem',
                color: '#ffffff',
                fontFamily: 'Georgia, serif',
                lineHeight: 1.25,
                wordBreak: 'break-word'
              }}
            >
              {task.title}
            </div>
          )}
        </div>
      </div>

      {/* Right Action & Reward Stack */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.35rem',
          flexShrink: 0,
          minWidth: '78px'
        }}
      >
        {/* Action Button (GO / Check / Done) */}
        {!task.hideButton && (
          <button
            onClick={task.onAction}
            style={{
              width: '100%',
              background: 'linear-gradient(180deg, #facc15 0%, #eab308 50%, #ca8a04 100%)',
              border: '1px solid rgba(254, 240, 138, 0.7)',
              borderRadius: '8px',
              padding: '0.3rem 1.1rem',
              color: '#ffffff',
              fontStyle: 'italic',
              fontWeight: 900,
              fontSize: '0.95rem',
              fontFamily: 'Georgia, serif',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
              transition: 'transform 0.1s ease',
              textAlign: 'center'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            GO
          </button>
        )}

        {/* Diamond Reward Capsule */}
        {task.rewardGems !== undefined && (
          <div
            style={{
              width: task.hideButton ? 'auto' : '100%',
              minWidth: task.hideButton ? '84px' : 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(40, 55, 45, 0.6) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '14px',
              padding: task.hideButton ? '0.45rem 1.1rem' : '0.2rem 0.5rem',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: 800,
              fontStyle: 'italic',
              fontFamily: 'Georgia, serif'
            }}
          >
            <img
              src="./assets/purple-diamond.png"
              alt="Diamond"
              style={{ width: '13px', height: '13px', objectFit: 'contain' }}
            />
            <span>{task.rewardGems}</span>

            {/* Secondary Reward if present (e.g. VIP dual reward) */}
            {task.secondaryRewardGems !== undefined && (
              <>
                <img
                  src="./assets/purple-diamond.png"
                  alt="Diamond"
                  style={{ width: '13px', height: '13px', objectFit: 'contain', marginLeft: '0.2rem' }}
                />
                <span>{task.secondaryRewardGems}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

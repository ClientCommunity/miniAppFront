import { useState } from 'react';
import type { FC } from 'react';
import type { TaskItem, ReadyToClaimItem } from './types';
import { ReadyToClaimCard } from './ReadyToClaimCard';
import { TaskCard } from './TaskCard';

export interface TasksPageProps {
  onBack: () => void;
}

const DEFAULT_READY_CLAIM: ReadyToClaimItem = {
  id: 'ready-1',
  title: 'Extra for 1 invitation',
  icon: './assets/inviteFeatureCardIcon.png',
  rewardGems: 300
};

const DEFAULT_SPECIAL_TASKS: TaskItem[] = [
  {
    id: 'special-1',
    title: 'Reach lvl 3 FOR THE FIRST TIME!',
    icon: './assets/coin_3d.png', // Or custom mascot
    rewardGems: 1600,
    status: 'pending'
  },
  {
    id: 'special-2',
    title: 'Complete a purchase of any amount.',
    icon: './assets/coin_3d.png',
    rewardGems: 3000,
    status: 'pending'
  },
  {
    id: 'special-3',
    title: 'Join EarnCraft VIP Get More Rewards',
    icon: './assets/wheel-of-fortune.png',
    rewardGems: 3200,
    secondaryRewardGems: 1,
    status: 'pending'
  }
];

const DEFAULT_DAILY_TASKS: TaskItem[] = [
  {
    id: 'daily-1',
    isPlaceholder: true,
    rewardGems: 160,
    status: 'pending'
  },
  {
    id: 'daily-2',
    title: 'Complete 10 tasks today',
    icon: './assets/giftIconInDailySignIn.png',
    rewardGems: 800,
    hideButton: true,
    status: 'pending'
  }
];

export const TasksPage: FC<TasksPageProps> = ({ onBack }) => {
  const [readyItem, setReadyItem] = useState<ReadyToClaimItem | null>(DEFAULT_READY_CLAIM);
  const [specialTasks] = useState<TaskItem[]>(DEFAULT_SPECIAL_TASKS);
  const [dailyTasks] = useState<TaskItem[]>(DEFAULT_DAILY_TASKS);

  const handleClaimReady = () => {
    // Visual feedback for claiming
    alert('Claimed 300 💎 Diamonds!');
    setReadyItem(null);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #0c6340 0%, #032b1d 60%, #01170f 100%)',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        overflowY: 'auto',
        zIndex: 50,
        fontFamily: 'Outfit, sans-serif'
      }}
    >
      {/* Background Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '320px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '-10%',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Top Header & Stats Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 1rem 0.75rem 1rem',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '20px',
            padding: '0.35rem 0.85rem',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          &lt; Back
        </button>

        {/* Resource Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {/* Energy Badge */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'white',
              padding: '0.2rem 0.55rem',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 6px rgba(251, 191, 36, 0.6)'
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#1e293b' }}>⚡</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>0</span>
          </div>

          {/* Spin Ticket Badge */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'white',
              padding: '0.2rem 0.55rem',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <img
              src="./assets/spin-ticket.png"
              alt="Ticket"
              style={{ width: '18px', height: '18px', objectFit: 'contain' }}
            />
            <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>0</span>
          </div>

          {/* Purple Diamond Badge with green + */}
          <div
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'white',
              padding: '0.2rem 0.65rem 0.2rem 0.5rem',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <img
              src="./assets/purple-diamond.png"
              alt="Diamond"
              style={{ width: '18px', height: '18px', objectFit: 'contain' }}
            />
            <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>695</span>

            {/* Green plus button */}
            <div
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                background: '#22c55e',
                color: 'white',
                fontSize: '10px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 4px rgba(34, 197, 94, 0.8)'
              }}
            >
              +
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Content */}
      <div
        style={{
          flex: 1,
          padding: '0.5rem 1rem 2rem 1rem',
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}
      >
        {/* Section 1: Ready To Claim */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.6rem'
            }}
          >
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: 0,
                fontFamily: 'Georgia, serif'
              }}
            >
              Ready To Claim
            </h2>
            <span
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#ffffff',
                fontFamily: 'Georgia, serif'
              }}
            >
              {readyItem ? '1 / 1' : '0 / 1'}
            </span>
          </div>

          {readyItem ? (
            <ReadyToClaimCard
              item={{
                ...readyItem,
                onClaim: handleClaimReady
              }}
            />
          ) : (
            <div
              style={{
                padding: '1rem',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.9rem',
                fontFamily: 'Georgia, serif',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '12px'
              }}
            >
              No rewards ready to claim
            </div>
          )}
        </div>

        {/* Section 2: 🔥 Special Tasks */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.6rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🔥</span>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: 0,
                  fontFamily: 'Georgia, serif'
                }}
              >
                Special Tasks
              </h2>
            </div>

            {/* Refresh Button */}
            <button
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {specialTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* Section 3: 🎁 Daily Rewards */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.6rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🎁</span>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: 0,
                  fontFamily: 'Georgia, serif'
                }}
              >
                Daily Rewards
              </h2>
            </div>

            {/* Refresh Button */}
            <button
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {dailyTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

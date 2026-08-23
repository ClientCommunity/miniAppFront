import { useState } from 'react';
import type { FC } from 'react';
import type { TaskItem, ReadyToClaimItem } from './types';
import { ReadyToClaimCard } from './ReadyToClaimCard';
import { TaskCard } from './TaskCard';
import { haptics } from '../../utils/haptics';
import { throwConfetti } from '../../utils/confetti';

export interface TasksPageProps {
  onBack: () => void;
}

type TaskCategory = 'all' | 'special' | 'daily' | 'socials';

const DEFAULT_READY_CLAIM: ReadyToClaimItem = {
  id: 'ready-1',
  title: 'Extra for 1 invitation',
  icon: './assets/inviteFeatureCardIcon.png',
  rewardGems: 300
};

const ALL_TASKS: TaskItem[] = [
  {
    id: 'special-1',
    category: 'special',
    title: 'Reach lvl 3 FOR THE FIRST TIME!',
    icon: './assets/coin_3d.png',
    rewardGems: 1600,
    progress: { current: 1, total: 3 },
    status: 'pending'
  },
  {
    id: 'special-2',
    category: 'special',
    title: 'Invite 3 active spinners',
    icon: './assets/inviteFeatureCardIcon.png',
    rewardGems: 3000,
    progress: { current: 2, total: 3 },
    status: 'pending'
  },
  {
    id: 'special-3',
    category: 'special',
    title: 'Join EarnCraft VIP Get More Rewards',
    icon: './assets/wheel-of-fortune.png',
    rewardGems: 3200,
    secondaryRewardGems: 1,
    status: 'pending'
  },
  {
    id: 'daily-1',
    category: 'daily',
    title: 'Spin the Lucky Wheel 5 times',
    icon: './assets/wheel-of-fortune.png',
    rewardGems: 160,
    progress: { current: 3, total: 5 },
    status: 'pending'
  },
  {
    id: 'daily-2',
    category: 'daily',
    title: 'Complete 10 tasks today',
    icon: './assets/giftIconInDailySignIn.png',
    rewardGems: 800,
    progress: { current: 4, total: 10 },
    status: 'pending'
  },
  {
    id: 'social-1',
    category: 'socials',
    title: 'Subscribe to Telegram Channel',
    icon: '📣',
    rewardGems: 500,
    status: 'pending'
  },
  {
    id: 'social-2',
    category: 'socials',
    title: 'Follow EarnCraft on X (Twitter)',
    icon: '🐦',
    rewardGems: 400,
    status: 'pending'
  }
];

export const TasksPage: FC<TasksPageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState<TaskCategory>('all');
  const [readyItem, setReadyItem] = useState<ReadyToClaimItem | null>(DEFAULT_READY_CLAIM);
  const [tasks, setTasks] = useState<TaskItem[]>(ALL_TASKS);

  const handleClaimReady = () => {
    haptics.notification('success');
    haptics.playWinSound();
    throwConfetti();
    setReadyItem(null);
  };

  const handleTaskClaim = (taskId: string) => {
    haptics.notification('success');
    haptics.playWinSound();
    throwConfetti();
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const filteredTasks = tasks.filter(t => {
    if (activeCategory === 'all') return true;
    return t.category === activeCategory;
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% -10%, #057a44 0%, #024e2c 40%, #012a18 75%, #00170d 100%)',
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
          background: 'radial-gradient(circle, rgba(0, 230, 118, 0.28) 0%, rgba(5, 122, 68, 0.12) 50%, rgba(0,0,0,0) 75%)',
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
          padding: '1rem 1rem 0.65rem 1rem',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => {
            haptics.impact('light');
            onBack();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '16px',
            padding: '0.3rem 0.75rem',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          ‹ Back
        </button>

        {/* Resource Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {/* Energy */}
          <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.18rem 0.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <img src="./assets/energy_48-Bei1wi9i.png" alt="Energy" style={{ width: '15px', height: '15px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>50</span>
          </div>

          {/* Spins */}
          <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.18rem 0.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <img src="./assets/wheel-of-fortune.png" alt="Spins" style={{ width: '15px', height: '15px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>12</span>
          </div>

          {/* Diamonds */}
          <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.18rem 0.55rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <img src="./assets/purple-diamond.png" alt="Diamond" style={{ width: '15px', height: '15px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>760</span>
          </div>
        </div>
      </div>

      {/* Main Page Content */}
      <div
        style={{
          flex: 1,
          padding: '0.35rem 0.9rem 2rem 0.9rem',
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {/* Section 1: Ready To Claim */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.45rem'
            }}
          >
            <h2
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: 0
              }}
            >
              Ready To Claim
            </h2>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#34d399'
              }}
            >
              {readyItem ? '1 AVAILABLE 💎' : '0 AVAILABLE'}
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
                padding: '0.8rem',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.82rem',
                background: 'rgba(0,0,0,0.25)',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              All available rewards claimed! Complete tasks below for more.
            </div>
          )}
        </div>

        {/* Section 2: Category Filter Tabs */}
        <div>
          <div
            style={{
              display: 'flex',
              gap: '0.4rem',
              overflowX: 'auto',
              paddingBottom: '0.35rem'
            }}
          >
            {[
              { id: 'all', label: 'All Tasks' },
              { id: 'special', label: '🔥 Special' },
              { id: 'daily', label: '🎁 Daily' },
              { id: 'socials', label: '📣 Socials' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  haptics.selection();
                  setActiveCategory(tab.id as TaskCategory);
                }}
                style={{
                  background:
                    activeCategory === tab.id
                      ? 'linear-gradient(180deg, #00e676 0%, #00a854 100%)'
                      : 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  border:
                    activeCategory === tab.id
                      ? '1px solid #86efac'
                      : '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '16px',
                  padding: '0.35rem 0.8rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow:
                    activeCategory === tab.id
                      ? '0 2px 10px rgba(0, 230, 118, 0.45)'
                      : 'none',
                  transition: 'all 0.12s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Task List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.45rem' }}>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClaim={() => handleTaskClaim(task.id)} />
              ))
            ) : (
              <div
                style={{
                  padding: '1.25rem',
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.85rem',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '10px'
                }}
              >
                No tasks in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

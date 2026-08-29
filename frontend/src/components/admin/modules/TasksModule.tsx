import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/adminService';
import type { AdminTask, AdminTaskType, ConnectedTelegramChat } from '../../../types/admin';
import { notifyToast } from '../../../utils/debugToast';
import { haptics } from '../../../utils/haptics';

export const TasksModule: React.FC = () => {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [chats, setChats] = useState<ConnectedTelegramChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'chats'>('tasks');

  // Task Creation Modal Form States
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskType, setTaskType] = useState<AdminTaskType>('telegram_channel');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'social' | 'daily' | 'partner' | 'special'>('social');
  const [icon, setIcon] = useState('📢');
  const [rewardDiamonds, setRewardDiamonds] = useState('500');
  const [rewardSpins, setRewardSpins] = useState('2');
  const [targetCount, setTargetCount] = useState('5');
  const [actionUrl, setActionUrl] = useState('https://t.me/');
  const [selectedChatId, setSelectedChatId] = useState('');
  const [customChannelId, setCustomChannelId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Chat Link Modal
  const [showChatModal, setShowChatModal] = useState(false);
  const [newChatId, setNewChatId] = useState('');
  const [linkingChat, setLinkingChat] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tRes, cRes] = await Promise.all([
        adminService.getTasks(),
        adminService.getConnectedChats()
      ]);
      const rawTasks = tRes.data;
      let taskList: AdminTask[] = [];
      if (Array.isArray(rawTasks)) {
        taskList = rawTasks;
      } else if (rawTasks && typeof rawTasks === 'object') {
        const potential = (rawTasks as any).tasks || (rawTasks as any).items || (rawTasks as any).data || [];
        if (Array.isArray(potential)) taskList = potential;
      }
      setTasks(taskList);

      const rawChats = cRes.data;
      let chatList: ConnectedTelegramChat[] = [];
      if (Array.isArray(rawChats)) {
        chatList = rawChats;
      } else if (rawChats && typeof rawChats === 'object') {
        const potential = (rawChats as any).chats || (rawChats as any).connected_chats || (rawChats as any).data || [];
        if (Array.isArray(potential)) chatList = potential;
      }
      setChats(chatList);
    } catch (err: any) {
      console.warn('Failed to load tasks/chats:', err);
      notifyToast(`Failed to load: ${err.message}`, 'error', 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      notifyToast('Task title is required', 'info', 2500);
      return;
    }

    setSubmitting(true);
    try {
      const resolvedChannelId = selectedChatId === 'custom' ? customChannelId.trim() : (selectedChatId || customChannelId.trim());

      await adminService.createTask({
        title: title.trim(),
        task_type: taskType,
        category,
        icon: icon.trim() || '🎯',
        reward_diamonds: parseInt(rewardDiamonds, 10) || 0,
        reward_spins: parseInt(rewardSpins, 10) || 0,
        target_count: ['invite_count', 'spin_count', 'level_reach'].includes(taskType) ? (parseInt(targetCount, 10) || 1) : undefined,
        action_url: actionUrl.trim(),
        telegram_chat_id: resolvedChannelId || undefined,
        channel_id: resolvedChannelId || undefined,
        is_active: true
      });

      haptics.notification('success');
      notifyToast('📋 Quest Task created successfully!', 'success', 3500);
      setShowTaskModal(false);
      setTitle('');
      setActionUrl('https://t.me/');
      setSelectedChatId('');
      setCustomChannelId('');
      loadData();
    } catch (err: any) {
      haptics.notification('error');
      notifyToast(`Error: ${err.message}`, 'error', 3500);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      haptics.impact('medium');
      await adminService.deleteTask(id);
      notifyToast('Task removed', 'info', 2500);
      loadData();
    } catch (err: any) {
      notifyToast(`Error: ${err.message}`, 'error', 3000);
    }
  };

  const handleLinkChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatId.trim()) return;
    setLinkingChat(true);
    try {
      haptics.notification('success');
      await adminService.linkConnectedChat(newChatId.trim());
      notifyToast('📢 Channel linked to bot!', 'success', 3000);
      setShowChatModal(false);
      setNewChatId('');
      loadData();
    } catch (err: any) {
      notifyToast(`Error: ${err.message}`, 'error', 3000);
    } finally {
      setLinkingChat(false);
    }
  };

  const handleUnlinkChat = async (id: number) => {
    try {
      haptics.impact('medium');
      await adminService.unlinkConnectedChat(id);
      notifyToast('Channel unlinked', 'info', 2500);
      loadData();
    } catch (err: any) {
      notifyToast(`Error: ${err.message}`, 'error', 3000);
    }
  };

  const getTaskTypeBadge = (type?: AdminTaskType) => {
    switch (type) {
      case 'watch_ad':
      case 'ad_view':
        return { label: '🎬 AdsGram Rewarded Ad', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)' };
      case 'telegram_channel':
        return { label: '📢 Telegram Channel', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' };
      case 'invite_count':
        return { label: '👥 Invite Milestone', color: '#a7f3d0', bg: 'rgba(16, 185, 129, 0.15)' };
      case 'spin_count':
        return { label: '🎡 Spin Milestone', color: '#fde047', bg: 'rgba(250, 204, 21, 0.15)' };
      case 'level_reach':
        return { label: '🏆 Level Milestone', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.15)' };
      default:
        return { label: '🔗 External Link', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.15)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>
      {/* Header & Subtabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ margin: 0, color: '#ffffff', fontSize: '1.3rem', fontWeight: 800 }}>
            📋 Quests, Tasks & Channels
          </h2>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            Configure 3 task types (External Links, Milestones, Telegram Channels) & rewards
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '0.2rem', display: 'flex', gap: '0.2rem' }}>
            <button
              onClick={() => setActiveSubTab('tasks')}
              style={{
                background: activeSubTab === 'tasks' ? 'rgba(56, 189, 248, 0.25)' : 'none',
                color: activeSubTab === 'tasks' ? '#38bdf8' : '#94a3b8',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setActiveSubTab('chats')}
              style={{
                background: activeSubTab === 'chats' ? 'rgba(56, 189, 248, 0.25)' : 'none',
                color: activeSubTab === 'chats' ? '#38bdf8' : '#94a3b8',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Bot Channels ({chats.length})
            </button>
          </div>

          {activeSubTab === 'tasks' ? (
            <button
              onClick={() => setShowTaskModal(true)}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
              }}
            >
              <span>➕</span>
              <span>Create Task</span>
            </button>
          ) : (
            <button
              onClick={() => setShowChatModal(true)}
              style={{
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>📢</span>
              <span>Link Channel</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtab 1: Tasks List */}
      {activeSubTab === 'tasks' && (
        loading ? (
          <div className="skeleton-glow-box" style={{ width: '100%', height: '220px', borderRadius: '16px' }} />
        ) : tasks.length === 0 ? (
          <div style={{ background: 'rgba(15, 23, 42, 0.75)', padding: '2.5rem', borderRadius: '14px', textAlign: 'center', color: '#94a3b8', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            No tasks found. Click "Create Task" above to publish your first quest.
          </div>
        ) : (
          <div style={{ overflowX: 'auto', background: 'rgba(15, 23, 42, 0.75)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'rgba(0, 0, 0, 0.35)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Task Details</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Type</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Rewards</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Target / Channel</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Completions</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => {
                  const typeBadge = getTaskTypeBadge(t.task_type);
                  const dia = t.reward_diamonds ?? (t.reward_type === 'diamonds' ? t.reward_amount : 0) ?? 0;
                  const spn = t.reward_spins ?? (t.reward_type === 'spins' ? t.reward_amount : 0) ?? 0;

                  return (
                    <tr key={t.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#f1f5f9' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.2rem' }}>{t.icon || '🎯'}</span>
                          <div>
                            <div style={{ fontWeight: 700, color: '#ffffff' }}>{t.title}</div>
                            <div style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'capitalize' }}>Category: {t.category}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ background: typeBadge.bg, color: typeBadge.color, padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                          {typeBadge.label}
                        </span>
                      </td>

                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {dia > 0 && <span style={{ color: '#fde047', fontWeight: 800 }}>+{dia} 💎</span>}
                          {spn > 0 && <span style={{ color: '#67e8f9', fontWeight: 800 }}>+{spn} 🎡</span>}
                        </div>
                      </td>

                      <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>
                        {t.task_type === 'telegram_channel' ? (
                          <code style={{ color: '#38bdf8' }}>{t.telegram_chat_id || t.channel_id || '@channel'}</code>
                        ) : ['invite_count', 'spin_count', 'level_reach'].includes(t.task_type || '') ? (
                          <span style={{ fontWeight: 700, color: '#a7f3d0' }}>Target: {t.target_count || 1}</span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>15s Countdown</span>
                        )}
                      </td>

                      <td style={{ padding: '0.75rem 1rem', color: '#94a3b8' }}>
                        {t.completion_count || 0} claims
                      </td>

                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteTask(t.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#f87171',
                            borderRadius: '6px',
                            padding: '0.3rem 0.6rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Subtab 2: Connected Telegram Chats */}
      {activeSubTab === 'chats' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
          {chats.map((c) => (
            <div
              key={c.id}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}
            >
              <div>
                <h4 style={{ margin: 0, color: '#ffffff', fontSize: '0.95rem', fontWeight: 700 }}>
                  {c.title}
                </h4>
                <span style={{ color: '#38bdf8', fontSize: '0.78rem', display: 'block', marginTop: '0.2rem' }}>
                  {c.username} (ID: {c.chat_id})
                </span>
                <span style={{ color: '#34d399', fontSize: '0.72rem', fontWeight: 600 }}>
                  ✓ Bot Admin Verified
                </span>
              </div>

              <button
                onClick={() => handleUnlinkChat(c.id)}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  borderRadius: '8px',
                  padding: '0.35rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Unlink
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {showTaskModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setShowTaskModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              background: '#090d16',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.15rem', fontWeight: 800 }}>
                Create New Quest Task
              </h3>
              <button onClick={() => setShowTaskModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Task Type Selector */}
              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>
                  1. Task Type
                </label>
                <select
                  value={taskType}
                  onChange={(e: any) => {
                    setTaskType(e.target.value);
                    if (e.target.value === 'watch_ad') {
                      setIcon('🎬');
                      setCategory('daily');
                    } else if (e.target.value === 'telegram_channel') setIcon('📢');
                    else if (e.target.value === 'invite_count') setIcon('👥');
                    else if (e.target.value === 'spin_count') setIcon('🎡');
                    else if (e.target.value === 'level_reach') setIcon('🏆');
                    else setIcon('🔗');
                  }}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    borderRadius: '8px',
                    color: '#38bdf8',
                    fontWeight: 700
                  }}
                >
                  <option value="watch_ad">🎬 Type 4: Watch Rewarded Ad (AdsGram 2x/Daily Reward)</option>
                  <option value="telegram_channel">📢 Type 3: Join Telegram Channel / Group (2-Step Verification)</option>
                  <option value="external_link">🔗 Type 1: External Link / Partner Visit (15s Countdown)</option>
                  <option value="invite_count">👥 Type 2: Invite Friends Milestone</option>
                  <option value="spin_count">🎡 Type 2: Wheel Spins Milestone</option>
                  <option value="level_reach">🏆 Type 2: Level Reach Milestone</option>
                </select>
              </div>

              {/* Title & Category */}
              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>
                  2. Task Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Subscribe to Official Telegram Channel"
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                    Category Tab
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  >
                    <option value="social">Socials</option>
                    <option value="special">Special</option>
                    <option value="daily">Daily</option>
                    <option value="partner">Partner</option>
                  </select>
                </div>

                <div>
                  <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                    Icon Emoji
                  </label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="e.g. 📢"
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Rewards (Diamonds & Spins) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ color: '#fde047', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>
                    💎 Reward Diamonds
                  </label>
                  <input
                    type="number"
                    value={rewardDiamonds}
                    onChange={(e) => setRewardDiamonds(e.target.value)}
                    placeholder="500"
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(250, 204, 21, 0.3)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: '#67e8f9', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>
                    🎡 Reward Free Spins
                  </label>
                  <input
                    type="number"
                    value={rewardSpins}
                    onChange={(e) => setRewardSpins(e.target.value)}
                    placeholder="2"
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Target Count (for milestones) */}
              {['invite_count', 'spin_count', 'level_reach'].includes(taskType) && (
                <div>
                  <label style={{ color: '#a7f3d0', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>
                    🎯 Milestone Target Count (e.g. 5 invites, 50 spins, level 3)
                  </label>
                  <input
                    type="number"
                    value={targetCount}
                    onChange={(e) => setTargetCount(e.target.value)}
                    placeholder="5"
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              {/* Telegram Channel Selector (for telegram_channel) */}
              {taskType === 'telegram_channel' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ color: '#38bdf8', fontSize: '0.78rem', display: 'block', fontWeight: 700 }}>
                    📢 Connected Telegram Channel (Bot must be admin)
                  </label>
                  <select
                    value={selectedChatId}
                    onChange={(e) => setSelectedChatId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  >
                    <option value="">-- Select Linked Channel or Input Custom --</option>
                    {chats.map((c) => (
                      <option key={c.id} value={c.chat_id}>
                        {c.title} ({c.username})
                      </option>
                    ))}
                    <option value="custom">✏️ Enter Custom @Username / ID</option>
                  </select>

                  {(selectedChatId === 'custom' || chats.length === 0) && (
                    <input
                      type="text"
                      value={customChannelId}
                      onChange={(e) => setCustomChannelId(e.target.value)}
                      placeholder="e.g. @SpinCraftCommunity or -100192847192"
                      style={{
                        width: '100%',
                        padding: '0.65rem',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        boxSizing: 'border-box'
                      }}
                    />
                  )}
                </div>
              )}

              {/* Action / Invite URL */}
              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                  Action / Redirect URL
                </label>
                <input
                  type="text"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="https://t.me/your_channel or https://partner.com"
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  style={{
                    padding: '0.55rem 1rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#cbd5e1',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '0.55rem 1.25rem',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  {submitting ? 'Creating...' : 'Publish Quest Task 🚀'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link Bot Channel Modal */}
      {showChatModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setShowChatModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              background: '#090d16',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#ffffff', fontWeight: 800 }}>Link Telegram Channel</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.45, marginTop: 0 }}>
              Make sure your Telegram bot is added as an <b>Admin</b> to the channel/group before linking.
            </p>

            <form onSubmit={handleLinkChat} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                  Channel Username or ID
                </label>
                <input
                  type="text"
                  value={newChatId}
                  onChange={(e) => setNewChatId(e.target.value)}
                  placeholder="e.g. @SpinCraftCommunity or -100192847192"
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowChatModal(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#cbd5e1',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={linkingChat}
                  style={{
                    padding: '0.5rem 1.2rem',
                    background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {linkingChat ? 'Linking...' : 'Link Channel 📢'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

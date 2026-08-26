import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/adminService';
import type { AdminTask, ConnectedTelegramChat } from '../../../types/admin';
import { notifyToast } from '../../../utils/debugToast';

export const TasksModule: React.FC = () => {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [chats, setChats] = useState<ConnectedTelegramChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'chats'>('tasks');

  // Task Modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'daily' | 'social' | 'partner' | 'special'>('social');
  const [icon, setIcon] = useState('📣');
  const [rewardType, setRewardType] = useState<'diamonds' | 'spins' | 'usd'>('diamonds');
  const [rewardAmount, setRewardAmount] = useState('500');
  const [actionUrl, setActionUrl] = useState('https://t.me/');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Chat Link Modal
  const [showChatModal, setShowChatModal] = useState(false);
  const [newChatId, setNewChatId] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [tRes, cRes] = await Promise.all([
        adminService.getTasks(),
        adminService.getConnectedChats()
      ]);
      if (tRes.data) setTasks(tRes.data);
      if (cRes.data) setChats(cRes.data);
    } catch (err: any) {
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
      await adminService.createTask({
        title,
        category,
        icon,
        reward_type: rewardType,
        reward_amount: parseInt(rewardAmount, 10) || 100,
        action_url: actionUrl,
        telegram_chat_id: telegramChatId || undefined,
        is_active: true
      });
      notifyToast('📋 Task created successfully!', 'success', 3000);
      setShowTaskModal(false);
      setTitle('');
      loadData();
    } catch (err: any) {
      notifyToast(`Error: ${err.message}`, 'error', 3500);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Delete this task?')) return;
    try {
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
    try {
      await adminService.linkConnectedChat(newChatId.trim());
      notifyToast('📢 Channel linked to bot!', 'success', 3000);
      setShowChatModal(false);
      setNewChatId('');
      loadData();
    } catch (err: any) {
      notifyToast(`Error: ${err.message}`, 'error', 3000);
    }
  };

  const handleUnlinkChat = async (id: number) => {
    if (!window.confirm('Unlink this channel?')) return;
    try {
      await adminService.unlinkConnectedChat(id);
      notifyToast('Channel unlinked', 'info', 2500);
      loadData();
    } catch (err: any) {
      notifyToast(`Error: ${err.message}`, 'error', 3000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & Subtabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ margin: 0, color: '#ffffff', fontSize: '1.3rem', fontWeight: 800 }}>
            📋 Tasks & Telegram Channels
          </h2>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Manage quests, rewards, and connected bot channels</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
              Channels ({chats.length})
            </button>
          </div>

          {activeSubTab === 'tasks' ? (
            <button
              onClick={() => setShowTaskModal(true)}
              style={{
                background: 'linear-gradient(135deg, #00e676, #00b0ff)',
                border: 'none',
                color: '#060a12',
                borderRadius: '10px',
                padding: '0.5rem 0.9rem',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              + Create Task
            </button>
          ) : (
            <button
              onClick={() => setShowChatModal(true)}
              style={{
                background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                border: 'none',
                color: '#060a12',
                borderRadius: '10px',
                padding: '0.5rem 0.9rem',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              + Link Channel
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="skeleton-glow-box" style={{ width: '100%', height: '200px', borderRadius: '16px' }} />
      ) : activeSubTab === 'tasks' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.85rem' }}>
          {tasks.map((t) => (
            <div
              key={t.id}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.6rem' }}>{t.icon || '🎯'}</span>
                <div>
                  <h4 style={{ margin: 0, color: '#ffffff', fontSize: '0.95rem', fontWeight: 700 }}>
                    {t.title}
                  </h4>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem', alignItems: 'center' }}>
                    <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>
                      +{t.reward_amount} {t.reward_type === 'diamonds' ? '💎' : t.reward_type === 'spins' ? '🎟️' : '$'}
                    </span>
                    <span style={{ color: '#64748b', fontSize: '0.75rem' }}>• {t.completion_count} completed</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDeleteTask(t.id)}
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
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.85rem' }}>
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
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#ffffff' }}>Create New Quest Task</h3>

            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                  Task Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Join Official Telegram Community"
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
                    Category
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
                    <option value="social">📣 Social / Telegram</option>
                    <option value="daily">📅 Daily Streak</option>
                    <option value="partner">🤝 Partner Quest</option>
                    <option value="special">⭐ Special Event</option>
                  </select>
                </div>

                <div>
                  <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                    Reward Amount
                  </label>
                  <input
                    type="number"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(e.target.value)}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                    Icon Emoji
                  </label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="e.g. 📣"
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

                <div>
                  <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                    Reward Asset
                  </label>
                  <select
                    value={rewardType}
                    onChange={(e: any) => setRewardType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  >
                    <option value="diamonds">💎 Diamonds</option>
                    <option value="spins">🎟️ Spins</option>
                    <option value="usd">💵 USD ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                  Linked Telegram Chat ID (Optional)
                </label>
                <input
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="e.g. -100192847192"
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

              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                  Action / Redirect URL
                </label>
                <input
                  type="text"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="https://t.me/yourgroup"
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

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #00e676, #00b0ff)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#060a12',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {submitting ? 'Creating...' : 'Create Task 🎯'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  style={{
                    padding: '0.75rem 1.2rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link Channel Modal */}
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
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#ffffff' }}>Link Telegram Channel</h3>
            <p style={{ margin: '0 0 1rem 0', color: '#94a3b8', fontSize: '0.8rem' }}>
              Ensure the bot is added as an administrator to the channel before linking.
            </p>

            <form onSubmit={handleLinkChat} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
                  Channel Username or ID
                </label>
                <input
                  type="text"
                  value={newChatId}
                  onChange={(e) => setNewChatId(e.target.value)}
                  placeholder="@yourchannel or -100123456789"
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

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#060a12',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Verify & Link 📢
                </button>
                <button
                  type="button"
                  onClick={() => setShowChatModal(false)}
                  style={{
                    padding: '0.75rem 1.2rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

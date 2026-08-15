import { useState, useEffect } from 'react';
import type { FC } from 'react';

export interface TeamModalProps {
  onClose: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  joinedChannel: boolean;
}

const MOCK_TEAM_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Mahoraga', joinedChannel: true },
  { id: '2', name: 'Tiku', joinedChannel: true }
];

export const TeamModal: FC<TeamModalProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleInvite = () => {
    const inviteUrl = `https://t.me/EarnCraftBot?start=ref_user`;
    const shareText = `Join me on EarnCraft and spin the wheel for massive cash rewards! 🎰💰\n${inviteUrl}`;
    
    // @ts-ignore
    if (window.Telegram?.WebApp?.openTelegramLink) {
      // @ts-ignore
      window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(shareText)}`);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  const totalCount = MOCK_TEAM_MEMBERS.length;
  const activeCount = MOCK_TEAM_MEMBERS.filter(m => m.joinedChannel).length;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    >
      {/* Dark overlay click to close */}
      <div
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0
        }}
      />

      {/* Bottom Sheet Modal Container (~82% - 85% Height) */}
      <div
        style={{
          width: '100%',
          height: '83vh',
          maxHeight: '85vh',
          background: 'linear-gradient(180deg, #058245 0%, #024a27 100%)',
          borderTopLeftRadius: '1.75rem',
          borderTopRightRadius: '1.75rem',
          borderTop: '1px solid rgba(52, 211, 153, 0.5)',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.6)',
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.25rem 1.25rem 1.5rem 1.25rem',
          position: 'relative',
          zIndex: 1,
          boxSizing: 'border-box',
          fontFamily: 'Outfit, sans-serif'
        }}
      >
        {/* Header Title & Close Button */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: '0.75rem' }}>
          <h2
            style={{
              margin: 0,
              color: '#ffffff',
              fontSize: '1.35rem',
              fontWeight: 800,
              fontFamily: 'Georgia, serif',
              letterSpacing: '0.3px'
            }}
          >
            Team
          </h2>
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              right: 0,
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1.35rem',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.85
            }}
          >
            ✕
          </button>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '0.25rem 1rem'
          }}
        >
          {/* Total Count */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', fontWeight: 700 }}>total</span>
            <span
              style={{
                color: '#facc15',
                fontSize: '1.8rem',
                fontWeight: 900,
                fontFamily: 'Georgia, serif',
                lineHeight: 1.1
              }}
            >
              {totalCount}
            </span>
          </div>

          {/* Active Count */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', fontWeight: 700 }}>active</span>
            <span
              style={{
                color: '#facc15',
                fontSize: '1.8rem',
                fontWeight: 900,
                fontFamily: 'Georgia, serif',
                lineHeight: 1.1
              }}
            >
              {activeCount}
            </span>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div
          style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.85)',
            fontSize: '0.8rem',
            lineHeight: 1.3,
            margin: '0.35rem 0 0.9rem 0'
          }}
        >
          * If the person you invite doesn't join our channel, you can't get spins!
        </div>

        {/* Highlight Invite Offer Card */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.16)',
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '0.9rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.65rem',
            marginBottom: '1rem',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: '#ffffff',
              fontSize: '1.1rem',
              fontWeight: 800,
              fontFamily: 'Georgia, serif'
            }}
          >
            <img
              src="./assets/inviteFeatureCardIcon.png"
              alt="Invite"
              style={{ width: '26px', height: '26px', objectFit: 'contain' }}
            />
            <span>Invite 1 Friend =</span>
            <img
              src="./assets/spin-ticket.png"
              alt="Spin Ticket"
              style={{ width: '22px', height: '22px', objectFit: 'contain' }}
            />
            <span>1 Spin</span>
          </div>

          <button
            onClick={handleInvite}
            style={{
              width: '100%',
              maxWidth: '240px',
              background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
              border: '1px solid rgba(167, 243, 208, 0.6)',
              borderRadius: '0.75rem',
              padding: '0.6rem 1.25rem',
              color: '#ffffff',
              fontStyle: 'italic',
              fontWeight: 800,
              fontSize: '1.05rem',
              fontFamily: 'Georgia, serif',
              cursor: 'pointer',
              boxShadow: '0 3px 8px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
              transition: 'transform 0.1s ease',
              textAlign: 'center'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {copied ? 'Link Copied! ✓' : 'Invite for Spins!'}
          </button>
        </div>

        {/* Invited Members Table Container */}
        <div
          style={{
            flex: 1,
            background: 'rgba(0, 0, 0, 0.16)',
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '0.9rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0
          }}
        >
          {/* Table Header Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem',
              padding: '0 0.25rem'
            }}
          >
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>Name</span>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>Join Channel</span>
          </div>

          {/* Members List */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              paddingRight: '0.2rem'
            }}
          >
            {MOCK_TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '0.75rem',
                  padding: '0.65rem 0.9rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {/* User Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem'
                    }}
                  >
                    👤
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                    {member.name}
                  </span>
                </div>

                {/* Status */}
                <span
                  style={{
                    color: member.joinedChannel ? '#4ade80' : 'rgba(255,255,255,0.5)',
                    fontWeight: 800,
                    fontSize: '0.95rem'
                  }}
                >
                  {member.joinedChannel ? 'Yes' : 'No'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Text */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.75)',
            marginTop: '0.75rem'
          }}
        >
          Only the latest 50 invitations are shown
        </div>
      </div>
    </div>
  );
};

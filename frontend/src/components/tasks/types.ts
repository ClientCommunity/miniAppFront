import type { ReactNode } from 'react';

export interface TaskItem {
  id: string;
  title?: string;
  category?: 'daily' | 'special' | 'socials';
  icon?: string | ReactNode;
  isIconImage?: boolean;
  rewardGems?: number;
  secondaryRewardGems?: number;
  progress?: { current: number; total: number };
  status?: 'pending' | 'checking' | 'completed' | 'claimed';
  actionUrl?: string;
  action_url?: string;
  isPlaceholder?: boolean;
  onAction?: () => void;
  hideButton?: boolean;
  buttonText?: string;
}

export interface ReadyToClaimItem {
  id: string;
  title: string;
  icon: string;
  rewardGems: number;
  onClaim?: () => void;
}

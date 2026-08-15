import type { ReactNode } from 'react';

export interface TaskItem {
  id: string;
  title?: string;
  icon?: string | ReactNode;
  isIconImage?: boolean;
  rewardGems?: number;
  secondaryRewardGems?: number;
  status?: 'pending' | 'checking' | 'completed';
  isPlaceholder?: boolean;
  onAction?: () => void;
  hideButton?: boolean;
}

export interface ReadyToClaimItem {
  id: string;
  title: string;
  icon: string;
  rewardGems: number;
  onClaim?: () => void;
}

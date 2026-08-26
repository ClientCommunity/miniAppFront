import appConfig from '../config.json';
import mockData from '../data.json';
import api from '../api/client';
import type { SpinSegment } from '../components/SpinWheel';
import type {
  UserProfile,
  AuthResponseData,
  SpinResultData,
  DailyRewardsStatusData,
  ClaimDailyRewardData,
  TeamStatsData,
  ContestLeaderboardData,
  TasksPageData,
  WalletInfoData,
  WithdrawResultData,
  TransactionRecordData,
  RaffleCardData,
  RaffleDetailsData,
  StarsInvoiceData
} from '../types/api';

export interface AppConfig {
  useMockData: boolean;
  apiBaseUrl: string;
  apiTimeoutMs: number;
  simulatedDelayMs: number;
  enableTelegramVerification: boolean;
}

export const getConfig = (): AppConfig => {
  return appConfig as AppConfig;
};

// 0. Initial State Getters (Only returns mock if useMockData is enabled in config.json)
export const getInitialUserProfile = (): UserProfile => {
  if (appConfig.useMockData) {
    return mockData.userProfile as unknown as UserProfile;
  }
  return {
    id: 0,
    telegram_id: 0,
    username: '',
    first_name: 'Connecting...',
    photo_url: '',
    balance_usd: 0.0,
    spins: 0,
    diamonds: 0,
    energy: 0,
    max_energy: 100,
    level: 1,
    goal_usd: 1.0,
    goal_left: 1.0,
    ton_wallet: '',
    phone: '',
    is_admin: false
  };
};

export const getInitialWheelSegments = (): SpinSegment[] => {
  return mockData.wheelSegments as SpinSegment[];
};

export const getInitialDailyRewards = (): DailyRewardsStatusData | null => {
  if (appConfig.useMockData) {
    return mockData.dailyRewards as unknown as DailyRewardsStatusData;
  }
  return null;
};

export const getInitialTeamData = (): TeamStatsData | null => {
  if (appConfig.useMockData) {
    return mockData.teamData as unknown as TeamStatsData;
  }
  return null;
};

export const getInitialContestData = (): ContestLeaderboardData | null => {
  if (appConfig.useMockData) {
    return mockData.contests as unknown as ContestLeaderboardData;
  }
  return null;
};

export const getInitialTasksPageData = (): TasksPageData | null => {
  if (appConfig.useMockData) {
    return mockData.tasksPage as unknown as TasksPageData;
  }
  return null;
};

export const getInitialWalletData = (): WalletInfoData | null => {
  if (appConfig.useMockData) {
    return mockData.walletPage as unknown as WalletInfoData;
  }
  return null;
};

export const getInitialRafflesData = (): {
  ongoing: RaffleCardData[];
  ended: RaffleCardData[];
  prizeTiers: any[];
} | null => {
  if (appConfig.useMockData) {
    return mockData.rafflesPage as unknown as {
      ongoing: RaffleCardData[];
      ended: RaffleCardData[];
      prizeTiers: any[];
    };
  }
  return null;
};

export const getInitialMockTasksBanner = () => {
  return mockData.mockTasksBanner;
};

export const getInitialFeatureCards = () => {
  return mockData.featureCards;
};

// 1. Telegram Authentication (POST /auth/telegram)
export const authenticateTelegram = async (
  initData?: string,
  startParam?: string
): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }> => {
  if (appConfig.useMockData) {
    return {
      success: true,
      user: mockData.userProfile as unknown as UserProfile,
      token: 'mock_jwt_token_12345'
    };
  }

  const res = await api.post<AuthResponseData>('/auth/telegram', {
    init_data: initData || '',
    start_param: startParam || ''
  });

  if (res.success && res.data) {
    if (res.data.token) {
      api.setToken(res.data.token);
    }
    return {
      success: true,
      user: res.data.user,
      token: res.data.token
    };
  }

  return {
    success: false,
    error: res.error || res.message || 'Telegram authentication failed on server.'
  };
};

// 2. User Profile (GET /user/profile)
export const fetchUserProfile = async (): Promise<UserProfile | null> => {
  if (appConfig.useMockData) {
    return mockData.userProfile as unknown as UserProfile;
  }

  const res = await api.get<UserProfile>('/user/profile');
  if (res.success && res.data) {
    return res.data;
  }

  return null;
};

// 3. Server-Authoritative Spin Execution (POST /spin)
export const performServerSpin = async (method?: 'spins' | 'diamonds' | 'auto'): Promise<SpinResultData> => {
  if (appConfig.useMockData) {
    await new Promise((res) => setTimeout(res, 200));
    const segments = mockData.wheelSegments;
    const randomIdx = Math.floor(Math.random() * segments.length);
    const chosen = segments[randomIdx];
    return {
      targetIndex: randomIdx,
      isDouble: false,
      reward: {
        id: `rew-${Date.now()}`,
        label: chosen.label,
        value: chosen.value,
        amount: chosen.value === 'jackpot' ? '$10.00' : chosen.value === 'coins' ? '$0.20' : '+80 💎',
        image: chosen.image
      },
      txId: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: Date.now(),
      userBalance: {
        spins: 11,
        diamonds: 204,
        balance_usd: 0.76,
        energy: 50,
        goal_usd: 1.0,
        goal_left: 0.24
      }
    };
  }

  const res = await api.post<SpinResultData>('/spin', {
    method: method || 'auto'
  });
  if (res.success && res.data) {
    return res.data;
  }

  throw new Error(res.error || res.message || 'Server spin request failed');
};

// 4. Daily Rewards (Session-Cached per app opening)
let cachedDailyRewards: DailyRewardsStatusData | null = null;

export const getCachedDailyRewards = (): DailyRewardsStatusData | null => {
  if (cachedDailyRewards) return cachedDailyRewards;
  if (typeof window !== 'undefined') {
    try {
      const saved = sessionStorage.getItem('cached_daily_rewards');
      if (saved) {
        cachedDailyRewards = JSON.parse(saved);
        return cachedDailyRewards;
      }
    } catch {}
  }
  return null;
};

export const setCachedDailyRewards = (data: DailyRewardsStatusData) => {
  cachedDailyRewards = data;
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('cached_daily_rewards', JSON.stringify(data));
    } catch {}
  }
};

export const fetchDailyRewardsData = async (forceRefresh: boolean = false): Promise<DailyRewardsStatusData | null> => {
  if (appConfig.useMockData) {
    return mockData.dailyRewards as unknown as DailyRewardsStatusData;
  }

  if (!forceRefresh) {
    const cached = getCachedDailyRewards();
    if (cached) return cached;
  }

  const res = await api.get<any>('/daily-rewards');
  if (res.success && res.data) {
    const raw = res.data;
    const rawDays = raw.days || [];

    const normalized: DailyRewardsStatusData = {
      currentDay: raw.currentDay ?? raw.current_day ?? 1,
      canClaimToday: raw.canClaimToday ?? raw.can_claim_today ?? false,
      streakActive: raw.streakActive ?? raw.streak_active ?? false,
      streakBonus: raw.streakBonus || raw.streak_bonus || 'Day Streak',
      days: rawDays.map((d: any, idx: number) => ({
        day: d.day || idx + 1,
        reward: d.reward || '+80',
        icon: d.icon || (idx === 2 || idx === 6 ? './assets/giftIconInDailySignIn.png' : './assets/diamond_animated.gif'),
        active: d.active ?? false,
        isMega: d.isMega ?? d.is_mega ?? (idx === 6)
      }))
    };

    setCachedDailyRewards(normalized);
    return normalized;
  }

  return null;
};

export const claimDailyReward = async (): Promise<{ success: boolean; message?: string; data?: ClaimDailyRewardData }> => {
  if (appConfig.useMockData) {
    await new Promise((res) => setTimeout(res, 300));
    return {
      success: true,
      message: 'Claimed daily reward +80 Diamonds!',
      data: {
        claimedDay: 1,
        rewardGems: 80,
        txId: `TX-${Date.now()}`,
        userBalance: { diamonds: 204 }
      }
    };
  }

  const res = await api.post<ClaimDailyRewardData>('/daily-rewards/claim');
  if (res.success) {
    const cached = getCachedDailyRewards();
    if (cached) {
      setCachedDailyRewards({
        ...cached,
        canClaimToday: false
      });
    }
  }

  return {
    success: res.success,
    message: res.message || (res.success ? 'Claimed daily reward!' : res.error),
    data: res.data
  };
};

// 5. Referral Team (GET /team)
export const fetchTeamData = async (): Promise<TeamStatsData | null> => {
  if (appConfig.useMockData) {
    return mockData.teamData as unknown as TeamStatsData;
  }

  const res = await api.get<any>('/team');
  if (res.success && res.data) {
    const raw = res.data;
    const members = (raw.members || []).map((m: any, idx: number) => ({
      id: String(m.id || m.user_id || idx + 1),
      name: m.name || m.first_name || m.username || 'Member',
      joinedDate: m.joinedDate || m.joined_date || m.created_at || 'Recently',
      joinedChannel: m.joinedChannel ?? m.joined_channel ?? true
    }));

    return {
      totalCount: raw.totalCount ?? raw.total_count ?? raw.totalFriends ?? members.length,
      activeCount: raw.activeCount ?? raw.active_count ?? members.filter((m: any) => m.joinedChannel).length,
      inviteUrl: raw.inviteUrl || raw.invite_url || '',
      shareText: raw.shareText || raw.share_text || 'Join me on EarnCraft and spin the wheel for massive cash rewards! 🎰💰',
      currentTier: raw.currentTier || raw.current_tier || 'Bronze',
      tierRewards: raw.tierRewards || raw.tier_rewards || ['Bronze: 1 Spin/friend', 'Silver: 2 Spins + 5%', 'Gold: 3 Spins + 10%'],
      members
    };
  }

  return null;
};

// 6. Contests / Tournaments (GET /contests/spins & GET /contests/referrals)
export const fetchContestData = async (type: 'spins' | 'referrals' = 'spins'): Promise<ContestLeaderboardData | null> => {
  if (appConfig.useMockData) {
    if (type === 'referrals') {
      return {
        title: 'Referral Champions Tournament',
        category: 'referrals',
        prizePool: '$750.00 USDT',
        endsIn: '3d 08h 12m 30s',
        endsTimestamp: Date.now() + 86400000 * 3,
        topWinners: [
          { rank: 1, name: 'Elena_Vip', avatar: '👑', referrals: 48, prize: '$300 USDT' },
          { rank: 2, name: 'CryptoKing', avatar: '🥈', referrals: 35, prize: '$175 USDT' },
          { rank: 3, name: 'TonMiner', avatar: '🥉', referrals: 22, prize: '$100 USDT' }
        ],
        otherRankings: [
          { rank: 4, name: 'ReferralPro', avatar: '⚡', referrals: 19, prize: '$50 USDT' },
          { rank: 5, name: 'EarnMaster', avatar: '🌟', referrals: 14, prize: '$35 USDT' }
        ],
        userStatus: {
          rank: 12,
          referrals: 5,
          score: 5,
          projectedPrize: '$10.00'
        }
      } as unknown as ContestLeaderboardData;
    }
    return mockData.contests as unknown as ContestLeaderboardData;
  }

  // 1. Try standard /contests/:type
  let res = await api.get<ContestLeaderboardData>(`/contests/${type}`);
  if (!res.success) {
    // 2. Try singular /contest/:type
    res = await api.get<ContestLeaderboardData>(`/contest/${type}`);
  }
  if (!res.success) {
    // 3. Try query param /contests?type=:type
    res = await api.get<ContestLeaderboardData>(`/contests?type=${type}`);
  }

  if (res.success && res.data) {
    return res.data;
  }

  return null;
};

// 7. Tasks (GET /tasks & POST /tasks/:id/claim)
export const fetchTasksPageData = async (): Promise<TasksPageData | null> => {
  if (appConfig.useMockData) {
    return mockData.tasksPage as unknown as TasksPageData;
  }

  const res = await api.get<TasksPageData>('/tasks');
  if (res.success && res.data) {
    return res.data;
  }

  return null;
};

export const claimTaskReward = async (
  taskId: string
): Promise<{ success: boolean; message?: string; user?: UserProfile }> => {
  if (appConfig.useMockData) {
    await new Promise((res) => setTimeout(res, 350));
    return {
      success: true,
      message: 'Task reward claimed successfully! 💎'
    };
  }

  const res = await api.post<UserProfile>(`/tasks/${taskId}/claim`);
  return {
    success: res.success,
    message: res.message || (res.success ? 'Task reward claimed!' : res.error),
    user: res.data
  };
};

// 8. Wallet & Withdrawals (GET /wallet, POST /wallet/bind, POST /wallet/withdraw)
export const fetchWalletData = async (): Promise<WalletInfoData | null> => {
  if (appConfig.useMockData) {
    return mockData.walletPage as unknown as WalletInfoData;
  }

  const res = await api.get<WalletInfoData>('/wallet');
  if (res.success && res.data) {
    return res.data;
  }

  return null;
};

export const bindWallet = async (
  address: string,
  phone?: string
): Promise<{ success: boolean; message?: string }> => {
  if (appConfig.useMockData) {
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, message: 'Wallet bound successfully!' };
  }

  const res = await api.post('/wallet/bind', { address, phone: phone || '' });
  return {
    success: res.success,
    message: res.message || (res.success ? 'Wallet address saved!' : res.error)
  };
};

export const submitWithdrawal = async (
  amountUsd: number
): Promise<{ success: boolean; message?: string; data?: WithdrawResultData }> => {
  if (appConfig.useMockData) {
    await new Promise((res) => setTimeout(res, 450));
    const fee = amountUsd * 0.02;
    return {
      success: true,
      message: `Withdrawal of $${amountUsd.toFixed(2)} submitted successfully!`,
      data: {
        withdrawalId: `WTH-${Date.now()}`,
        amountUsd,
        feeUsd: fee,
        netPayoutUsd: amountUsd - fee,
        tonAddress: mockData.walletPage.tonWalletAddress,
        status: 'processing',
        txId: `TX-${Date.now()}`,
        userBalance: mockData.userProfile as unknown as UserProfile
      }
    };
  }

  const res = await api.post<WithdrawResultData>('/wallet/withdraw', {
    amount_usd: amountUsd
  });
  return {
    success: res.success,
    message: res.message || (res.success ? 'Withdrawal submitted!' : res.error),
    data: res.data
  };
};

// 9. Wallet Records (GET /wallet/records)
export const fetchWalletRecords = async (
  type: string = 'all',
  page: number = 1,
  limit: number = 20
): Promise<TransactionRecordData[] | null> => {
  if (appConfig.useMockData) {
    return mockData.walletPage.recentTransactions as unknown as TransactionRecordData[];
  }

  const res = await api.get<TransactionRecordData[]>('/wallet/records', { type, page, limit });
  if (res.success && res.data) {
    return res.data;
  }

  return null;
};

// 10. Gift Code Redemption (POST /gift-codes/redeem)
export const redeemGiftCode = async (
  code: string
): Promise<{ success: boolean; message?: string; rewardGems?: number }> => {
  if (appConfig.useMockData) {
    await new Promise((res) => setTimeout(res, 400));
    if (code.trim().toUpperCase() === 'WELCOME2026' || code.trim().length > 3) {
      return { success: true, message: 'Gift code redeemed successfully! 🎉', rewardGems: 500 };
    }
    return { success: false, message: 'Invalid or expired gift code.' };
  }

  const res = await api.post<{ rewardGems?: number }>('/gift-codes/redeem', { code });
  return {
    success: res.success,
    message: res.message || (res.success ? 'Gift code redeemed successfully! 🎉' : res.error),
    rewardGems: res.data?.rewardGems
  };
};

// 11. Support & Feedback (POST /support/feedback)
export const submitFeedback = async (
  formData: FormData | { email: string; category: string; description: string }
): Promise<{ success: boolean; message?: string }> => {
  if (appConfig.useMockData) {
    await new Promise((res) => setTimeout(res, 400));
    return { success: true, message: 'Feedback submitted successfully! Our team will review it.' };
  }

  const res = await api.post('/support/feedback', formData);
  return {
    success: res.success,
    message: res.message || (res.success ? 'Support ticket submitted!' : res.error)
  };
};

// 12. Raffles & Lotteries (GET /raffles, GET /raffles/:id, POST /raffles/:id/claim, POST /telegram/stars/invoice)
export const fetchRafflesData = async (): Promise<{
  ongoing: RaffleCardData[];
  ended: RaffleCardData[];
  prizeTiers: any[];
} | null> => {
  if (appConfig.useMockData) {
    return mockData.rafflesPage as unknown as {
      ongoing: RaffleCardData[];
      ended: RaffleCardData[];
      prizeTiers: any[];
    };
  }

  const res = await api.get<RaffleCardData[]>('/raffles');
  if (res.success && res.data) {
    const ongoing = res.data.filter((r) => r.status === 'ongoing');
    const ended = res.data.filter((r) => r.status === 'ended');
    return {
      ongoing,
      ended,
      prizeTiers: []
    };
  }

  return null;
};

export const fetchRaffleDetails = async (raffleId: string): Promise<RaffleDetailsData | null> => {
  if (appConfig.useMockData) {
    return {
      raffle: (mockData.rafflesPage.ongoing[0] as unknown as RaffleCardData) || null,
      userTickets: 2,
      ticketPriceGems: 100,
      endsTimestamp: Date.now() + 86400000 * 2,
      secondsLeft: 45,
      prizeTiers: mockData.rafflesPage.prizeTiers
    };
  }

  const res = await api.get<RaffleDetailsData>(`/raffles/${raffleId}`);
  if (res.success && res.data) {
    return res.data;
  }

  return null;
};

export const claimRaffleTicket = async (
  raffleId: string,
  method: 'gems' | 'vip' = 'gems'
): Promise<{ success: boolean; message?: string }> => {
  if (appConfig.useMockData) {
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, message: 'Ticket claimed successfully! 🎟️' };
  }

  const res = await api.post(`/raffles/${raffleId}/claim`, { method });
  return {
    success: res.success,
    message: res.message || (res.success ? 'Ticket claimed!' : res.error)
  };
};

export const createTelegramStarsInvoice = async (
  starsCount: number,
  raffleId?: string
): Promise<{ success: boolean; invoiceLink?: string; message?: string }> => {
  if (appConfig.useMockData) {
    await new Promise((res) => setTimeout(res, 300));
    return {
      success: true,
      invoiceLink: 'https://t.me/$invoice_mock_link'
    };
  }

  const res = await api.post<StarsInvoiceData>('/telegram/stars/invoice', {
    stars_count: starsCount,
    purpose: 'raffle_tickets',
    raffle_id: raffleId || ''
  });

  return {
    success: res.success,
    invoiceLink: res.data?.invoice_link,
    message: res.message || res.error
  };
};

export default {
  getConfig,
  getInitialUserProfile,
  getInitialWheelSegments,
  getInitialDailyRewards,
  getInitialTeamData,
  getInitialContestData,
  getInitialTasksPageData,
  getInitialWalletData,
  getInitialRafflesData,
  getInitialMockTasksBanner,
  getInitialFeatureCards,
  authenticateTelegram,
  fetchUserProfile,
  performServerSpin,
  fetchDailyRewardsData,
  claimDailyReward,
  fetchTeamData,
  fetchContestData,
  fetchTasksPageData,
  claimTaskReward,
  fetchWalletData,
  bindWallet,
  submitWithdrawal,
  fetchWalletRecords,
  redeemGiftCode,
  submitFeedback,
  fetchRafflesData,
  fetchRaffleDetails,
  claimRaffleTicket,
  createTelegramStarsInvoice
};

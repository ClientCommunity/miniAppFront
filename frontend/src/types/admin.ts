// ============================================================================
// IN-APP ADMIN PANEL TYPES & DATA MODELS
// ============================================================================

export interface AdminAuthResponse {
  token: string;
  expires_in?: number;
  message?: string;
}

// 1. Overview & Master Vault Status
export interface AdminOverviewMetrics {
  total_deposits_usd: number;
  total_withdrawals_usd: number;
  gross_volume_usd: number;
  active_users_dau: number;
  total_registered_users: number;
  pending_withdrawals_count: number;
  total_spins_today: number;
  conversion_rate_percent: number;
}

export interface MasterVaultStatus {
  is_initialized: boolean;
  master_address: string;
  network: string; // "BSC (BEP-20)"
  bnb_gas_balance: number;
  bnb_gas_status: 'healthy' | 'low' | 'critical';
  usdt_reserve_balance: number;
  last_swept_at?: string;
}

export interface VaultGeneratedSecrets {
  master_address: string;
  seed_phrase?: string;
  private_key: string;
  network?: string;
}

export interface VaultImportPayload {
  seed_phrase?: string;
  private_key?: string;
}

// 2. Contests & Tournaments
export interface ContestPrizeLadderEntry {
  rank_from: number;
  rank_to: number;
  prize_usd: number;
  badge?: string;
}

export interface AdminContest {
  id: number;
  title: string;
  category: 'spins' | 'referrals';
  prize_pool_usd: number;
  starts_at: string;
  ends_at: string;
  status: 'active' | 'scheduled' | 'ended' | 'distributed';
  total_participants: number;
  prize_ladder: ContestPrizeLadderEntry[];
  top_winner_id?: number;
  top_winner_name?: string;
}

// 3. Raffles & Lotteries
export interface AdminRaffle {
  id: number;
  title: string;
  cash_prize_usd: number;
  ticket_gem_price: number;
  total_tickets_sold: number;
  total_participants: number;
  ends_at: string;
  status: 'active' | 'drawn' | 'cancelled';
  winner_telegram_id?: number;
  winner_username?: string;
  winner_tx_id?: string;
}

// 4. Tasks & Connected Chats
export type AdminTaskType = 'external_link' | 'invite_count' | 'spin_count' | 'level_reach' | 'telegram_channel';

export interface AdminTask {
  id: number;
  title: string;
  task_type?: AdminTaskType;
  category: 'daily' | 'social' | 'partner' | 'special';
  icon: string;
  icon_url?: string;
  reward_type?: 'diamonds' | 'spins' | 'usd';
  reward_amount?: number;
  reward_diamonds?: number;
  reward_spins?: number;
  reward_usd?: number;
  target_count?: number;
  action_url: string;
  telegram_chat_id?: string;
  channel_id?: string;
  is_active: boolean;
  order_index?: number;
  completion_count?: number;
}

export interface CreateAdminTaskPayload {
  title: string;
  task_type: AdminTaskType;
  category: 'daily' | 'social' | 'partner' | 'special';
  icon?: string;
  icon_url?: string;
  reward_diamonds: number;
  reward_spins: number;
  reward_usd?: number;
  target_count?: number;
  action_url?: string;
  telegram_chat_id?: string;
  channel_id?: string;
  is_active?: boolean;
}

export interface ConnectedTelegramChat {
  id: number;
  chat_id: string;
  title: string;
  username: string;
  is_bot_admin: boolean;
  linked_tasks_count: number;
}

// 5. User Management
export interface AdminUserListItem {
  id: number;
  telegram_id: number;
  username: string;
  first_name: string;
  balance_usd: number;
  diamonds: number;
  spins: number;
  energy: number;
  level: number;
  is_banned: boolean;
  is_admin: boolean;
  created_at: string;
  last_active_at: string;
  ton_wallet?: string;
}

export interface BalanceAdjustPayload {
  user_id: number;
  adjustment_type: 'diamonds' | 'spins' | 'balance_usd';
  amount: number; // positive to credit, negative to debit
  audit_reason: string;
}

// 6. Withdrawals Cashout Queue & Payout Settings
export interface PayoutSettings {
  payout_mode: 'manual' | 'instant';
  min_withdrawal_usd?: number;
  fee_percent?: number;
}

export interface AdminWithdrawalItem {
  id: number;
  user_id: number;
  telegram_id: number;
  username: string;
  first_name?: string;
  phone?: string;
  amount_usd: number;
  fee_usd: number;
  net_amount_usd: number;
  destination_address: string;
  created_at: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  tx_hash?: string;
  reject_reason?: string;
  notes?: string;
}

// 7. Promo Gift Codes & Vouchers
export interface AdminGiftCode {
  id: number;
  code: string;
  batch_id?: string;
  batch_name?: string;
  reward_diamonds: number;
  reward_spins: number;
  reward_usd: number;
  max_claims: number;
  claims_count: number;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

export interface AdminGiftCodeClaimer {
  id: number;
  user_id: number;
  telegram_id: number;
  username: string;
  first_name?: string;
  claimed_at: string;
  diamonds_received: number;
  spins_received: number;
  usd_received: number;
}

export interface AdminGiftCodeBatch {
  batch_id: string;
  batch_name: string;
  prefix: string;
  total_codes: number;
  claimed_codes: number;
  unclaimed_codes: number;
  reward_diamonds: number;
  reward_spins: number;
  reward_usd: number;
  expires_at?: string;
  created_at: string;
}

export interface CreateCustomGiftCodePayload {
  code: string;
  reward_diamonds: number;
  reward_spins: number;
  reward_usd: number;
  max_claims: number;
  expires_in_days?: number;
}

export interface BulkGenerateVouchersPayload {
  batch_name: string;
  quantity: number;
  prefix: string;
  reward_diamonds: number;
  reward_spins: number;
  reward_usd: number;
  expires_in_days?: number;
}

// 8. Invoices & Sweep Auditor
export interface AdminFailedTransaction {
  id: number;
  user_id: number;
  telegram_id: number;
  username: string;
  deposit_address: string;
  usdt_detected: number;
  bnb_gas_needed: number;
  status: 'unfunded_gas' | 'sweep_failed' | 'stuck_pending';
  last_attempt_at: string;
  error_message?: string;
}

// 9. Support Feedback Inbox
export interface AdminSupportFeedback {
  id: number;
  user_id: number;
  telegram_id: number;
  username: string;
  category: 'bug' | 'deposit' | 'withdrawal' | 'spin' | 'general';
  message: string;
  screenshot_url?: string;
  created_at: string;
  is_resolved: boolean;
  resolved_at?: string;
  admin_notes?: string;
}


export interface User {
  id: string;
  telegramId: string;
  username: string;
  balance: number;
  referralCode: string;
  referredBy?: string;
  referralsCount: number;
  miningStartTime: number | null;
  isBanned: boolean;
  walletAddress?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  link: string;
  isCompleted: boolean;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  walletAddress: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: number;
}

export interface AppConfig {
  miningRate: number; // OLO per hour
  miningDuration: number; // seconds
  referralReward: number; // OLO
  taskReward: number; // OLO
  minWithdrawal: number; // OLO
  conversionRate: number; // 10 OLO = 1 USDT
  monetagId?: string;
  adsgramId?: string;
}

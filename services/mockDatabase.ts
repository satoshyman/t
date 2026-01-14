
import { User, Task, Withdrawal, AppConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants';

const DB_KEYS = {
  USER: 'olo_user_data',
  ALL_USERS: 'olo_all_users_list', // For admin simulation
  TASKS: 'olo_tasks_data',
  WITHDRAWALS: 'olo_withdrawals_data',
  CONFIG: 'olo_app_config',
  ADMIN: 'olo_admin_logged_in'
};

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Join Telegram Channel', description: 'Subscribe to our official channel', reward: 1, link: 'https://t.me/olo_official', isCompleted: false },
  { id: '2', title: 'Follow on Twitter/X', description: 'Follow our official X handle', reward: 1, link: 'https://twitter.com/olo_token', isCompleted: false },
  { id: '3', title: 'Subscribe to YouTube', description: 'Watch our latest video and subscribe', reward: 1, link: 'https://youtube.com', isCompleted: false },
  { id: '4', title: 'Share to Story', description: 'Post our app on your Telegram story', reward: 1, link: '#', isCompleted: false },
  { id: '5', title: 'Daily Login Reward', description: 'Claim your daily attendance OLO', reward: 1, link: '#', isCompleted: false },
];

export const mockDb = {
  // Config
  getConfig: (): AppConfig => {
    const saved = localStorage.getItem(DB_KEYS.CONFIG);
    return saved ? JSON.parse(saved) : { ...DEFAULT_CONFIG, monetagId: '7823941', adsgramId: 'olo_prod_live' };
  },
  saveConfig: (config: AppConfig) => {
    localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify(config));
  },

  // User
  getUser: (telegramId: string = "current_user"): User => {
    const saved = localStorage.getItem(DB_KEYS.USER);
    if (saved) return JSON.parse(saved);
    
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      telegramId,
      username: 'CryptoExplorer',
      balance: 5.0,
      referralCode: 'OLO_' + Math.random().toString(36).toUpperCase().substr(2, 5),
      referralsCount: 0,
      miningStartTime: null,
      isBanned: false,
    };
    localStorage.setItem(DB_KEYS.USER, JSON.stringify(newUser));
    return newUser;
  },
  saveUser: (user: User) => {
    localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
    // Also update in all users list for admin
    const users = mockDb.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(DB_KEYS.ALL_USERS, JSON.stringify(users));
  },
  getAllUsers: (): User[] => {
    const saved = localStorage.getItem(DB_KEYS.ALL_USERS);
    if (saved) return JSON.parse(saved);
    const currentUser = mockDb.getUser();
    return [currentUser];
  },
  saveAllUsers: (users: User[]) => {
    localStorage.setItem(DB_KEYS.ALL_USERS, JSON.stringify(users));
  },

  // Tasks
  getTasks: (): Task[] => {
    const saved = localStorage.getItem(DB_KEYS.TASKS);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  },
  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(DB_KEYS.TASKS, JSON.stringify(tasks));
  },

  // Withdrawals
  getWithdrawals: (): Withdrawal[] => {
    const saved = localStorage.getItem(DB_KEYS.WITHDRAWALS);
    return saved ? JSON.parse(saved) : [];
  },
  saveWithdrawals: (list: Withdrawal[]) => {
    localStorage.setItem(DB_KEYS.WITHDRAWALS, JSON.stringify(list));
  },

  // Admin Session
  isAdmin: () => localStorage.getItem(DB_KEYS.ADMIN) === 'true',
  setAdmin: (val: boolean) => localStorage.setItem(DB_KEYS.ADMIN, val ? 'true' : 'false')
};

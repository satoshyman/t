
import React, { useState, useEffect } from 'react';
import { mockDb } from '../services/mockDatabase';
import { AppConfig, Withdrawal, Task, User } from '../types';

type AdminTab = 'stats' | 'users' | 'withdrawals' | 'tasks' | 'mining' | 'ads';

const Admin: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(mockDb.isAdmin());
  const [pinCode, setPinCode] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('stats');
  
  // Data State
  const [config, setConfig] = useState<AppConfig>(mockDb.getConfig());
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(mockDb.getWithdrawals());
  const [tasks, setTasks] = useState<Task[]>(mockDb.getTasks());
  const [users, setUsers] = useState<User[]>(mockDb.getAllUsers());

  // Task Form State
  const [newTask, setNewTask] = useState({ title: '', description: '', reward: 1, link: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === '8822') { 
      mockDb.setAdmin(true);
      setIsAdmin(true);
    } else {
      alert('Access Denied');
      setPinCode('');
    }
  };

  // Config Handlers
  const handleUpdateConfig = (key: keyof AppConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    mockDb.saveConfig(newConfig);
  };

  // User Handlers
  const toggleBan = (id: string) => {
    const updated = users.map(u => u.id === id ? { ...u, isBanned: !u.isBanned } : u);
    setUsers(updated);
    mockDb.saveAllUsers(updated);
  };

  const adjustBalance = (id: string, amount: number) => {
    const updated = users.map(u => u.id === id ? { ...u, balance: Math.max(0, u.balance + amount) } : u);
    setUsers(updated);
    mockDb.saveAllUsers(updated);
    // If it's current user, update session
    const currentUser = mockDb.getUser();
    if (currentUser.id === id) {
      mockDb.saveUser(updated.find(u => u.id === id)!);
    }
  };

  // Withdrawal Handlers
  const updateWithdrawalStatus = (id: string, status: Withdrawal['status']) => {
    const updated = withdrawals.map(w => w.id === id ? { ...w, status } : w);
    setWithdrawals(updated);
    mockDb.saveWithdrawals(updated);
  };

  // Task Handlers
  const addTask = () => {
    if (!newTask.title) return;
    const task: Task = { 
      id: 'task_' + Math.random().toString(36).substr(2, 9), 
      ...newTask, 
      isCompleted: false 
    };
    const updated = [...tasks, task];
    setTasks(updated);
    mockDb.saveTasks(updated);
    setNewTask({ title: '', description: '', reward: 1, link: '' });
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    mockDb.saveTasks(updated);
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
        <div className="glass p-8 rounded-[2rem] w-full max-w-sm flex flex-col gap-8 relative overflow-hidden">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <i className="fa-solid fa-lock text-2xl"></i>
            </div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Terminal Alpha</h1>
            <p className="text-gray-500 text-[10px] mt-2 uppercase tracking-[0.3em] font-black">Auth Required</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <input 
              type="password" 
              inputMode="numeric"
              maxLength={4}
              placeholder="••••" 
              className="bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-red-500/50 text-center text-3xl tracking-[1em] font-mono transition-all"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
            />
            <button type="submit" className="bg-white text-black font-black py-4 rounded-2xl active:scale-95 transition-all shadow-lg">ENTER TERMINAL</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="glass p-4 rounded-3xl flex items-center justify-between border-b border-red-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg"><i className="fa-solid fa-ghost"></i></div>
          <div>
            <h1 className="font-black text-sm uppercase">ADMIN CORE</h1>
            <span className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">Master Session</span>
          </div>
        </div>
        <button onClick={() => { mockDb.setAdmin(false); setIsAdmin(false); }} className="p-3 bg-white/5 rounded-xl text-red-500"><i className="fa-solid fa-power-off"></i></button>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 px-1">
        {[
          { id: 'stats', icon: 'fa-chart-pie' },
          { id: 'users', icon: 'fa-users-gear' },
          { id: 'withdrawals', icon: 'fa-money-bill-transfer' },
          { id: 'tasks', icon: 'fa-list-check' },
          { id: 'mining', icon: 'fa-microchip' },
          { id: 'ads', icon: 'fa-rectangle-ad' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AdminTab)}
            className={`flex-shrink-0 px-4 py-3 rounded-2xl flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-[#00f2ff] text-black font-black' : 'glass text-gray-400'}`}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            <span className="text-[10px] uppercase">{tab.id}</span>
          </button>
        ))}
      </div>

      <div className="mt-2">
        {activeTab === 'stats' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-6 rounded-[2rem] border-l-4 border-blue-500">
              <span className="text-[9px] text-gray-500 font-black uppercase">Active Users</span>
              <div className="text-3xl font-black mt-1">{users.length}</div>
            </div>
            <div className="glass p-6 rounded-[2rem] border-l-4 border-[#00f2ff]">
              <span className="text-[9px] text-gray-500 font-black uppercase">Pending Payouts</span>
              <div className="text-3xl font-black mt-1 text-amber-500">{withdrawals.filter(w => w.status === 'pending').length}</div>
            </div>
            <div className="glass p-6 rounded-[2rem] border-l-4 border-emerald-500 col-span-2">
              <span className="text-[9px] text-gray-500 font-black uppercase">Total OLO Mined</span>
              <div className="text-3xl font-black mt-1 text-[#00f2ff]">{(users.reduce((acc, u) => acc + u.balance, 0)).toFixed(2)}</div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-black uppercase px-2">Member Database</h2>
            {users.map(u => (
              <div key={u.id} className={`glass p-5 rounded-[2rem] flex flex-col gap-4 border ${u.isBanned ? 'border-red-500/40 opacity-70' : 'border-white/5'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center font-black">{u.username[0]}</div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black">{u.username} {u.id === mockDb.getUser().id && '(You)'}</span>
                      <span className="text-[8px] font-mono text-gray-500">ID: {u.telegramId}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#00f2ff]">{u.balance.toFixed(2)} OLO</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => adjustBalance(u.id, 10)} className="flex-1 py-2 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase rounded-xl">+10 OLO</button>
                  <button onClick={() => adjustBalance(u.id, -10)} className="flex-1 py-2 bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase rounded-xl">-10 OLO</button>
                  <button onClick={() => toggleBan(u.id)} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-xl ${u.isBanned ? 'bg-white text-black' : 'bg-red-500/10 text-red-400'}`}>
                    {u.isBanned ? 'UNBAN' : 'BAN'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-black uppercase px-2">Payout Requests</h2>
            {withdrawals.length === 0 ? <p className="text-center p-10 opacity-30 text-xs">Queue is clear</p> : withdrawals.map(w => (
              <div key={w.id} className="glass p-5 rounded-[2rem] flex flex-col gap-4 border-white/5">
                <div className="flex justify-between">
                  <span className="text-[10px] font-mono text-gray-500">{w.walletAddress.slice(0,10)}...</span>
                  <span className="text-sm font-black text-emerald-400">{w.amount} OLO</span>
                </div>
                {w.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button onClick={() => updateWithdrawalStatus(w.id, 'completed')} className="flex-1 py-3 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase rounded-xl">Approve</button>
                    <button onClick={() => updateWithdrawalStatus(w.id, 'rejected')} className="flex-1 py-3 bg-red-500/20 text-red-400 text-[10px] font-black uppercase rounded-xl">Reject</button>
                  </div>
                ) : <div className={`text-center py-2 rounded-xl text-[10px] font-black uppercase ${w.status === 'completed' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>{w.status}</div>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="flex flex-col gap-4">
            <div className="glass p-6 rounded-[2rem] flex flex-col gap-4 border-emerald-500/20">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#00f2ff]">Forge New Task</h3>
              <input placeholder="Task Title" className="bg-black/40 p-4 rounded-2xl text-xs outline-none" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              <input placeholder="Reward Amount (OLO)" type="number" className="bg-black/40 p-4 rounded-2xl text-xs outline-none" value={newTask.reward} onChange={e => setNewTask({...newTask, reward: Number(e.target.value)})} />
              <input placeholder="Link (URL)" className="bg-black/40 p-4 rounded-2xl text-xs outline-none" value={newTask.link} onChange={e => setNewTask({...newTask, link: e.target.value})} />
              <button onClick={addTask} className="bg-[#00f2ff] text-black font-black py-4 rounded-2xl text-xs uppercase">Add to Network</button>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-black uppercase px-2">Active Tasks</h2>
              {tasks.map(t => (
                <div key={t.id} className="glass p-4 rounded-[1.5rem] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-black">{t.title}</span>
                    <span className="text-[9px] text-gray-500">{t.reward} OLO</span>
                  </div>
                  <button onClick={() => deleteTask(t.id)} className="text-red-500 p-2"><i className="fa-solid fa-trash-can"></i></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mining' && (
          <div className="glass p-6 rounded-[2.5rem] flex flex-col gap-6">
            <h2 className="text-xs font-black uppercase tracking-widest">Mining Parameters</h2>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-gray-500 uppercase">Hourly Yield Rate (OLO)</label>
              <input type="number" value={config.miningRate} onChange={e => handleUpdateConfig('miningRate', Number(e.target.value))} className="bg-black/40 p-4 rounded-2xl text-xs font-mono" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-gray-500 uppercase">Cycle Duration (Seconds)</label>
              <input type="number" value={config.miningDuration} onChange={e => handleUpdateConfig('miningDuration', Number(e.target.value))} className="bg-black/40 p-4 rounded-2xl text-xs font-mono" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-gray-500 uppercase">Friend Referral Reward</label>
              <input type="number" value={config.referralReward} onChange={e => handleUpdateConfig('referralReward', Number(e.target.value))} className="bg-black/40 p-4 rounded-2xl text-xs font-mono" />
            </div>
          </div>
        )}

        {activeTab === 'ads' && (
          <div className="glass p-6 rounded-[2.5rem] flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-rectangle-ad text-purple-400 text-xl"></i>
              <h2 className="text-xs font-black uppercase tracking-widest">Ad Network Integration</h2>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-gray-500 uppercase">Monetag Zone ID</label>
              <input type="text" value={config.monetagId || ''} onChange={e => handleUpdateConfig('monetagId', e.target.value)} className="bg-black/40 p-4 rounded-2xl text-xs font-mono text-purple-300" placeholder="e.g. 7823941" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-gray-500 uppercase">AdsGram Secret Key</label>
              <input type="text" value={config.adsgramId || ''} onChange={e => handleUpdateConfig('adsgramId', e.target.value)} className="bg-black/40 p-4 rounded-2xl text-xs font-mono text-blue-300" placeholder="e.g. olo_prod_live" />
            </div>
            <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest leading-relaxed">Changes to ad keys are reflected across all user clients immediately upon reload.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

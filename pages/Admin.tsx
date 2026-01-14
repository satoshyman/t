
import React, { useState } from 'react';
import { mockDb } from '../services/mockDatabase';
import { AppConfig, Withdrawal, Task, User } from '../types';

type AdminTab = 'stats' | 'users' | 'withdrawals' | 'tasks' | 'mining' | 'ads';

const Admin: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(mockDb.isAdmin());
  const [pinCode, setPinCode] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('stats');
  
  const [config, setConfig] = useState<AppConfig>(mockDb.getConfig());
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(mockDb.getWithdrawals());
  const [tasks, setTasks] = useState<Task[]>(mockDb.getTasks());
  const [users, setUsers] = useState<User[]>(mockDb.getAllUsers());

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === '8822') { 
      mockDb.setAdmin(true);
      setIsAdmin(true);
    } else {
      alert('رمز الدخول خاطئ');
      setPinCode('');
    }
  };

  const updateStatus = (id: string, status: Withdrawal['status']) => {
    const updated = withdrawals.map(w => w.id === id ? { ...w, status } : w);
    setWithdrawals(updated);
    mockDb.saveWithdrawals(updated);
  };

  const handleUpdateConfig = (key: keyof AppConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    mockDb.saveConfig(newConfig);
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <div className="glass p-8 rounded-[2rem] w-full max-w-sm flex flex-col gap-6">
          <i className="fa-solid fa-lock text-4xl text-red-500 animate-pulse"></i>
          <h1 className="text-xl font-black">منطقة محظورة</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              placeholder="رمز الدخول (PIN)" 
              className="bg-black/40 p-4 rounded-2xl text-center text-2xl font-mono border border-white/10"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
            />
            <button type="submit" className="bg-white text-black font-black py-4 rounded-2xl">دخول المدير</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-24" dir="rtl">
      {/* القائمة العلوية */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'stats', name: 'إحصائيات', icon: 'fa-chart-line' },
          { id: 'users', name: 'الأعضاء', icon: 'fa-users' },
          { id: 'withdrawals', name: 'السحوبات', icon: 'fa-money-check-dollar' },
          { id: 'tasks', name: 'المهام', icon: 'fa-tasks' },
          { id: 'ads', name: 'الإعلانات', icon: 'fa-ad' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AdminTab)}
            className={`flex-shrink-0 px-4 py-3 rounded-2xl flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-[#00f2ff] text-black font-bold' : 'glass text-gray-400'}`}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            <span className="text-xs">{tab.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-2">
        {activeTab === 'stats' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-6 rounded-[2rem]">
              <span className="text-[10px] text-gray-400">إجمالي المستخدمين</span>
              <div className="text-3xl font-black text-blue-400">{users.length}</div>
            </div>
            <div className="glass p-6 rounded-[2rem]">
              <span className="text-[10px] text-gray-400">سحوبات معلقة</span>
              <div className="text-3xl font-black text-yellow-500">{withdrawals.filter(w => w.status === 'pending').length}</div>
            </div>
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold mr-2">إدارة طلبات السحب</h2>
            {withdrawals.map(w => (
              <div key={w.id} className="glass p-5 rounded-[2rem] border border-white/5">
                <div className="flex justify-between mb-3">
                  <span className="text-xs font-mono opacity-50">{w.walletAddress.slice(0,12)}...</span>
                  <span className="text-sm font-black text-emerald-400">{w.amount} OLO</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(w.id, 'completed')} className="flex-1 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold">موافق (أخضر)</button>
                  <button onClick={() => updateStatus(w.id, 'rejected')} className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-xl text-xs font-bold">رفض (أحمر)</button>
                </div>
                {w.status === 'pending' && <div className="mt-2 text-center text-[10px] text-yellow-500 font-bold uppercase">قيد المراجعة (أصفر)</div>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ads' && (
          <div className="glass p-6 rounded-[2.5rem] flex flex-col gap-4">
            <h2 className="text-sm font-bold">شفرات الإعلانات</h2>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-gray-500 mr-2">Monetag Zone ID</label>
              <input type="text" value={config.monetagId} onChange={e => handleUpdateConfig('monetagId', e.target.value)} className="bg-black/40 p-3 rounded-xl text-xs" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-gray-500 mr-2">Adsgram ID</label>
              <input type="text" value={config.adsgramId} onChange={e => handleUpdateConfig('adsgramId', e.target.value)} className="bg-black/40 p-3 rounded-xl text-xs" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

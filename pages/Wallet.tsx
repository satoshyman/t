
import React, { useState, useEffect } from 'react';
import { mockDb } from '../services/mockDatabase';
import { Withdrawal, User, AppConfig } from '../types';

const Wallet: React.FC = () => {
  const [user, setUser] = useState<User>(mockDb.getUser());
  const [config] = useState<AppConfig>(mockDb.getConfig());
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(mockDb.getWithdrawals());
  const [address, setAddress] = useState(user.walletAddress || '');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const usdtBalance = (user.balance / config.conversionRate).toFixed(2);

  const handleWithdraw = () => {
    setMessage(null);
    const numAmount = parseFloat(amount);

    // BEP20 Validation (0x followed by 40 hex chars)
    const bep20Regex = /^0x[a-fA-F0-9]{40}$/;
    if (!bep20Regex.test(address)) {
      setMessage({ type: 'error', text: 'Invalid BEP20 Wallet Address' });
      return;
    }

    if (!amount || isNaN(numAmount) || numAmount < config.minWithdrawal) {
      setMessage({ type: 'error', text: `Minimum withdrawal is ${config.minWithdrawal} OLO` });
      return;
    }

    if (numAmount > user.balance) {
      setMessage({ type: 'error', text: 'Insufficient OLO balance' });
      return;
    }

    setLoading(true);
    
    // Simulate Blockchain Processing
    setTimeout(() => {
      const newWithdrawal: Withdrawal = {
        id: 'wdr_' + Math.random().toString(36).substr(2, 9),
        userId: user.id,
        amount: numAmount,
        walletAddress: address,
        status: 'pending',
        createdAt: Date.now()
      };

      const updatedUser = { 
        ...user, 
        balance: user.balance - numAmount,
        walletAddress: address 
      };

      const updatedWithdrawals = [newWithdrawal, ...withdrawals];
      
      setUser(updatedUser);
      setWithdrawals(updatedWithdrawals);
      mockDb.saveUser(updatedUser);
      mockDb.saveWithdrawals(updatedWithdrawals);
      
      setLoading(false);
      setMessage({ type: 'success', text: 'Withdrawal request submitted for review!' });
      setAmount('');
    }, 2000);
  };

  const getStatusStyle = (status: Withdrawal['status']) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Visual Balance Card */}
      <div className="relative overflow-hidden glass p-8 rounded-[3rem] border-[#00f2ff]/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#00f2ff]/10 rounded-full blur-[60px] -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#7000ff]/10 rounded-full blur-[60px] -ml-16 -mb-16"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center gap-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Secure Vault</span>
          </div>
          
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Available Assets</span>
          <div className="flex items-center gap-3">
            <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
              {user.balance.toFixed(2)}
            </span>
            <span className="text-lg font-black text-[#00f2ff]">OLO</span>
          </div>
          
          <div className="mt-4 glass bg-emerald-500/5 border-emerald-500/10 px-6 py-2 rounded-2xl flex items-center gap-3">
            <i className="fa-brands fa-ethereum text-emerald-400"></i>
            <span className="text-lg font-mono font-black text-emerald-400">≈ {usdtBalance} <span className="text-xs">USDT</span></span>
          </div>
        </div>
      </div>

      {/* Action Center */}
      <div className="glass p-6 rounded-[2.5rem] flex flex-col gap-5 border-white/5 shadow-xl">
        <div className="flex items-center gap-3 ml-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00f2ff] to-[#7000ff] flex items-center justify-center text-white shadow-lg">
            <i className="fa-solid fa-paper-plane text-sm"></i>
          </div>
          <div className="flex flex-col">
            <h2 className="font-black text-sm uppercase tracking-widest">Withdraw USDT</h2>
            <span className="text-[9px] text-gray-500 font-bold">Network: Binance Smart Chain (BEP20)</span>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in zoom-in duration-300 ${
            message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            <i className={`fa-solid ${message.type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check'}`}></i>
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <div className="group">
            <label className="text-[10px] uppercase font-black text-gray-500 ml-2 mb-1 block tracking-widest">Receiver Address</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="0x..." 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-black/20 border border-white/5 p-4 rounded-2xl text-xs outline-none focus:border-[#00f2ff]/50 transition-all font-mono placeholder:text-gray-700"
              />
              <i className="fa-solid fa-qrcode absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"></i>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center px-2 mb-1">
              <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Amount to Withdraw</label>
              <button 
                onClick={() => setAmount(user.balance.toString())} 
                className="text-[10px] text-[#00f2ff] font-black hover:underline"
              >
                MAX: {user.balance.toFixed(0)}
              </button>
            </div>
            <div className="relative">
              <input 
                type="number" 
                placeholder={`Min. ${config.minWithdrawal} OLO`} 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black/20 border border-white/5 p-4 rounded-2xl text-xs outline-none focus:border-[#00f2ff]/50 transition-all placeholder:text-gray-700"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-500 uppercase">OLO</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleWithdraw}
          disabled={loading || !amount || parseFloat(amount) <= 0}
          className="w-full py-5 bg-white text-black font-black text-sm rounded-[1.5rem] shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
          ) : (
            <>
              <i className="fa-solid fa-bolt-lightning"></i>
              REQUEST PAYOUT
            </>
          )}
        </button>
        
        <p className="text-[9px] text-gray-500 text-center font-bold uppercase tracking-tighter">
          Transactions are typically processed within 24-48 hours.
        </p>
      </div>

      {/* Transaction History */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400">Activity Log</h2>
          <span className="text-[9px] font-black text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/20">LIVE DATA</span>
        </div>
        
        {withdrawals.length === 0 ? (
          <div className="glass p-12 rounded-[2.5rem] flex flex-col items-center gap-3 opacity-30 border-dashed border-white/5">
            <i className="fa-solid fa-clock-rotate-left text-3xl"></i>
            <span className="text-[10px] font-black uppercase tracking-widest">No transaction history found</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {withdrawals.map((w) => (
              <div key={w.id} className="glass p-5 rounded-[2rem] flex items-center justify-between border-white/5 group hover:border-white/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${
                    w.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 
                    w.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    <i className={`fa-solid ${w.status === 'completed' ? 'fa-check-double' : w.status === 'rejected' ? 'fa-xmark' : 'fa-hourglass-half'}`}></i>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black">Withdrawal</span>
                    <span className="text-[9px] text-gray-500 font-mono">{w.walletAddress.slice(0, 6)}...{w.walletAddress.slice(-4)}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-white">-{w.amount}</span>
                    <span className="text-[8px] font-bold text-gray-500">OLO</span>
                  </div>
                  <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full border ${getStatusStyle(w.status)}`}>
                    {w.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;

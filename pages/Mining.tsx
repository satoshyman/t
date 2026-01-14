
import React, { useState, useEffect } from 'react';
import { OLOLogo } from '../constants';
import { mockDb } from '../services/mockDatabase';
import { User, AppConfig } from '../types';

const Mining: React.FC = () => {
  const [user, setUser] = useState<User>(mockDb.getUser());
  const [config] = useState<AppConfig>(mockDb.getConfig());
  const [timeLeft, setTimeLeft] = useState(0);
  const [isClaimable, setIsClaimable] = useState(false);

  useEffect(() => {
    const tick = setInterval(() => {
      if (user.miningStartTime) {
        const elapsed = Math.floor((Date.now() - user.miningStartTime) / 1000);
        const remain = config.miningDuration - elapsed;
        if (remain <= 0) {
          setTimeLeft(0);
          setIsClaimable(true);
        } else {
          setTimeLeft(remain);
          setIsClaimable(false);
        }
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [user.miningStartTime]);

  const startMining = () => {
    const updated = { ...user, miningStartTime: Date.now() };
    setUser(updated);
    mockDb.saveUser(updated);
  };

  const claim = () => {
    const updated = { ...user, balance: user.balance + config.miningRate, miningStartTime: null };
    setUser(updated);
    mockDb.saveUser(updated);
    setIsClaimable(false);
    alert('تم استلام 10 OLO بنجاح! 🎉');
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-8 text-center" dir="rtl">
      <div className="glass p-6 rounded-[2rem] w-full">
        <span className="text-xs text-gray-400 font-bold">رصيدك الحالي</span>
        <div className="text-4xl font-black text-[#00f2ff]">{user.balance.toFixed(2)} OLO</div>
        <div className="text-xs text-emerald-400 mt-1">≈ {(user.balance / config.conversionRate).toFixed(2)} USDT</div>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <div className={`absolute inset-0 rounded-full blur-3xl transition-all ${user.miningStartTime ? 'bg-[#00f2ff]/20 animate-pulse' : 'bg-white/5'}`}></div>
        <OLOLogo size={180} active={user.miningStartTime && !isClaimable} />
      </div>

      <div className="w-full flex flex-col gap-4">
        {user.miningStartTime ? (
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-mono font-black">{isClaimable ? 'جاهز!' : formatTime(timeLeft)}</span>
            <span className="text-xs text-gray-400 font-bold">{isClaimable ? 'انقر للاستلام' : 'جاري استخراج OLO...'}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">اربح 10 OLO كل ساعة مجاناً</span>
        )}

        <button 
          onClick={isClaimable ? claim : (user.miningStartTime ? undefined : startMining)}
          disabled={user.miningStartTime && !isClaimable}
          className={`w-full py-5 rounded-2xl font-black text-lg transition-all ${isClaimable ? 'bg-emerald-500 text-white shadow-emerald-500/30' : user.miningStartTime ? 'bg-white/5 text-gray-600' : 'bg-white text-black'}`}
        >
          {isClaimable ? 'استلام الأرباح' : user.miningStartTime ? 'التعدين يعمل...' : 'ابدأ التعدين الآن'}
        </button>
      </div>
    </div>
  );
};

export default Mining;

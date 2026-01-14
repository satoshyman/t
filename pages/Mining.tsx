
import React, { useState, useEffect, useRef } from 'react';
import { OLOLogo, COLORS } from '../constants';
import { mockDb } from '../services/mockDatabase';
import { User, AppConfig } from '../types';

const Mining: React.FC = () => {
  const [user, setUser] = useState<User>(mockDb.getUser());
  const [config] = useState<AppConfig>(mockDb.getConfig());
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [sessionEarnings, setSessionEarnings] = useState<number>(0);
  const [isClaimable, setIsClaimable] = useState<boolean>(false);
  const [showCongrats, setShowCongrats] = useState<boolean>(false);
  
  const timerRef = useRef<number | null>(null);

  // Constants for SVG progress circle
  const RADIUS = 120;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~754

  useEffect(() => {
    updateTimer();
    timerRef.current = window.setInterval(updateTimer, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [user.miningStartTime]);

  const updateTimer = () => {
    if (!user.miningStartTime) {
      setTimeLeft(0);
      setSessionEarnings(0);
      setIsClaimable(false);
      return;
    }

    const now = Date.now();
    const elapsed = Math.floor((now - user.miningStartTime) / 1000);
    const remaining = config.miningDuration - elapsed;

    if (remaining <= 0) {
      setTimeLeft(0);
      setSessionEarnings(config.miningRate);
      setIsClaimable(true);
    } else {
      setTimeLeft(remaining);
      const progressRatio = Math.min(1, elapsed / config.miningDuration);
      setSessionEarnings(progressRatio * config.miningRate);
      setIsClaimable(false);
    }
  };

  const startMining = () => {
    const updatedUser = { ...user, miningStartTime: Date.now() };
    setUser(updatedUser);
    mockDb.saveUser(updatedUser);
  };

  const claimMining = () => {
    const reward = config.miningRate;
    const updatedUser = { 
      ...user, 
      balance: user.balance + reward, 
      miningStartTime: null 
    };
    setUser(updatedUser);
    mockDb.saveUser(updatedUser);
    setIsClaimable(false);
    setSessionEarnings(0);
    setShowCongrats(true);
    setTimeout(() => setShowCongrats(false), 5000);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = user.miningStartTime 
    ? Math.min(100, (1 - timeLeft / config.miningDuration) * 100) 
    : 0;

  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  // Particle Component - Energy Suction Effect
  const EnergyField = () => {
    if (!user.miningStartTime || isClaimable) return null;
    return (
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {/* Ripples */}
        <div className="ripple" style={{ width: '200px', height: '200px', left: 'calc(50% - 100px)', top: 'calc(50% - 100px)', animationDelay: '0s' }}></div>
        <div className="ripple" style={{ width: '200px', height: '200px', left: 'calc(50% - 100px)', top: 'calc(50% - 100px)', animationDelay: '1s' }}></div>
        
        {/* Suction Particles */}
        {[...Array(16)].map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const distance = 140 + Math.random() * 40;
          const tx = Math.cos(angle) * distance;
          const ty = Math.sin(angle) * distance;
          return (
            <div 
              key={i} 
              className="particle" 
              style={{ 
                left: '50%', 
                top: '50%', 
                '--tx': `${tx}px`, 
                '--ty': `${ty}px`, 
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${1 + Math.random()}s`
              } as any}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-2 pb-6">
      {/* Top Banner with Pulse */}
      <div className="w-full flex justify-center">
        <div className="glass px-4 py-1 rounded-full flex items-center gap-2 border-[#00f2ff]/20">
          <div className={`w-2 h-2 rounded-full ${user.miningStartTime && !isClaimable ? 'bg-[#00f2ff] animate-pulse shadow-[0_0_8px_#00f2ff]' : 'bg-gray-600'}`}></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
            {isClaimable ? 'Reactor Stabilized' : user.miningStartTime ? 'OLO Extraction Active' : 'System Standby'}
          </span>
        </div>
      </div>

      {/* Main Stats Card */}
      <div className="w-full glass p-6 rounded-[2.5rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f2ff]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#7000ff]/5 rounded-full blur-3xl -ml-16 -mb-16"></div>
        
        <div className="relative flex flex-col items-center gap-1 z-10 text-center">
          <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Asset Reservoir</span>
          <div className="flex items-center gap-3">
            <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 leading-tight">
              {user.balance.toFixed(2)}
            </span>
            <div className="flex flex-col items-start leading-none mt-1">
              <span className="text-sm font-black text-[#00f2ff]">OLO</span>
              <span className="text-[9px] text-gray-500 font-bold">UNIT</span>
            </div>
          </div>
          
          {user.miningStartTime && (
            <div className="mt-2 flex items-center gap-2 text-emerald-400 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10 transition-all duration-300">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Cycle Gain:</span>
              <span className="text-sm font-mono font-black glow-text">+{sessionEarnings.toFixed(4)}</span>
            </div>
          )}

          <div className="mt-3 glass bg-white/5 border-none px-4 py-1.5 rounded-2xl flex items-center gap-2 inline-flex">
            <i className="fa-solid fa-chart-line text-[10px] text-emerald-400"></i>
            <span className="text-xs font-mono font-bold text-gray-300">≈ ${(user.balance / config.conversionRate).toFixed(2)} USDT</span>
          </div>
        </div>
      </div>

      {/* Enhanced Advanced Mining Hub */}
      <div className="relative w-80 h-80 flex items-center justify-center mt-2">
        <EnergyField />

        {/* Outer Tech Shells */}
        <div className="absolute inset-0 rounded-full border border-white/5 scale-[1.1]"></div>
        <div className={`absolute inset-0 rounded-full border border-dashed border-[#00f2ff]/10 scale-[1.2] ${user.miningStartTime ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '60s' }}></div>

        {/* Dynamic Glow Aura */}
        <div className={`absolute inset-0 rounded-full blur-[70px] transition-all duration-1000 ${user.miningStartTime && !isClaimable ? 'bg-[#00f2ff]/25 opacity-100 scale-100' : 'bg-white/5 opacity-50 scale-90'}`}></div>
        
        {/* Progress Ring with Comet Effect */}
        <svg 
          viewBox="0 0 288 288" 
          className={`absolute w-full h-full -rotate-90 filter drop-shadow-[0_0_20px_rgba(0,242,255,0.2)] ${user.miningStartTime && !isClaimable ? 'scale-105' : 'scale-100'} transition-transform duration-700`}
        >
          <defs>
            <linearGradient id="miningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: COLORS.primary }} />
              <stop offset="100%" style={{ stopColor: COLORS.secondary }} />
            </linearGradient>
            <filter id="headGlow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track */}
          <circle 
            cx="144" cy="144" r={RADIUS} 
            fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="14" 
          />
          
          {/* Main Progress Path */}
          <circle 
            cx="144" cy="144" r={RADIUS} 
            fill="none" stroke="url(#miningGradient)" strokeWidth="14" 
            strokeDasharray={CIRCUMFERENCE} 
            strokeDashoffset={offset} 
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
          
          {/* Glowing Head Dot with Comet Tail */}
          {user.miningStartTime && progress > 0 && (
            <g transform={`rotate(${(progress / 100) * 360}, 144, 144)`}>
              {/* Tail Effect */}
              <circle cx={144 + RADIUS} cy="144" r="12" fill="url(#miningGradient)" opacity="0.3" filter="blur(8px)" />
              {/* Head */}
              <circle cx={144 + RADIUS} cy="144" r="10" fill="#00f2ff" filter="url(#headGlow)" />
              <circle cx={144 + RADIUS} cy="144" r="5" fill="white" />
            </g>
          )}
        </svg>

        {/* Dynamic Logo Core - Highly Reactive */}
        <div className={`z-10 transition-all duration-700 ${user.miningStartTime && !isClaimable ? 'mining-animate scale-110' : 'opacity-80 scale-100'}`}>
          <OLOLogo size={200} active={user.miningStartTime && !isClaimable} />
        </div>

        {/* Percentage Floating Badge */}
        {user.miningStartTime && (
          <div className="absolute top-10 right-10 glass px-3 py-1 rounded-xl text-[10px] font-black text-[#00f2ff] border-[#00f2ff]/30 animate-bounce shadow-xl">
            {progress.toFixed(0)}%
          </div>
        )}
      </div>

      {/* Control Terminal UI */}
      <div className="w-full flex flex-col gap-6 mt-6">
        <div className="flex flex-col items-center gap-1">
          {user.miningStartTime ? (
            <>
              <div className={`text-4xl font-mono font-black tracking-[0.2em] transition-all duration-300 ${isClaimable ? 'text-emerald-400 glow-text' : 'text-white'}`}>
                {isClaimable ? 'HARVEST' : formatTime(timeLeft)}
              </div>
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mt-2">
                {isClaimable ? 'Extraction Complete' : 'Quantum Mining In Progress'}
              </span>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Potential Yield: <span className="text-white font-black">{config.miningRate} OLO / Hour</span></span>
              <div className="h-1 w-16 bg-white/10 rounded-full"></div>
            </div>
          )}
        </div>

        <button 
          onClick={isClaimable ? claimMining : (user.miningStartTime ? undefined : startMining)}
          disabled={user.miningStartTime && !isClaimable}
          className={`w-full py-5 rounded-[2.5rem] font-black text-xl transition-all transform active:scale-95 shadow-2xl relative overflow-hidden group ${
            isClaimable 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-emerald-500/40' 
              : user.miningStartTime 
                ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/10'
                : 'bg-white text-black shadow-white/30'
          }`}
        >
          {/* Interaction Effects */}
          {!user.miningStartTime && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000"></div>
          )}
          
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isClaimable ? (
              <><i className="fa-solid fa-cloud-download animate-bounce"></i> COLLECT REWARDS</>
            ) : user.miningStartTime ? (
              <><div className="w-2.5 h-2.5 bg-[#00f2ff] rounded-full animate-ping"></div> EXTRACTING...</>
            ) : (
              <><i className="fa-solid fa-power-off text-emerald-500"></i> INITIALIZE CORE</>
            )}
          </span>
        </button>
      </div>

      {/* Grid Stats */}
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="glass p-5 rounded-[2rem] flex flex-col gap-1 border-white/5 hover:border-[#00f2ff]/30 transition-all group">
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">Hash Strength</span>
          <div className="text-base font-black text-[#00f2ff] group-hover:scale-105 transition-transform origin-left">{config.miningRate}.0 H/s</div>
        </div>
        <div className="glass p-5 rounded-[2rem] flex flex-col gap-1 border-white/5 hover:border-emerald-500/30 transition-all group">
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">Est. 24H Yield</span>
          <div className="text-base font-black text-emerald-400 group-hover:scale-105 transition-transform origin-left">{config.miningRate * 24} OLO</div>
        </div>
      </div>

      {/* Reward Popup */}
      {showCongrats && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="glass p-10 rounded-[4rem] flex flex-col items-center gap-8 text-center max-w-sm border-[#00f2ff]/40 shadow-[0_0_100px_rgba(0,242,255,0.3)] animate-in zoom-in slide-in-from-bottom-24 duration-700">
            <div className="relative">
               <div className="absolute inset-0 bg-[#00f2ff] blur-3xl opacity-50 animate-pulse"></div>
               <div className="w-28 h-28 bg-gradient-to-br from-[#00f2ff] to-[#7000ff] rounded-full flex items-center justify-center text-6xl relative z-10 shadow-inner">
                 💎
               </div>
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-4xl font-black tracking-tight">Success!</h2>
              <p className="text-gray-400 text-base">New OLO tokens have been successfully added to your reservoir.</p>
              <div className="text-[#00f2ff] font-black text-3xl mt-2">+{config.miningRate} OLO</div>
            </div>
            <button onClick={() => setShowCongrats(false)} className="w-full py-5 bg-white text-black font-black rounded-[2rem] shadow-2xl active:scale-95 transition-all text-lg">
              AWESOME
            </button>
          </div>
        </div>
      )}

      {/* Integration Panel */}
      <div className="w-full h-24 glass rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden group mt-4">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
        <div className="flex flex-col items-center gap-1 opacity-50 group-hover:opacity-100 transition-all">
          <i className="fa-solid fa-satellite-dish text-base mb-1 text-[#00f2ff] animate-pulse"></i>
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">Global Network</span>
          <span className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Ad-Protocol Secure Channel</span>
        </div>
      </div>
    </div>
  );
};

export default Mining;

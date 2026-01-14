
import React, { useState } from 'react';
import { mockDb } from '../services/mockDatabase';

const Referrals: React.FC = () => {
  const [user] = useState(mockDb.getUser());
  const [copied, setCopied] = useState(false);

  const referralLink = `https://t.me/olo_mining_bot?start=${user.referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 text-center mt-4">
        <div className="w-20 h-20 bg-gradient-to-br from-[#00f2ff] to-[#7000ff] rounded-3xl flex items-center justify-center text-3xl shadow-2xl shadow-blue-500/20">
          <i className="fa-solid fa-user-plus text-white"></i>
        </div>
        <div>
          <h1 className="text-2xl font-black">Invite & Earn</h1>
          <p className="text-gray-400 text-sm max-w-xs mx-auto mt-1">Get <span className="text-white font-bold">1 OLO</span> instantly for every friend you invite to the app.</p>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Your Referral Link</span>
          <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="flex-1 truncate text-xs font-mono text-blue-300">{referralLink}</span>
            <button onClick={copyToClipboard} className="text-[#00f2ff] hover:text-white">
              <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
            </button>
          </div>
        </div>
        
        <button onClick={copyToClipboard} className="w-full py-3 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] rounded-xl font-black text-sm uppercase tracking-widest shadow-lg">
          {copied ? 'COPIED!' : 'SHARE LINK'}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="font-black text-sm uppercase tracking-widest">Friends ({user.referralsCount})</h2>
          <span className="text-[10px] text-[#00f2ff] font-bold">TOTAL EARNED: {user.referralsCount} OLO</span>
        </div>

        {user.referralsCount === 0 ? (
          <div className="glass p-10 rounded-3xl flex flex-col items-center gap-2 opacity-50">
            <i className="fa-solid fa-users-slash text-4xl mb-2"></i>
            <span className="text-sm font-medium">No friends yet</span>
            <span className="text-[10px]">Invite your friends to start earning!</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {/* Mock list of friends */}
            {[...Array(user.referralsCount)].map((_, i) => (
              <div key={i} className="glass px-4 py-3 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-300">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">User_{Math.floor(Math.random() * 9000) + 1000}</span>
                    <span className="text-[8px] text-gray-500">Joined via your link</span>
                  </div>
                </div>
                <div className="text-[10px] font-black text-emerald-400">+1 OLO</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ad Placeholder */}
      <div className="w-full h-24 glass rounded-2xl flex items-center justify-center text-xs text-gray-500 uppercase tracking-widest overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        Advertisement by AdsGram
      </div>
    </div>
  );
};

export default Referrals;

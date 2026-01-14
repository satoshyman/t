
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    const newClicks = logoClicks + 1;
    if (newClicks >= 5) {
      setLogoClicks(0);
      navigate('/admin');
    } else {
      setLogoClicks(newClicks);
      setTimeout(() => setLogoClicks(0), 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative pb-24 text-right" dir="rtl">
      <header className="p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00f2ff] to-[#7000ff] flex items-center justify-center font-bold text-xs">OLO</div>
          <span className="font-bold tracking-tight">تعدين أولو</span>
        </div>
        <div className="glass px-3 py-1 rounded-full text-[10px] font-bold text-blue-300">شبكة BEP-20</div>
      </header>

      <main className="flex-1 p-4 z-10 relative">
        {children}
      </main>

      <nav className="fixed bottom-4 left-4 right-4 h-16 glass rounded-2xl flex items-center justify-around z-50">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 transition-all flex-1 ${isActive ? 'text-[#00f2ff] scale-110' : 'text-gray-400 opacity-60'}`}>
          <i className="fa-solid fa-microchip text-xl"></i>
          <span className="text-[10px] font-bold">تعدين</span>
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => `flex flex-col items-center gap-1 transition-all flex-1 ${isActive ? 'text-[#00f2ff] scale-110' : 'text-gray-400 opacity-60'}`}>
          <i className="fa-solid fa-list-check text-xl"></i>
          <span className="text-[10px] font-bold">مهام</span>
        </NavLink>
        <NavLink to="/referrals" className={({ isActive }) => `flex flex-col items-center gap-1 transition-all flex-1 ${isActive ? 'text-[#00f2ff] scale-110' : 'text-gray-400 opacity-60'}`}>
          <i className="fa-solid fa-users text-xl"></i>
          <span className="text-[10px] font-bold">أصدقاء</span>
        </NavLink>
        <NavLink to="/wallet" className={({ isActive }) => `flex flex-col items-center gap-1 transition-all flex-1 ${isActive ? 'text-[#00f2ff] scale-110' : 'text-gray-400 opacity-60'}`}>
          <i className="fa-solid fa-wallet text-xl"></i>
          <span className="text-[10px] font-bold">محفظة</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;

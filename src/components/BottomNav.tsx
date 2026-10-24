import React from 'react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'goals', label: 'Goals', icon: 'flag' },
    { id: 'planner', label: 'Planner', icon: 'calendar_today' },
    { id: 'focus', label: 'Focus', icon: 'timer' },
    { id: 'analytics', label: 'Analytics', icon: 'insights' },
    { id: 'ai-coach', label: 'AI Coach', icon: 'psychology' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#0c0e17]/90 backdrop-blur-2xl border-t border-white/[0.07] shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
      <div className="max-w-4xl mx-auto flex justify-around items-center h-16 px-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[52px] min-h-[46px] px-1 transition-all rounded-lg ${
                isActive
                  ? 'text-[#c0c1ff] font-semibold relative after:content-[""] after:absolute after:bottom-1 after:w-1 after:h-1 after:rounded-full after:bg-[#c0c1ff] shadow-[0_0_12px_rgba(192,193,255,0.2)]'
                  : 'text-[#c7c4d7]/70 hover:text-white hover:bg-white/[0.03] active:scale-95'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] transition-transform ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] tracking-tight leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { currentTab, profile, openModal } = useApp();

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard';
      case 'goals':
        return 'Goals';
      case 'planner':
        return 'Planner';
      case 'focus':
        return 'Deep Focus';
      case 'analytics':
        return 'Analytics';
      case 'ai-coach':
        return 'AI Coach';
      default:
        return 'Command';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#11131c]/85 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_8px_rgba(0,0,0,0.2)]">
      <div className="h-16 max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo and Title */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <img
            alt="LifeOS AI Emblem"
            className="h-8 w-auto object-contain drop-shadow-[0_0_8px_rgba(192,193,255,0.4)]"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UZ4a3vj7NJc251c2bxX_QJcg5tecO2arPMgxqwtX_1ZLS7s7hdG3Me9W2y5VVj6bDcOMDdNkiYbJ6EpYPdjSrL-TJNALLWSgrtwXTr__5k7mioaQc6rD0dP4z1cPHcy_u-E3Q-kQyOD2frIURPAxH3pLFVSNvDEUUV2l6y0OZ3iirGQ-jbKHiWNzdsNPyYZrdEde8NmkRidF2A2XpphPbLDyA8w5RjiL_72VSzBI-6jYD9Qn-I0EOsAXM"
          />
          <div className="flex items-baseline gap-1.5">
            <span className="font-headline font-semibold text-lg text-white tracking-tight">LifeOS</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-semibold tracking-wider">AI</span>
          </div>
        </div>

        {/* Current Context Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#282933]/70 backdrop-blur-md border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff] animate-pulse"></span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#c7c4d7]">
            {getTabLabel(currentTab)}
          </span>
        </div>

        {/* Profile Avatar & Settings trigger */}
        <button
          onClick={() => openModal('profile-settings')}
          className="flex items-center gap-2 p-0.5 rounded-full ring-1 ring-white/10 hover:ring-primary/50 transition-all active:scale-95 group focus:outline-none"
          title="Account & Settings"
        >
          <img
            alt={profile.name}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-white/15 group-hover:brightness-110 transition-all"
            src={profile.avatarUrl}
          />
        </button>
      </div>
    </header>
  );
};

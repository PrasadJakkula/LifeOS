import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const FloatingPill: React.FC = () => {
  const { startFocusSession, openModal } = useApp();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleInstantFocus = () => {
    setFeedback('Configuring State...');
    setTimeout(() => {
      setFeedback('Zone Active (50m)');
      setTimeout(() => {
        setFeedback(null);
        startFocusSession();
      }, 600);
    }, 500);
  };

  return (
    <div className="sticky bottom-20 z-30 flex items-center justify-center w-full px-2 mt-4 pointer-events-none">
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#32343e]/90 backdrop-blur-2xl border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.6)] pointer-events-auto">
        {/* Instant AI Focus button */}
        <button
          onClick={handleInstantFocus}
          disabled={!!feedback}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#8083ff] to-[#0566d9] hover:from-[#9093ff] hover:to-[#1a77e6] text-white text-xs font-semibold active:scale-95 transition-all shadow-[0_0_16px_rgba(128,131,255,0.4)] cursor-pointer"
        >
          {feedback ? (
            <>
              <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
              <span>{feedback}</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Instant AI Focus</span>
            </>
          )}
        </button>

        {/* New Goal button */}
        <button
          onClick={() => openModal('ai-planner')}
          className="flex items-center gap-1 px-3.5 py-2 rounded-full bg-[#1d1f29] text-[#e1e1ef] text-xs font-medium hover:bg-[#373943] hover:text-white active:scale-95 transition-all border border-white/5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-[#adc6ff]">add</span>
          <span>New Goal</span>
        </button>
      </div>
    </div>
  );
};

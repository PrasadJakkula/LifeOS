import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const ProfileModal: React.FC = () => {
  const { closeModal, profile, updateProfile, resetToDefaultData, goals, tasks } = useApp();
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [peakStart, setPeakStart] = useState(profile.cognitivePeakStart);
  const [peakEnd, setPeakEnd] = useState(profile.cognitivePeakEnd);
  const [targetMins, setTargetMins] = useState(profile.dailyFocusTargetMinutes);
  const [voice, setVoice] = useState(profile.voiceName || 'Kore');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      title,
      cognitivePeakStart: peakStart,
      cognitivePeakEnd: peakEnd,
      dailyFocusTargetMinutes: Number(targetMins),
      voiceName: voice,
    });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      closeModal();
    }, 600);
  };

  const handleReset = () => {
    resetToDefaultData();
    setShowResetConfirm(false);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#191b24] border border-white/10 shadow-2xl overflow-hidden text-on-surface">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#11131c]">
          <div className="flex items-center gap-3">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-9 h-9 rounded-full ring-2 ring-primary/40 object-cover"
            />
            <div>
              <h2 className="font-headline font-semibold text-base text-white">{profile.name}</h2>
              <p className="text-xs text-on-surface-variant">{profile.title}</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-outline hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1.5">
                Operator Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0c0e17] border border-white/10 text-white text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1.5">
                Executive Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0c0e17] border border-white/10 text-white text-xs"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#11131c] border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              Circadian & Biological Calibration
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-outline mb-1">Peak Window Start</label>
                <input
                  type="time"
                  value={peakStart}
                  onChange={(e) => setPeakStart(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0c0e17] border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-outline mb-1">Peak Window End</label>
                <input
                  type="time"
                  value={peakEnd}
                  onChange={(e) => setPeakEnd(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0c0e17] border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-outline mb-1">
                Daily Deep Work Target: <span className="text-secondary font-semibold">{targetMins} mins</span> ({Math.round(targetMins / 60 * 10) / 10}h)
              </label>
              <input
                type="range"
                min={60}
                max={480}
                step={30}
                value={targetMins}
                onChange={(e) => setTargetMins(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#11131c] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
              <span className="material-symbols-outlined text-[16px]">volume_up</span>
              AI Autonomous Voice Briefing
            </div>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0c0e17] border border-white/10 text-white text-xs"
            >
              <option value="Kore">Kore (Clear, Professional, High Clarity)</option>
              <option value="Fenrir">Fenrir (Authoritative, Resonant, Direct)</option>
              <option value="Puck">Puck (Energetic, Focused)</option>
              <option value="Zephyr">Zephyr (Calm, Grounded, Deliberate)</option>
              <option value="Charon">Charon (Deep, Strategic)</option>
            </select>
            <p className="text-[10px] text-outline">
              Used when generating personalized audio briefings via Gemini Speech engine.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#282933]/40 border border-white/5 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Local Database: {goals.length} Goals • {tasks.length} Directives</span>
            <span className="text-primary font-mono">{profile.streakDays}d Streak</span>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-2">
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                Reset to Original Stitch Seed Data
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-between gap-2">
                <span className="text-xs text-red-200">Restore all initial data?</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2.5 py-1 rounded bg-surface-container text-xs text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-2.5 py-1 rounded bg-red-600 text-xs font-semibold text-white"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            {savedNotice ? (
              <span className="text-xs text-green-400 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check</span> Saved
              </span>
            ) : <span />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-xl text-xs text-on-surface-variant hover:text-white"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const FocusView: React.FC = () => {
  const { tasks, activeFocusTask, toggleTaskCompletion, profile, setCurrentTab } = useApp();
  const [selectedTask, setSelectedTask] = useState(activeFocusTask || tasks.find((t) => !t.completed) || tasks[0]);
  const [durationMinutes, setDurationMinutes] = useState(50);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(50 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundMode, setSoundMode] = useState<'none' | 'gamma' | 'rain' | 'whitenoise'>('gamma');
  const [volume, setVolume] = useState(0.2);

  // Web Audio Context & Node refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundSourceRef = useRef<any>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Update selected task if context updates
  useEffect(() => {
    if (activeFocusTask) {
      setSelectedTask(activeFocusTask);
      if (activeFocusTask.estimatedMinutes) {
        setDurationMinutes(activeFocusTask.estimatedMinutes);
        setTimeLeftSeconds(activeFocusTask.estimatedMinutes * 60);
      }
    }
  }, [activeFocusTask]);

  // Timer countdown effect
  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (timeLeftSeconds === 0 && isRunning) {
      setIsRunning(false);
      stopAmbientSound();
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Deep Work Block Completed!', { body: 'Excellent focus session logged.' });
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeftSeconds]);

  // Synthesize ambient sound using Web Audio API
  const startAmbientSound = () => {
    stopAmbientSound();
    if (soundMode === 'none') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;

      if (soundMode === 'gamma') {
        // Binaural 40Hz gamma beat carrier (200Hz left, 240Hz right)
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);

        oscL.type = 'sine';
        oscL.frequency.setValueAtTime(200, ctx.currentTime);
        oscR.type = 'sine';
        oscR.frequency.setValueAtTime(240, ctx.currentTime);

        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);
        merger.connect(gain);

        oscL.start();
        oscR.start();
        soundSourceRef.current = { stop: () => { oscL.stop(); oscR.stop(); } };
      } else {
        // White/Pink noise generator
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02; // Pink-ish filter
          lastOut = output[i];
          output[i] *= 3.5;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.connect(gain);
        whiteNoise.start();
        soundSourceRef.current = whiteNoise;
      }
    } catch (e) {
      console.warn('Web Audio synthesis error:', e);
    }
  };

  const stopAmbientSound = () => {
    try {
      if (soundSourceRef.current) {
        soundSourceRef.current.stop?.();
        soundSourceRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch {}
  };

  useEffect(() => {
    if (isRunning && soundMode !== 'none') {
      startAmbientSound();
    } else {
      stopAmbientSound();
    }
    return () => stopAmbientSound();
  }, [isRunning, soundMode]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  const togglePlay = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = (mins: number) => {
    setIsRunning(false);
    setDurationMinutes(mins);
    setTimeLeftSeconds(mins * 60);
    stopAmbientSound();
  };

  const handleCompleteCurrentDirective = () => {
    if (selectedTask) {
      toggleTaskCompletion(selectedTask.id);
    }
    setIsRunning(false);
    stopAmbientSound();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const percentProgress = Math.round(((durationMinutes * 60 - timeLeftSeconds) / (durationMinutes * 60)) * 100);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 pb-28 gap-6 pt-2 items-center text-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className="text-xs text-on-surface-variant hover:text-white flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Command</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/20 border border-primary/30">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
            Distraction Shield Active
          </span>
        </div>
      </div>

      {/* Main Circular / Ring Timer Cockpit */}
      <div className="relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl bg-[#191b24] border border-white/10 shadow-2xl w-full max-w-md overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-20 w-64 h-64 rounded-full bg-[#8083ff]/15 blur-3xl pointer-events-none"></div>

        {/* Big Digit Display */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#adc6ff] font-semibold mb-2">
            DEEP WORK TIMEBLOCK
          </span>
          <div className="font-mono text-6xl sm:text-7xl font-bold text-white tracking-tighter tabular-nums drop-shadow-[0_0_24px_rgba(192,193,255,0.3)]">
            {formatTime(timeLeftSeconds)}
          </div>
          <span className="text-xs text-on-surface-variant mt-2 font-medium">
            {percentProgress}% elapsed • {Math.round(timeLeftSeconds / 60)}m remaining
          </span>
        </div>

        {/* Progress Bar Line */}
        <div className="w-full max-w-xs h-1.5 rounded-full bg-[#0c0e17] overflow-hidden mt-6 mb-8">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
            style={{ width: `${percentProgress}%` }}
          ></div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 z-10">
          <button
            onClick={() => resetTimer(durationMinutes)}
            className="p-3 rounded-full bg-[#282933] hover:bg-[#32343e] text-on-surface-variant hover:text-white transition-all active:scale-95"
            title="Reset Block"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>

          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-primary-container to-secondary-container hover:brightness-110 text-white shadow-xl shadow-primary-container/30 transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-[32px]">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <button
            onClick={() => {
              const nextMins = durationMinutes === 25 ? 50 : durationMinutes === 50 ? 90 : 25;
              resetTimer(nextMins);
            }}
            className="px-3 py-2 rounded-xl bg-[#282933] hover:bg-[#32343e] text-white text-xs font-semibold font-mono"
            title="Switch duration"
          >
            {durationMinutes}m
          </button>
        </div>

        {/* Duration presets */}
        <div className="flex items-center gap-2 mt-6 z-10">
          {[25, 50, 90].map((mins) => (
            <button
              key={mins}
              onClick={() => resetTimer(mins)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                durationMinutes === mins
                  ? 'bg-primary text-on-primary font-semibold'
                  : 'bg-[#11131c] text-on-surface-variant hover:text-white border border-white/5'
              }`}
            >
              {mins === 25 ? '25m Sprint' : mins === 50 ? '50m Flow' : '90m Peak Block'}
            </button>
          ))}
        </div>
      </div>

      {/* Current Focused Directive Card */}
      <div className="w-full max-w-md p-4 rounded-2xl bg-[#191b24] border border-white/10 text-left space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase font-semibold text-primary tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">center_focus_strong</span>
            Active Directive Under Focus
          </span>
          <select
            value={selectedTask?.id || ''}
            onChange={(e) => {
              const t = tasks.find((tk) => tk.id === e.target.value);
              if (t) setSelectedTask(t);
            }}
            className="text-[11px] bg-[#0c0e17] text-on-surface-variant border border-white/10 rounded-lg px-2 py-1 max-w-[150px] truncate"
          >
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        {selectedTask ? (
          <div>
            <h3 className={`text-base font-medium ${selectedTask.completed ? 'line-through text-outline' : 'text-white'}`}>
              {selectedTask.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-full bg-secondary-container/30 text-secondary text-[10px] font-semibold uppercase">
                {selectedTask.priorityLabel}
              </span>
              <span className="text-xs font-mono text-outline">{selectedTask.estimatedMinutes}m estimated</span>
            </div>

            <div className="pt-3 border-t border-white/5 mt-3 flex justify-end">
              <button
                onClick={handleCompleteCurrentDirective}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  selectedTask.completed
                    ? 'bg-surface-container text-outline'
                    : 'bg-primary text-on-primary hover:brightness-110 active:scale-95 shadow-md'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>{selectedTask.completed ? 'Completed' : 'Mark Directive Complete'}</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-outline">No directives currently queued.</p>
        )}
      </div>

      {/* Binaural & Ambient Flow Synthesizer Controls */}
      <div className="w-full max-w-md p-4 rounded-2xl bg-[#191b24] border border-white/5 text-left space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
            Neural Flow Soundscape
          </span>
          <span className="text-[10px] text-outline">Web Audio Engine</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: 'none', label: 'Mute' },
            { id: 'gamma', label: '40Hz Gamma' },
            { id: 'rain', label: 'Pink Flow' },
            { id: 'whitenoise', label: 'Brown Noise' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSoundMode(mode.id as any)}
              className={`p-2 rounded-xl text-center text-xs font-medium transition-all ${
                soundMode === mode.id
                  ? 'bg-primary-container text-white font-semibold shadow-sm'
                  : 'bg-[#11131c] text-on-surface-variant hover:text-white border border-white/5'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {soundMode !== 'none' && (
          <div className="flex items-center gap-3 pt-1">
            <span className="material-symbols-outlined text-outline text-[16px]">volume_down</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 accent-primary cursor-pointer"
            />
            <span className="material-symbols-outlined text-outline text-[16px]">volume_up</span>
          </div>
        )}
      </div>
    </div>
  );
};

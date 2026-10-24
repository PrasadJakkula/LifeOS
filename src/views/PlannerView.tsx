import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const PlannerView: React.FC = () => {
  const { agenda, addAgendaItem, updateAgendaItem, tasks, profile, openModal, startFocusSession } = useApp();
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [blockTitle, setBlockTitle] = useState('');
  const [blockSubtitle, setBlockSubtitle] = useState('');
  const [timeStart, setTimeStart] = useState('14:00');
  const [timeEnd, setTimeEnd] = useState('15:00');
  const [blockType, setBlockType] = useState<'in_progress' | 'upcoming' | 'habit'>('upcoming');

  const pendingTasks = tasks.filter((t) => !t.completed);

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockTitle.trim()) return;

    addAgendaItem({
      timeStart,
      timeEnd,
      status: blockType,
      statusLabel: blockType === 'in_progress' ? 'In Progress' : blockType === 'habit' ? 'Habit Window' : `Scheduled: ${timeStart}`,
      title: blockTitle,
      subtitle: blockSubtitle || 'Deep work session',
      icon: blockType === 'habit' ? 'restaurant' : 'schedule',
    });

    setBlockTitle('');
    setBlockSubtitle('');
    setShowAddBlock(false);
  };

  const scheduleTask = (task: any) => {
    addAgendaItem({
      timeStart: '15:30',
      timeEnd: '16:30',
      status: 'upcoming',
      statusLabel: 'Upcoming: 03:30 PM',
      title: task.title,
      subtitle: `Allocated ${task.estimatedMinutes}m • ${task.priorityLabel}`,
      icon: 'timer',
      taskId: task.id,
    });
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 pb-28 gap-5 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-headline text-2xl font-semibold text-white tracking-tight">Synchronized Planner</h1>
          <p className="text-xs text-on-surface-variant">Timeblocked cognitive scheduling aligned with biological peak windows</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex p-0.5 rounded-xl bg-[#191b24] border border-white/5">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'day' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'week' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-white'
              }`}
            >
              7-Day Sprint
            </button>
          </div>
          <button
            onClick={() => setShowAddBlock(true)}
            className="px-3 py-1.5 rounded-xl bg-[#282933] hover:bg-[#32343e] text-white text-xs font-medium border border-white/5 flex items-center gap-1 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Timeblock</span>
          </button>
        </div>
      </div>

      {/* Cognitive Peak Window Alert Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#282933] to-[#191b24] border border-[#8083ff]/30 shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[20px]">bolt</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Optimal Cognitive Window: {profile.cognitivePeakStart} – {profile.cognitivePeakEnd}
            </span>
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
            Neural bandwidth model indicates 94% focus capacity right now. Protect this block against asynchronous messaging and reactive triage.
          </p>
        </div>
        <button
          onClick={() => startFocusSession()}
          className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:brightness-110 active:scale-95 transition-all self-center whitespace-nowrap shadow-sm"
        >
          Engage Shield
        </button>
      </div>

      {/* Add Timeblock Modal/Form */}
      {showAddBlock && (
        <form onSubmit={handleCreateBlock} className="p-4 rounded-2xl bg-[#1d1f29] border border-primary/30 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white uppercase tracking-wider">Schedule Timeblock</span>
            <button
              type="button"
              onClick={() => setShowAddBlock(false)}
              className="text-outline hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-outline mb-1">Block Title</label>
              <input
                type="text"
                value={blockTitle}
                onChange={(e) => setBlockTitle(e.target.value)}
                placeholder="e.g. System Latency Profiling"
                className="w-full px-3 py-1.5 rounded-lg bg-[#0c0e17] border border-white/10 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] text-outline mb-1">Subtitle / Context</label>
              <input
                type="text"
                value={blockSubtitle}
                onChange={(e) => setBlockSubtitle(e.target.value)}
                placeholder="e.g. Noise cancellation engaged"
                className="w-full px-3 py-1.5 rounded-lg bg-[#0c0e17] border border-white/10 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] text-outline mb-1">Start</label>
              <input
                type="time"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                className="w-full px-2 py-1 rounded bg-[#0c0e17] border border-white/10 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-outline mb-1">End</label>
              <input
                type="time"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
                className="w-full px-2 py-1 rounded bg-[#0c0e17] border border-white/10 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-outline mb-1">Type</label>
              <select
                value={blockType}
                onChange={(e) => setBlockType(e.target.value as any)}
                className="w-full px-2 py-1 rounded bg-[#0c0e17] border border-white/10 text-xs text-white"
              >
                <option value="in_progress">In Progress</option>
                <option value="upcoming">Deep Work</option>
                <option value="habit">Habit Window</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddBlock(false)}
              className="px-3 py-1 rounded text-xs text-on-surface-variant hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold"
            >
              Add to Agenda
            </button>
          </div>
        </form>
      )}

      {/* Main Agenda Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          Today's Scheduled Sequence ({agenda.length} Blocks)
        </h3>

        <div className="space-y-3">
          {agenda.map((item) => {
            const isInProgress = item.status === 'in_progress';
            const isHabit = item.status === 'habit';

            return (
              <div
                key={item.id}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                  isInProgress
                    ? 'bg-[#282933] border-[#8083ff]/40 shadow-lg ring-1 ring-[#8083ff]/30'
                    : 'bg-[#191b24] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex flex-col items-center justify-center w-14 py-1 bg-[#11131c] rounded-xl border border-white/5 flex-shrink-0">
                  <span className="text-xs font-mono font-semibold text-white">{item.timeStart}</span>
                  <span className="text-[10px] text-outline my-0.5">to</span>
                  <span className="text-[11px] font-mono text-on-surface-variant">{item.timeEnd}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold ${
                        isInProgress
                          ? 'bg-primary-container text-on-primary'
                          : isHabit
                          ? 'bg-tertiary-container/30 text-tertiary'
                          : 'bg-surface-container-highest text-secondary'
                      }`}
                    >
                      {item.statusLabel}
                    </span>
                    <span className="material-symbols-outlined text-[18px] text-outline">
                      {item.icon}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">{item.subtitle}</p>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => startFocusSession()}
                      className="text-[11px] text-primary hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[13px]">timer</span>
                      Enter Deep Focus Block
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unscheduled Directives Tray */}
      <div className="p-4 rounded-2xl bg-[#191b24] border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">inbox</span>
            Unscheduled Directives ({pendingTasks.length})
          </h3>
          <button
            onClick={() => openModal('new-task')}
            className="text-[11px] text-primary hover:underline"
          >
            + Create New Directive
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {pendingTasks.map((t) => (
            <div
              key={t.id}
              className="p-3 rounded-xl bg-[#11131c] border border-white/5 flex items-center justify-between gap-2"
            >
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-semibold text-primary block truncate">
                  {t.priorityLabel} • {t.estimatedMinutes}m
                </span>
                <span className="text-xs text-white truncate block">{t.title}</span>
              </div>
              <button
                onClick={() => scheduleTask(t)}
                className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-bright text-xs text-secondary font-medium whitespace-nowrap active:scale-95 transition-all"
                title="Schedule into timeline"
              >
                + Schedule
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

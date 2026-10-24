import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PriorityLevel } from '../../types';

export const NewTaskModal: React.FC = () => {
  const { closeModal, addTask, goals, addAgendaItem } = useApp();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [priority, setPriority] = useState<PriorityLevel>('urgent');
  const [priorityLabel, setPriorityLabel] = useState('URGENT & STRATEGIC');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [goalId, setGoalId] = useState(goals[0]?.id || '');
  const [tagInput, setTagInput] = useState('Deep Focus, High Leverage');
  const [scheduleNow, setScheduleNow] = useState(false);
  const [timeStart, setTimeStart] = useState('14:00');
  const [timeEnd, setTimeEnd] = useState('14:45');

  const priorityOptions: Array<{ level: PriorityLevel; label: string; color: string }> = [
    { level: 'urgent', label: 'URGENT & STRATEGIC', color: 'text-primary' },
    { level: 'critical', label: 'CRITICAL REVIEW', color: 'text-secondary' },
    { level: 'normal', label: 'DEEP WORK', color: 'text-white' },
    { level: 'restorative', label: 'RESTORATIVE HABIT', color: 'text-tertiary' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedGoal = goals.find((g) => g.id === goalId);
    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const createdTask = addTask({
      title,
      category,
      priority,
      priorityLabel,
      estimatedMinutes: Number(estimatedMinutes),
      completed: false,
      dueDate,
      goalId: selectedGoal?.id,
      goalTitle: selectedGoal?.title,
      tags,
      status: 'todo',
      timeSlot: scheduleNow ? { start: timeStart, end: timeEnd } : undefined,
    });

    if (scheduleNow) {
      addAgendaItem({
        timeStart,
        timeEnd,
        status: 'upcoming',
        statusLabel: `Scheduled: ${timeStart}`,
        title,
        subtitle: `Estimated ${estimatedMinutes}m • ${category}`,
        icon: priority === 'restorative' ? 'restaurant' : 'timer',
        taskId: createdTask.id,
      });
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#191b24] border border-white/10 shadow-2xl overflow-hidden text-on-surface">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#11131c]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">crisis_alert</span>
            <h2 className="font-headline font-semibold text-lg text-white">New Priority Directive</h2>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-outline hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1.5">
              Directive Description
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Finalize Model Benchmark Evaluation..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#0c0e17] border border-white/10 text-white placeholder-outline focus:border-primary focus:outline-none text-sm"
              required
              autoFocus
            />
          </div>

          {/* Priority selection buttons */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1.5">
              Priority Tier
            </label>
            <div className="grid grid-cols-2 gap-2">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.level}
                  type="button"
                  onClick={() => {
                    setPriority(opt.level);
                    setPriorityLabel(opt.label);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    priority === opt.level
                      ? 'bg-surface-container-high border-primary text-white shadow-sm ring-1 ring-primary/40'
                      : 'bg-surface-container-lowest border-white/5 text-on-surface-variant hover:border-white/10'
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${opt.color}`}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1.5">
                Estimated Duration
              </label>
              <select
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#0c0e17] border border-white/10 text-white text-xs"
              >
                <option value={15}>15m (Micro-burst)</option>
                <option value={20}>20m (Reset)</option>
                <option value={30}>30m (Sprint)</option>
                <option value={45}>45m (Deep Review)</option>
                <option value={60}>60m (Focus Block)</option>
                <option value={90}>90m (Cognitive Peak)</option>
                <option value={120}>120m (Extended Deep Flow)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0c0e17] border border-white/10 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1.5">
              Associate with Active Goal
            </label>
            <select
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0c0e17] border border-white/10 text-white text-xs"
            >
              <option value="">None (Independent Directive)</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title} ({g.progress}%)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1.5">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="High Leverage, Q1 Goal #1, Deep Focus"
              className="w-full px-3 py-2 rounded-xl bg-[#0c0e17] border border-white/10 text-white text-xs"
            />
          </div>

          {/* Schedule to agenda toggle */}
          <div className="p-3 rounded-xl bg-[#282933]/50 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                Schedule into Synchronized Agenda Today
              </span>
              <input
                type="checkbox"
                checked={scheduleNow}
                onChange={(e) => setScheduleNow(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-0"
              />
            </div>

            {scheduleNow && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-outline block mb-1">Start Time</span>
                  <input
                    type="time"
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-[#0c0e17] border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-outline block mb-1">End Time</span>
                  <input
                    type="time"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-[#0c0e17] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl text-xs text-on-surface-variant hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-white font-semibold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md"
            >
              Add Directive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

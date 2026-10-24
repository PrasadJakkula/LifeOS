import React from 'react';
import { useApp } from '../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { profile, tasks, goals } = useApp();

  const completedTasks = tasks.filter((t) => t.completed);
  const totalEstimatedMins = tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
  const completedMins = completedTasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 100;

  // 7-day velocity mock bar data grounded in real stats
  const days = [
    { day: 'Thu', completed: 4, hours: 3.2, score: 90 },
    { day: 'Fri', completed: 5, hours: 4.1, score: 94 },
    { day: 'Sat', completed: 2, hours: 1.5, score: 85 },
    { day: 'Sun', completed: 3, hours: 2.0, score: 88 },
    { day: 'Mon', completed: 6, hours: 4.5, score: 96 },
    { day: 'Tue', completed: 5, hours: 4.0, score: 92 },
    { day: 'Wed', completed: Math.max(3, completedTasks.length), hours: 3.8, score: profile.focusScore, isToday: true },
  ];

  const maxCompleted = Math.max(...days.map((d) => d.completed), 6);

  // Category distribution
  const categories = ['Engineering', 'Strategic', 'Product', 'Health & Longevity'];
  const categoryCounts = categories.map((cat) => ({
    name: cat,
    count: tasks.filter((t) => t.category === cat || t.tags?.includes(cat)).length,
  }));
  const totalCatCount = categoryCounts.reduce((acc, c) => acc + c.count, 0) || 1;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 pb-28 gap-6 pt-2">
      {/* Header */}
      <div>
        <h1 className="font-headline text-2xl font-semibold text-white tracking-tight">Performance Analytics</h1>
        <p className="text-xs text-on-surface-variant">Cognitive velocity, deep work volume, and strategic milestone fulfillment</p>
      </div>

      {/* KPI Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#191b24] border border-white/5 space-y-1">
          <span className="text-[11px] text-outline uppercase font-semibold">Deep Work Volume</span>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {Math.round(completedMins / 60 * 10) / 10}h
          </div>
          <span className="text-[11px] text-[#adc6ff] flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">arrow_upward</span>
            +18% this week
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#191b24] border border-white/5 space-y-1">
          <span className="text-[11px] text-outline uppercase font-semibold">Directives Ratio</span>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {completedTasks.length}/{tasks.length}
          </div>
          <span className="text-[11px] text-[#c0c1ff]">
            {completionRate}% completion
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#191b24] border border-white/5 space-y-1">
          <span className="text-[11px] text-outline uppercase font-semibold">Focus Consistency</span>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {profile.focusScore}%
          </div>
          <span className="text-[11px] text-green-400">Biological peak locked</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#191b24] border border-white/5 space-y-1">
          <span className="text-[11px] text-outline uppercase font-semibold">Execution Streak</span>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {profile.streakDays}d
          </div>
          <span className="text-[11px] text-tertiary">All-time record</span>
        </div>
      </div>

      {/* 7-Day Velocity Bar Chart */}
      <div className="p-5 rounded-2xl bg-[#191b24] border border-white/5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline text-base font-semibold text-white">Daily Execution Velocity</h3>
            <p className="text-xs text-on-surface-variant">Directives completed and focus score per day</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-secondary-container/20 text-secondary text-xs font-semibold">
            Weekly Sprint
          </span>
        </div>

        <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
          {days.map((item, idx) => {
            const heightPercent = Math.round((item.completed / maxCompleted) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-primary font-semibold">
                  {item.completed} tasks
                </div>
                <div className="w-full max-w-[40px] bg-[#0c0e17] rounded-xl overflow-hidden flex flex-col justify-end p-0.5 h-full">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      item.isToday
                        ? 'bg-gradient-to-t from-primary-container to-secondary-container shadow-[0_0_12px_rgba(128,131,255,0.4)]'
                        : 'bg-surface-container-high group-hover:bg-[#8083ff]/40'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                </div>
                <span
                  className={`text-xs font-mono ${
                    item.isToday ? 'text-primary font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Category Distribution & AI Strategic Audit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category Breakdown */}
        <div className="p-5 rounded-2xl bg-[#191b24] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-sm font-semibold text-white">Focus Allocation by Sphere</h3>
            <span className="material-symbols-outlined text-outline text-[18px]">pie_chart</span>
          </div>

          <div className="space-y-3">
            {categoryCounts.map((cat, idx) => {
              const pct = Math.round((cat.count / totalCatCount) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface font-medium">{cat.name}</span>
                    <span className="font-mono text-on-surface-variant">{pct}% ({cat.count})</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#0c0e17] overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Strategic Synthesis Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1d1f29] to-[#11131c] border border-primary/20 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              Cognitive Auditor Finding
            </div>
            <h4 className="text-sm font-semibold text-white leading-snug">
              92% of output is achieved during morning deep work blocks.
            </h4>
            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
              Elena, your focus score peaks between 09:30 and 12:00. Moving engineering code reviews to 14:00 has unlocked a 24% velocity gain on your Series A Architecture goal.
            </p>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-outline">
            <span>Model: Gemini 3.8 Intelligence</span>
            <span className="text-secondary font-medium">Confidence: 98%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

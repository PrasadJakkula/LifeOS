import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FloatingPill } from '../components/FloatingPill';

export const DashboardView: React.FC = () => {
  const {
    profile,
    briefing,
    isLoadingBriefing,
    refreshBriefing,
    isPlayingAudio,
    toggleAudioBriefing,
    tasks,
    toggleTaskCompletion,
    agenda,
    openModal,
    setCurrentTab,
    startFocusSession,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'pending'>('all');

  // Format today's date pill like "OCT 24 • WED"
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  }).toUpperCase().replace(',', ' •');

  // Calculate live dynamic metrics
  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const highImpactTasks = tasks.filter((t) => t.priority === 'urgent' || t.priority === 'critical');

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'urgent') return t.priority === 'urgent' || t.priority === 'critical';
    if (activeFilter === 'pending') return !t.completed;
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 pb-28 gap-5 pt-2">
      {/* AI Daily Autonomous Briefing Card */}
      <div className="relative w-full rounded-2xl bg-[#282933]/80 backdrop-blur-2xl p-5 sm:p-6 shadow-xl overflow-hidden border border-white/[0.08] shadow-black/40">
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-[#8083ff]/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-[#0566d9]/20 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-3.5">
          {/* Briefing Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#c0c1ff] animate-ping"></div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#c0c1ff]">
                Autonomous Briefing
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => refreshBriefing()}
                disabled={isLoadingBriefing}
                title="Regenerate briefing with AI"
                className="text-[11px] text-[#c7c4d7] hover:text-white transition-colors"
              >
                <span className={`material-symbols-outlined text-[15px] ${isLoadingBriefing ? 'animate-spin' : ''}`}>
                  refresh
                </span>
              </button>
              <span className="text-[11px] font-mono text-[#c7c4d7] bg-[#0c0e17]/70 px-2.5 py-0.5 rounded-full border border-white/5">
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Main Copy */}
          <div className="flex flex-col gap-1">
            <h2 className="font-headline text-2xl sm:text-[26px] font-semibold text-white tracking-tight leading-snug">
              {briefing.greeting || `Good morning, ${profile.name}.`}
            </h2>
            <p className="text-sm text-[#c7c4d7] leading-relaxed">
              Your cognitive peak window is mapped for{' '}
              <span className="text-[#adc6ff] font-semibold">{briefing.peakWindow || `${profile.cognitivePeakStart} – ${profile.cognitivePeakEnd}`}</span>. You have{' '}
              <span className="text-white font-semibold">{highImpactTasks.length || 3} high-impact deliverables</span> queued with nominal distractions.
            </p>
          </div>

          {/* AI Focus Recommendation preview */}
          {briefing.focusRecommendation && (
            <div className="px-3 py-2 rounded-xl bg-[#11131c]/60 border border-[#8083ff]/20 text-xs text-[#e1e1ef] flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">lightbulb</span>
              <span className="flex-1">
                <strong className="text-primary font-medium">Daily Focus Directive: </strong>
                {briefing.focusRecommendation}
              </span>
            </div>
          )}

          {/* Quick AI Status Meta */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#1d1f29] text-[#c0c1ff] border border-white/5">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-[#908fa0] font-semibold tracking-wider">Neural State</span>
                <span className="text-xs text-white font-semibold">{briefing.neuralState || profile.neuralState}</span>
              </div>
            </div>

            {/* Audio Briefing Button */}
            <button
              onClick={toggleAudioBriefing}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold active:scale-95 transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-[#c0c1ff] text-[#1000a9] shadow-[0_0_16px_rgba(192,193,255,0.4)]'
                  : 'bg-[#8083ff]/20 text-[#c0c1ff] hover:bg-[#8083ff]/30 border border-[#8083ff]/30'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isPlayingAudio ? 'pause' : 'volume_up'}
              </span>
              <span>{isPlayingAudio ? 'Playing...' : 'Listen (1m 15s)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Executive Metrics Row */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 w-full">
        {/* Metric 1: Focus Score */}
        <div className="flex flex-col p-3.5 rounded-xl bg-[#191b24] border border-white/5 shadow-sm hover:border-white/10 transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-[#c7c4d7] tracking-tight truncate font-medium">Focus Score</span>
            <span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">psychology</span>
          </div>
          <div className="flex items-baseline gap-1 my-0.5">
            <span className="font-headline text-2xl font-semibold text-white tracking-tight tabular-nums">
              {profile.focusScore}%
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[#adc6ff] text-[11px] font-medium">
            <span className="material-symbols-outlined text-[13px]">arrow_upward</span>
            <span>+6% vs avg</span>
          </div>
        </div>

        {/* Metric 2: Habit Streak */}
        <div className="flex flex-col p-3.5 rounded-xl bg-[#191b24] border border-white/5 shadow-sm hover:border-white/10 transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-[#c7c4d7] tracking-tight truncate font-medium">Streak</span>
            <span className="material-symbols-outlined text-[16px] text-[#ddb7ff]">local_fire_department</span>
          </div>
          <div className="flex items-baseline gap-1 my-0.5">
            <span className="font-headline text-2xl font-semibold text-white tracking-tight tabular-nums">
              {profile.streakDays}d
            </span>
          </div>
          <div className="flex items-center text-[#c7c4d7] text-[11px] truncate">
            <span>Deep work run</span>
          </div>
        </div>

        {/* Metric 3: Goal Velocity */}
        <div className="flex flex-col p-3.5 rounded-xl bg-[#191b24] border border-white/5 shadow-sm hover:border-white/10 transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-[#c7c4d7] tracking-tight truncate font-medium">Velocity</span>
            <span className="material-symbols-outlined text-[16px] text-[#adc6ff]">trending_up</span>
          </div>
          <div className="flex items-baseline gap-1 my-0.5">
            <span className="font-headline text-2xl font-semibold text-white tracking-tight tabular-nums">
              {profile.velocityPercent}%
            </span>
          </div>
          <div className="flex items-center text-[#adc6ff] text-[11px] font-medium">
            <span>On track Q1</span>
          </div>
        </div>
      </div>

      {/* Priority Directives (Eisenhower Matrix Inspired) */}
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#c0c1ff]">crisis_alert</span>
            <h3 className="font-headline text-lg text-white font-semibold">Priority Directives</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#c7c4d7] bg-[#1d1f29] px-2.5 py-0.5 rounded-full border border-white/5 font-medium">
              {activeTasks.length} Active
            </span>
            <button
              onClick={() => openModal('new-task')}
              className="text-xs text-primary hover:text-white px-2.5 py-1 rounded-lg bg-[#282933] hover:bg-[#32343e] border border-white/5 flex items-center gap-1 transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>Directive</span>
            </button>
          </div>
        </div>

        {/* Priority items stream */}
        <div className="space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[#1d1f29] border border-white/5 text-sm text-outline">
              No directives found for this filter.
            </div>
          ) : (
            filteredTasks.slice(0, 5).map((task) => {
              const isUrgent = task.priority === 'urgent';
              const isCritical = task.priority === 'critical';
              const isRestorative = task.priority === 'restorative';

              const badgeColor = isUrgent
                ? 'text-[#c0c1ff]'
                : isCritical
                ? 'text-[#adc6ff]'
                : isRestorative
                ? 'text-[#ddb7ff]'
                : 'text-white';

              return (
                <div
                  key={task.id}
                  className={`flex flex-col p-4 rounded-xl border transition-all ${
                    task.completed
                      ? 'bg-[#191b24]/60 border-white/5 opacity-60'
                      : 'bg-[#1d1f29] border-white/[0.08] shadow-md hover:border-white/15'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Interactive Checkbox */}
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`mt-1 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all cursor-pointer ${
                        task.completed
                          ? 'bg-[#c0c1ff] text-[#1000a9]'
                          : 'bg-[#32343e] text-transparent hover:ring-1 hover:ring-primary/50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] select-none font-bold">
                        check
                      </span>
                    </button>

                    {/* Task Content */}
                    <div className="flex flex-col flex-1 min-w-0 gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] uppercase tracking-wider font-semibold ${badgeColor}`}>
                          {task.priorityLabel || (isUrgent ? 'URGENT & STRATEGIC' : isCritical ? 'CRITICAL REVIEW' : 'DEEP WORK')}
                        </span>
                        <span className="text-xs font-mono text-[#c7c4d7] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">timelapse</span>
                          {task.estimatedMinutes}m
                        </span>
                      </div>

                      <span
                        className={`text-base font-medium leading-snug transition-all ${
                          task.completed ? 'line-through text-[#908fa0]' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </span>

                      {/* Tag badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        {task.tags?.map((tag, idx) => {
                          const isHighLev = tag.toLowerCase().includes('high leverage');
                          const isGoal = tag.toLowerCase().includes('goal') || tag.toLowerCase().includes('q1');
                          const isFocus = tag.toLowerCase().includes('focus');
                          const isHealth = tag.toLowerCase().includes('health') || tag.toLowerCase().includes('streak');

                          const tagBg = isHighLev
                            ? 'bg-[#0566d9]/30 text-[#adc6ff]'
                            : isHealth
                            ? 'bg-[#b76dff]/25 text-[#ddb7ff]'
                            : 'bg-[#32343e] text-[#c7c4d7]';

                          return (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${tagBg}`}
                            >
                              {isFocus && <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff]"></span>}
                              {tag}
                            </span>
                          );
                        })}

                        {/* Quick Start Focus button for active tasks */}
                        {!task.completed && (
                          <button
                            onClick={() => startFocusSession(task)}
                            className="ml-auto px-2 py-0.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-semibold flex items-center gap-1 transition-all"
                            title="Start Focus Block for this Directive"
                          >
                            <span className="material-symbols-outlined text-[13px]">play_arrow</span>
                            <span>Focus</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Visual Break / Cognitive Bandwidth Mini-Graph */}
      <div className="flex flex-col p-5 rounded-2xl bg-[#191b24] border border-white/5 shadow-sm gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-headline text-base text-white font-semibold">Cognitive Bandwidth Allocation</span>
            <span className="text-xs text-[#c7c4d7]">Real-time biological load &amp; scheduled deep blocks</span>
          </div>
          <span className="text-xs font-mono text-[#c0c1ff] bg-[#8083ff]/20 border border-[#8083ff]/30 px-2 py-0.5 rounded font-semibold">
            Optimal
          </span>
        </div>

        {/* SVG Sparkline & Timeline Graph matching Stitch exactly */}
        <div className="w-full h-24 relative flex items-center cursor-pointer group" onClick={() => startFocusSession()}>
          <svg className="w-full h-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 340 70">
            <defs>
              <linearGradient id="bandGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#8083ff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8083ff" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Area Fill */}
            <path d="M 0,55 Q 50,45 80,18 T 170,12 T 250,42 T 340,58 L 340,70 L 0,70 Z" fill="url(#bandGrad)" />
            {/* Curve Line */}
            <path
              d="M 0,55 Q 50,45 80,18 T 170,12 T 250,42 T 340,58"
              stroke="#c0c1ff"
              strokeLinecap="round"
              strokeWidth="2.5"
            />
            {/* Current Time Indicator at Peak */}
            <circle cx="115" cy="15" fill="#8083ff" r="4.5" />
            <circle className="animate-ping" cx="115" cy="15" fill="#8083ff" opacity="0.4" r="8" />
            <line
              opacity="0.6"
              stroke="#c0c1ff"
              strokeDasharray="2 3"
              strokeWidth="1.5"
              x1="115"
              x2="115"
              y1="15"
              y2="70"
            />
          </svg>
        </div>

        <div className="flex justify-between text-[11px] font-medium text-[#c7c4d7]">
          <span>08:00 AM</span>
          <span className="text-[#c0c1ff] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff] animate-pulse"></span>
            10:15 AM (NOW)
          </span>
          <span>01:00 PM</span>
          <span>05:00 PM</span>
        </div>
      </div>

      {/* Daily Schedule Timeline */}
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#adc6ff]">schedule</span>
            <h3 className="font-headline text-lg text-white font-semibold">Synchronized Agenda</h3>
          </div>
          <button
            onClick={() => setCurrentTab('planner')}
            className="text-xs text-[#c0c1ff] hover:text-white font-medium flex items-center gap-1 active:opacity-70 transition-all cursor-pointer"
          >
            <span>Timeline View</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        {/* Schedule stream */}
        <div className="space-y-3">
          {agenda.map((item) => {
            const isInProgress = item.status === 'in_progress';
            const isHabit = item.status === 'habit';

            return (
              <div key={item.id} className="relative flex items-stretch gap-3 pl-1">
                {/* Time Column */}
                <div className="flex flex-col items-center justify-between w-14 py-1 flex-shrink-0">
                  <span
                    className={`font-mono text-xs font-semibold ${
                      isInProgress ? 'text-[#c0c1ff]' : 'text-[#c7c4d7]'
                    }`}
                  >
                    {item.timeStart}
                  </span>
                  <span
                    className={`w-0.5 flex-1 my-1 rounded-full ${
                      isInProgress ? 'bg-[#c0c1ff]/50' : 'bg-[#32343e]'
                    }`}
                  ></span>
                  <span className="font-mono text-xs text-[#c7c4d7]/70">{item.timeEnd}</span>
                </div>

                {/* Timeblock Card */}
                <div
                  className={`flex-1 p-4 rounded-xl border transition-all ${
                    isInProgress
                      ? 'bg-[#282933] border-[#8083ff]/30 shadow-md ring-1 ring-[#8083ff]/20'
                      : 'bg-[#1d1f29] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold ${
                        isInProgress
                          ? 'bg-[#8083ff] text-[#0d0096]'
                          : isHabit
                          ? 'bg-[#32343e] text-[#ddb7ff]'
                          : 'bg-[#32343e] text-[#c7c4d7]'
                      }`}
                    >
                      {item.statusLabel}
                    </span>
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        isInProgress ? 'text-[#c0c1ff]' : isHabit ? 'text-[#ddb7ff]' : 'text-outline'
                      }`}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  <p className="text-xs text-[#c7c4d7] mt-1">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Action Pill */}
      <FloatingPill />
    </div>
  );
};

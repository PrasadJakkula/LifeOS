import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GoalCategory } from '../types';

export const GoalsView: React.FC = () => {
  const { goals, toggleMilestone, deleteGoal, updateGoal, openModal, tasks } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [newMilestoneInputs, setNewMilestoneInputs] = useState<{ [goalId: string]: string }>({});

  const categories = ['All', 'Engineering', 'Strategic', 'Product', 'Health & Longevity', 'Career'];

  const filteredGoals = goals.filter((g) => {
    if (selectedCategory === 'All') return true;
    return g.category === selectedCategory;
  });

  const handleAddMilestone = (goalId: string) => {
    const text = newMilestoneInputs[goalId]?.trim();
    if (!text) return;

    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const newMilestone = {
      id: `m-${Date.now()}`,
      title: text,
      completed: false,
    };

    updateGoal(goalId, {
      milestones: [...goal.milestones, newMilestone],
    });

    setNewMilestoneInputs((prev) => ({ ...prev, [goalId]: '' }));
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 pb-28 gap-5 pt-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-headline text-2xl font-semibold text-white tracking-tight">Active Objectives</h1>
          <p className="text-xs text-on-surface-variant">Break large ambitious visions into executable daily directives</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal('ai-planner')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container hover:brightness-110 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-primary-container/20 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span>Architect with AI</span>
          </button>
          <button
            onClick={() => openModal('new-goal')}
            className="px-3.5 py-2 rounded-xl bg-[#282933] hover:bg-[#32343e] text-white text-xs font-medium border border-white/5 flex items-center gap-1 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Manual Goal</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-primary text-on-primary font-semibold shadow-sm'
                : 'bg-[#191b24] text-on-surface-variant hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#191b24] border border-white/5 space-y-3">
            <span className="material-symbols-outlined text-[36px] text-outline">flag</span>
            <p className="text-sm text-on-surface-variant">No goals found under this category.</p>
            <button
              onClick={() => openModal('ai-planner')}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              Generate with AI Architect
            </button>
          </div>
        ) : (
          filteredGoals.map((goal) => {
            const linkedTasks = tasks.filter((t) => t.goalId === goal.id);
            const completedLinked = linkedTasks.filter((t) => t.completed).length;

            return (
              <div
                key={goal.id}
                className="flex flex-col p-5 rounded-2xl bg-[#191b24] border border-white/[0.08] shadow-md hover:border-white/15 transition-all gap-4"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/30 text-secondary text-[11px] font-semibold uppercase tracking-wider">
                        {goal.category}
                      </span>
                      <span className="text-[11px] font-mono text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">calendar_month</span>
                        Target: {goal.targetDate}
                      </span>
                      {goal.priority === 'high' && (
                        <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary text-[10px] font-bold uppercase">
                          High Priority
                        </span>
                      )}
                    </div>
                    <h3 className="font-headline text-lg font-semibold text-white mt-1">{goal.title}</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{goal.description}</p>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Delete this goal and its references?')) {
                        deleteGoal(goal.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-outline hover:text-red-400 hover:bg-white/5 transition-colors"
                    title="Delete goal"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>

                {/* Progress Bar & Metric */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant font-medium">Milestone Progress</span>
                    <span className="font-mono text-primary font-semibold tabular-nums">{goal.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0c0e17] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* AI Execution Strategy Pill */}
                {goal.aiStrategy && (
                  <div className="p-3 rounded-xl bg-[#11131c] border border-primary/20 text-xs text-on-surface flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">psychology</span>
                    <div className="flex-1">
                      <span className="text-primary font-semibold uppercase tracking-wider text-[10px] block mb-0.5">
                        AI High-Leverage Strategy
                      </span>
                      <p className="text-on-surface-variant text-[11px] leading-relaxed">{goal.aiStrategy}</p>
                    </div>
                  </div>
                )}

                {/* Milestones checklist */}
                <div className="space-y-2 pt-1 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">checklist</span>
                      Milestones ({goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length})
                    </span>
                    <span className="text-[11px] text-outline font-normal">
                      {linkedTasks.length > 0 ? `${completedLinked}/${linkedTasks.length} directives finished` : ''}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {goal.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        onClick={() => toggleMilestone(goal.id, milestone.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                          milestone.completed
                            ? 'bg-[#11131c]/50 border-white/5 opacity-60'
                            : 'bg-[#282933] border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                              milestone.completed ? 'bg-primary text-on-primary' : 'bg-surface-container-highest'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[12px] font-bold">
                              {milestone.completed ? 'check' : ''}
                            </span>
                          </div>
                          <span
                            className={`text-xs ${
                              milestone.completed ? 'line-through text-outline' : 'text-on-surface font-medium'
                            }`}
                          >
                            {milestone.title}
                          </span>
                        </div>
                        {milestone.targetDate && (
                          <span className="text-[10px] font-mono text-outline px-1.5 py-0.5 rounded bg-surface-container-lowest">
                            {milestone.targetDate}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Inline Add Milestone */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add milestone..."
                      value={newMilestoneInputs[goal.id] || ''}
                      onChange={(e) =>
                        setNewMilestoneInputs((prev) => ({ ...prev, [goal.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMilestone(goal.id);
                        }
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#0c0e17] border border-white/10 text-xs text-white placeholder-outline focus:border-primary focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddMilestone(goal.id)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container text-xs text-white hover:bg-surface-bright transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

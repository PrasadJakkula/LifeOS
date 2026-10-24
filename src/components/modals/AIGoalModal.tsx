import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AIPlanResponse, GoalCategory, PriorityLevel } from '../../types';

export const AIGoalModal: React.FC = () => {
  const { closeModal, planGoalWithAI, addGoal, addTask } = useApp();
  const [goalTitle, setGoalTitle] = useState('');
  const [category, setCategory] = useState<GoalCategory>('Strategic');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planResult, setPlanResult] = useState<AIPlanResponse | null>(null);
  const [selectedTaskIndices, setSelectedTaskIndices] = useState<number[]>([]);

  const sampleIdeas = [
    'Deploy Multi-Agent Autonomous LLM Workflow with Sub-Second Latency',
    'Raise $5M Series A: Pitch Deck, Financial Model & Investor Pipeline',
    'Sub-20 Minute 5K & Zone 2 Cardiovascular Longevity Protocol',
    'Architect Enterprise SOC2 Compliance & Data Isolation Infrastructure',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await planGoalWithAI({
        title: goalTitle,
        category,
        description,
        targetDate,
      });
      setPlanResult(result);
      // Select all tasks by default
      setSelectedTaskIndices(result.suggestedTasks.map((_, i) => i));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to synthesize plan. Please check API connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPlan = () => {
    if (!planResult) return;

    // 1. Create the Goal
    const createdGoal = addGoal({
      title: goalTitle,
      description: planResult.executiveSummary || description || 'Autonomous strategic plan',
      category,
      priority: 'high',
      targetDate,
      status: 'active',
      aiStrategy: planResult.weeklyStrategy,
      milestones: planResult.milestones.map((m, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        title: m.title,
        completed: false,
        targetDate: m.targetWeek,
      })),
    });

    // 2. Add selected suggested tasks
    planResult.suggestedTasks.forEach((st, idx) => {
      if (selectedTaskIndices.includes(idx)) {
        addTask({
          title: st.title,
          category: st.category || category,
          priority: (st.priority as PriorityLevel) || 'urgent',
          priorityLabel: st.priorityLabel || 'HIGH LEVERAGE',
          estimatedMinutes: st.estimatedMinutes || 45,
          completed: false,
          dueDate: targetDate,
          goalId: createdGoal.id,
          goalTitle: createdGoal.title,
          tags: [...(st.tags || []), category],
          status: 'todo',
        });
      }
    });

    closeModal();
  };

  const toggleTaskSelection = (index: number) => {
    setSelectedTaskIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#191b24] border border-white/10 shadow-2xl overflow-hidden text-on-surface">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#11131c]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-container/20 text-primary">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </div>
            <div>
              <h2 className="font-headline font-semibold text-lg text-white">AI Goal Architect</h2>
              <p className="text-xs text-on-surface-variant">Turn natural language vision into milestones & directives</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-outline hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!planResult ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">
                  What is your high-impact goal?
                </label>
                <input
                  type="text"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Architect and launch Series A Technical infrastructure..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0c0e17] border border-white/10 text-white placeholder-outline focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm transition-all"
                  required
                  autoFocus
                />
              </div>

              {/* Sample idea chips */}
              <div>
                <span className="text-[11px] text-outline font-medium block mb-2">Prompt inspirations:</span>
                <div className="flex flex-wrap gap-1.5">
                  {sampleIdeas.map((idea, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setGoalTitle(idea)}
                      className="text-left px-2.5 py-1 rounded-lg bg-[#282933]/80 hover:bg-[#32343e] text-[11px] text-on-surface-variant hover:text-white border border-white/5 transition-all"
                    >
                      "{idea.slice(0, 48)}..."
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GoalCategory)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0c0e17] border border-white/10 text-white focus:border-primary focus:outline-none text-sm"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Strategic">Strategic</option>
                    <option value="Product">Product</option>
                    <option value="Health & Longevity">Health & Longevity</option>
                    <option value="Career">Career</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1.5">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0c0e17] border border-white/10 text-white focus:border-primary focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1.5">
                  Context / Key Constraints (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mention current stage, biological peak constraints, or technical dependencies..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0e17] border border-white/10 text-white placeholder-outline focus:border-primary focus:outline-none text-sm"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !goalTitle.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container hover:brightness-110 text-white font-semibold text-sm shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                      <span>Synthesizing Cognitive Strategy with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                      <span>Architect Plan with Gemini AI</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              {/* Executive Summary */}
              <div className="p-4 rounded-xl bg-[#11131c] border border-primary/20">
                <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  Executive Summary
                </div>
                <p className="text-sm text-on-surface leading-relaxed">
                  {planResult.executiveSummary}
                </p>
                {planResult.weeklyStrategy && (
                  <div className="mt-3 pt-3 border-t border-white/5 text-xs text-on-surface-variant">
                    <span className="text-secondary font-medium">Deep Work Strategy:</span> {planResult.weeklyStrategy}
                  </div>
                )}
              </div>

              {/* Milestones */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">flag</span>
                  Structured Milestones ({planResult.milestones.length})
                </h3>
                <div className="space-y-2">
                  {planResult.milestones.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#282933] border border-white/5 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-white">{m.title}</p>
                          <p className="text-[11px] text-on-surface-variant">{m.description}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container-highest text-secondary whitespace-nowrap">
                        {m.targetWeek}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Directives / Tasks */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">checklist</span>
                    Generated Directives ({selectedTaskIndices.length}/{planResult.suggestedTasks.length} selected)
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedTaskIndices(
                        selectedTaskIndices.length === planResult.suggestedTasks.length
                          ? []
                          : planResult.suggestedTasks.map((_, i) => i)
                      )
                    }
                    className="text-[11px] text-primary hover:underline"
                  >
                    {selectedTaskIndices.length === planResult.suggestedTasks.length ? 'Deselect all' : 'Select all'}
                  </button>
                </div>
                <div className="space-y-2">
                  {planResult.suggestedTasks.map((t, idx) => {
                    const isSelected = selectedTaskIndices.includes(idx);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleTaskSelection(idx)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-[#1d1f29] border-primary/40 shadow-sm'
                            : 'bg-[#11131c]/60 border-white/5 opacity-60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="mt-1 w-4 h-4 rounded text-primary focus:ring-0 focus:outline-none"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] uppercase font-semibold text-primary tracking-wider">
                              {t.priorityLabel || t.priority}
                            </span>
                            <span className="text-xs font-mono text-on-surface-variant flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">timelapse</span>
                              {t.estimatedMinutes}m
                            </span>
                          </div>
                          <p className="text-xs font-medium text-white mt-0.5">{t.title}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {t.tags?.map((tag, ti) => (
                              <span
                                key={ti}
                                className="px-2 py-0.5 rounded-full bg-surface-container-highest text-[10px] text-on-surface-variant"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Potential Bottlenecks */}
              {planResult.potentialBottlenecks && planResult.potentialBottlenecks.length > 0 && (
                <div className="p-3 rounded-xl bg-[#282933]/60 border border-white/5">
                  <div className="flex items-center gap-1.5 text-tertiary text-xs font-semibold uppercase tracking-wider mb-1">
                    <span className="material-symbols-outlined text-[15px]">warning</span>
                    Anticipated Bottlenecks & Defenses
                  </div>
                  <ul className="list-disc list-inside text-xs text-on-surface-variant space-y-0.5">
                    {planResult.potentialBottlenecks.map((b, bi) => (
                      <li key={bi}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#11131c] flex items-center justify-between gap-3">
          {planResult ? (
            <>
              <button
                type="button"
                onClick={() => setPlanResult(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors"
              >
                Modify Brief
              </button>
              <button
                type="button"
                onClick={handleApplyPlan}
                disabled={selectedTaskIndices.length === 0}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container hover:brightness-110 text-white font-semibold text-xs shadow-lg shadow-primary-container/20 flex items-center gap-2 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Import Goal & {selectedTaskIndices.length} Directives</span>
              </button>
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GoalCategory } from '../../types';

export const NewGoalModal: React.FC = () => {
  const { closeModal, addGoal, openModal } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('Engineering');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [milestones, setMilestones] = useState<string[]>(['Phase 1: Architecture & Prototype', 'Phase 2: Validation']);
  const [newMilestoneText, setNewMilestoneText] = useState('');

  const handleAddMilestone = () => {
    if (newMilestoneText.trim()) {
      setMilestones((prev) => [...prev, newMilestoneText.trim()]);
      setNewMilestoneText('');
    }
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addGoal({
      title,
      description,
      category,
      priority,
      targetDate,
      status: 'active',
      milestones: milestones.map((m, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        title: m,
        completed: false,
      })),
    });

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#191b24] border border-white/10 shadow-2xl overflow-hidden text-on-surface">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#11131c]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">flag</span>
            <h2 className="font-headline font-semibold text-lg text-white">New Objective</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal('ai-planner')}
              className="text-xs text-primary hover:text-white px-2.5 py-1 rounded-lg bg-primary-container/20 border border-primary/30 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              Use AI Architect
            </button>
            <button
              onClick={closeModal}
              className="p-1 rounded-lg text-outline hover:text-white"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1.5">
              Goal Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ship Multi-Agent Orchestration Core"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0c0e17] border border-white/10 text-white placeholder-outline focus:border-primary focus:outline-none text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GoalCategory)}
                className="w-full px-3 py-2 rounded-xl bg-[#0c0e17] border border-white/10 text-white text-xs"
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
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full px-3 py-2 rounded-xl bg-[#0c0e17] border border-white/10 text-white text-xs"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1.5">
              Target Deadline
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#0c0e17] border border-white/10 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1.5">
              Strategic Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key deliverables, expected impact, metrics..."
              rows={2}
              className="w-full px-4 py-2 rounded-xl bg-[#0c0e17] border border-white/10 text-white text-sm"
            />
          </div>

          {/* Milestones list */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1.5">
              Milestones
            </label>
            <div className="space-y-1.5 mb-2">
              {milestones.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#282933] text-xs">
                  <span className="text-on-surface">{m}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(i)}
                    className="text-outline hover:text-red-400"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMilestoneText}
                onChange={(e) => setNewMilestoneText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMilestone();
                  }
                }}
                placeholder="Add sub-milestone..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#0c0e17] border border-white/10 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-3 py-1.5 rounded-lg bg-surface-container text-xs hover:bg-surface-bright text-white"
              >
                Add
              </button>
            </div>
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
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

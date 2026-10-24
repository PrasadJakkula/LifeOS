import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Goal, Task, AgendaItem, UserProfile, AIPlanResponse, AICoachMessage } from '../types';
import { INITIAL_PROFILE, INITIAL_GOALS, INITIAL_TASKS, INITIAL_AGENDA } from '../data/initialData';

interface AppContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'progress'>) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  agenda: AgendaItem[];
  addAgendaItem: (item: Omit<AgendaItem, 'id'>) => void;
  updateAgendaItem: (id: string, updates: Partial<AgendaItem>) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeModal: string | null;
  openModal: (modalName: string) => void;
  closeModal: () => void;
  focusSessionActive: boolean;
  activeFocusTask: Task | null;
  startFocusSession: (task?: Task) => void;
  stopFocusSession: () => void;
  briefing: {
    greeting: string;
    peakWindow: string;
    highImpactSummary: string;
    neuralState: string;
    focusRecommendation: string;
    audioScript: string;
  };
  isLoadingBriefing: boolean;
  refreshBriefing: () => Promise<void>;
  isPlayingAudio: boolean;
  toggleAudioBriefing: () => Promise<void>;
  planGoalWithAI: (goalData: { title: string; category?: string; description?: string; targetDate?: string }) => Promise<AIPlanResponse>;
  coachMessages: AICoachMessage[];
  sendCoachMessage: (text: string) => Promise<string>;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  PROFILE: 'lifeos_profile_v1',
  GOALS: 'lifeos_goals_v1',
  TASKS: 'lifeos_tasks_v1',
  AGENDA: 'lifeos_agenda_v1',
  COACH: 'lifeos_coach_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      return saved ? JSON.parse(saved) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [agenda, setAgenda] = useState<AgendaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AGENDA);
      return saved ? JSON.parse(saved) : INITIAL_AGENDA;
    } catch {
      return INITIAL_AGENDA;
    }
  });

  const [coachMessages, setCoachMessages] = useState<AICoachMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COACH);
      return saved ? JSON.parse(saved) : [
        {
          id: 'cm-1',
          role: 'assistant',
          content: "Welcome to LifeOS Command Center, Elena. I've mapped your cognitive peak window for 09:30 – 12:00. How can I optimize your directives today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
    } catch {
      return [];
    }
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [focusSessionActive, setFocusSessionActive] = useState<boolean>(false);
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);

  const [briefing, setBriefing] = useState({
    greeting: `Good morning, ${profile.name}.`,
    peakWindow: '09:30 – 12:00',
    highImpactSummary: 'Your cognitive peak window is mapped for 09:30 – 12:00. You have 3 high-impact deliverables queued with nominal distractions.',
    neuralState: 'Hyper-Focused',
    focusRecommendation: 'Series A Architecture benchmark is the highest leverage item. Block external tabs for the next 90 minutes.',
    audioScript: `Good morning, ${profile.name}. Your cognitive peak window is mapped for nine thirty to twelve noon. You have three high-impact deliverables queued. Focus on the Series A Architecture Benchmark first.`,
  });

  const [isLoadingBriefing, setIsLoadingBriefing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AGENDA, JSON.stringify(agenda));
  }, [agenda]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COACH, JSON.stringify(coachMessages));
  }, [coachMessages]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const addGoal = (newGoalData: Omit<Goal, 'id' | 'createdAt' | 'progress'>) => {
    const newGoal: Goal = {
      ...newGoalData,
      id: `goal-${Date.now()}`,
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [newGoal, ...prev]);
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const updated = { ...g, ...updates };
        // Recalculate progress if milestones updated
        if (updated.milestones && updated.milestones.length > 0) {
          const completedCount = updated.milestones.filter((m) => m.completed).length;
          updated.progress = Math.round((completedCount / updated.milestones.length) * 100);
        }
        return updated;
      })
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);
        return {
          ...g,
          milestones: updatedMilestones,
          progress,
          status: progress === 100 ? 'completed' : g.status,
        };
      })
    );
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== id) return t;
        const willComplete = !t.completed;
        return {
          ...t,
          completed: willComplete,
          status: willComplete ? ('done' as const) : ('todo' as const),
          completedAt: willComplete ? new Date().toISOString() : undefined,
        };
      });

      // Update profile metrics immediately when tasks are toggled
      const completedCount = updated.filter((t) => t.completed).length;
      const totalCount = updated.length;
      const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;
      
      setProfile((p) => ({
        ...p,
        focusScore: Math.min(100, Math.max(60, 85 + Math.round(completionRate * 0.15))),
        velocityPercent: Math.min(100, Math.max(50, 70 + Math.round(completionRate * 0.25))),
      }));

      return updated;
    });
  };

  const addAgendaItem = (itemData: Omit<AgendaItem, 'id'>) => {
    const newItem: AgendaItem = {
      ...itemData,
      id: `agenda-${Date.now()}`,
    };
    setAgenda((prev) => [...prev, newItem]);
  };

  const updateAgendaItem = (id: string, updates: Partial<AgendaItem>) => {
    setAgenda((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const openModal = (modalName: string) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  const startFocusSession = (task?: Task) => {
    setActiveFocusTask(task || tasks.find((t) => !t.completed) || tasks[0]);
    setFocusSessionActive(true);
    setCurrentTab('focus');
  };

  const stopFocusSession = () => {
    setFocusSessionActive(false);
  };

  const refreshBriefing = async () => {
    setIsLoadingBriefing(true);
    try {
      const res = await fetch('/api/ai/daily-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: profile.name,
          tasks,
          goals,
          streak: profile.streakDays,
          focusScore: profile.focusScore,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setBriefing((prev) => ({
          ...prev,
          ...data,
        }));
      }
    } catch (err) {
      console.error('Failed to refresh briefing:', err);
    } finally {
      setIsLoadingBriefing(false);
    }
  };

  const toggleAudioBriefing = async () => {
    if (isPlayingAudio) {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);

    try {
      const script = briefing.audioScript || `${briefing.greeting} ${briefing.highImpactSummary}`;
      const res = await fetch('/api/ai/tts-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: script, voice: profile.voiceName || 'Kore' }),
      });

      const data = await res.json();

      if (data.audio) {
        const audio = new Audio(`data:${data.format || 'audio/wav'};base64,${data.audio}`);
        setAudioElement(audio);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => {
          setIsPlayingAudio(false);
        };
        await audio.play();
      } else {
        // Fallback to browser SpeechSynthesis
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(script);
          utterance.rate = 1.05;
          utterance.pitch = 1.0;
          utterance.onend = () => setIsPlayingAudio(false);
          utterance.onerror = () => setIsPlayingAudio(false);
          window.speechSynthesis.speak(utterance);
        } else {
          setTimeout(() => setIsPlayingAudio(false), 3000);
        }
      }
    } catch (error) {
      console.warn('Audio playback error:', error);
      setIsPlayingAudio(false);
    }
  };

  const planGoalWithAI = async (goalData: { title: string; category?: string; description?: string; targetDate?: string }): Promise<AIPlanResponse> => {
    const res = await fetch('/api/ai/plan-goal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalData),
    });

    if (!res.ok) {
      throw new Error('AI planning generation failed');
    }

    return await res.json();
  };

  const sendCoachMessage = async (text: string): Promise<string> => {
    const userMsg: AICoachMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCoachMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/ai/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: coachMessages,
          context: {
            name: profile.name,
            focusScore: profile.focusScore,
            streakDays: profile.streakDays,
            goals,
            tasks,
          },
        }),
      });

      const data = await res.json();
      const replyText = data.reply || "Directive acknowledged. Optimize for deep work windows.";

      const aiMsg: AICoachMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setCoachMessages((prev) => [...prev, aiMsg]);
      return replyText;
    } catch (error: any) {
      const fallbackMsg: AICoachMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: "Understood. Prioritize your single highest-impact task now. Eliminate open loops and context switching.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setCoachMessages((prev) => [...prev, fallbackMsg]);
      return fallbackMsg.content;
    }
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setProfile(INITIAL_PROFILE);
    setGoals(INITIAL_GOALS);
    setTasks(INITIAL_TASKS);
    setAgenda(INITIAL_AGENDA);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleMilestone,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        agenda,
        addAgendaItem,
        updateAgendaItem,
        currentTab,
        setCurrentTab,
        activeModal,
        openModal,
        closeModal,
        focusSessionActive,
        activeFocusTask,
        startFocusSession,
        stopFocusSession,
        briefing,
        isLoadingBriefing,
        refreshBriefing,
        isPlayingAudio,
        toggleAudioBriefing,
        planGoalWithAI,
        coachMessages,
        sendCoachMessage,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

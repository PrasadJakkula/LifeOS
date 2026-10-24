export type PriorityLevel = 'urgent' | 'critical' | 'normal' | 'restorative';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type GoalCategory = 'Engineering' | 'Strategic' | 'Health & Longevity' | 'Product' | 'Career' | 'Finance';

export interface Milestone {
  id: string;
  title: string;
  targetDate?: string;
  completed: boolean;
  order?: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: 'high' | 'medium' | 'low';
  targetDate: string;
  progress: number; // 0 - 100
  status: 'active' | 'completed' | 'paused';
  milestones: Milestone[];
  aiStrategy?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  priority: PriorityLevel;
  priorityLabel: string; // e.g. "URGENT & STRATEGIC", "CRITICAL REVIEW", "RESTORATIVE HABIT"
  estimatedMinutes: number;
  completed: boolean;
  dueDate: string; // YYYY-MM-DD
  goalId?: string;
  goalTitle?: string;
  milestoneId?: string;
  tags: string[];
  status: TaskStatus;
  timeSlot?: {
    start: string;
    end: string;
  };
  completedAt?: string;
  createdAt: string;
}

export interface AgendaItem {
  id: string;
  timeStart: string;
  timeEnd: string;
  status: 'in_progress' | 'upcoming' | 'habit' | 'completed';
  statusLabel: string;
  title: string;
  subtitle: string;
  icon: string;
  taskId?: string;
}

export interface UserProfile {
  name: string;
  title: string;
  avatarUrl: string;
  cognitivePeakStart: string;
  cognitivePeakEnd: string;
  dailyFocusTargetMinutes: number;
  neuralState: string;
  streakDays: number;
  velocityPercent: number;
  focusScore: number;
  theme: string;
  voiceName: string;
}

export interface AICoachMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionItems?: Array<{
    label: string;
    type: 'add_task' | 'break_down_goal' | 'focus';
    data?: any;
  }>;
}

export interface AIPlanResponse {
  executiveSummary: string;
  milestones: Array<{
    title: string;
    targetWeek: string;
    description: string;
  }>;
  suggestedTasks: Array<{
    title: string;
    category: string;
    priority: PriorityLevel;
    priorityLabel: string;
    estimatedMinutes: number;
    tags: string[];
  }>;
  weeklyStrategy: string;
  potentialBottlenecks: string[];
}

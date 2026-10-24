import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './views/DashboardView';
import { GoalsView } from './views/GoalsView';
import { PlannerView } from './views/PlannerView';
import { FocusView } from './views/FocusView';
import { AnalyticsView } from './views/AnalyticsView';
import { AICoachView } from './views/AICoachView';
import { AIGoalModal } from './components/modals/AIGoalModal';
import { NewGoalModal } from './components/modals/NewGoalModal';
import { NewTaskModal } from './components/modals/NewTaskModal';
import { ProfileModal } from './components/modals/ProfileModal';

const AppContent: React.FC = () => {
  const { currentTab, activeModal } = useApp();

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'goals':
        return <GoalsView />;
      case 'planner':
        return <PlannerView />;
      case 'focus':
        return <FocusView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'ai-coach':
        return <AICoachView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#11131c] text-[#e1e1ef] font-body flex flex-col selection:bg-primary-container/30">
      {/* Top Header */}
      <Header />

      {/* Main View Container */}
      <main className="flex-1 w-full pt-20">
        {renderActiveView()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Modals */}
      {activeModal === 'ai-planner' && <AIGoalModal />}
      {activeModal === 'new-goal' && <NewGoalModal />}
      {activeModal === 'new-task' && <NewTaskModal />}
      {activeModal === 'profile-settings' && <ProfileModal />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

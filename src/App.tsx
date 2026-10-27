import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DashboardView } from './views/DashboardView';
import { StudentsView } from './views/StudentsView';
import { SkillsMapView } from './views/SkillsMapView';
import { DiagnosticsView } from './views/DiagnosticsView';
import { AdaptiveEngineView } from './views/AdaptiveEngineView';
import { AiWorkshopView } from './views/AiWorkshopView';
import { ItemBankView } from './views/ItemBankView';
import { TaskAssignmentView } from './views/TaskAssignmentView';
import { AnalyticsView } from './views/AnalyticsView';
import { DossierReportView } from './views/DossierReportView';
import { OfflineStudentCornerView } from './views/OfflineStudentCornerView';

const MainContent: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const [isOfflineStudentMode, setIsOfflineStudentMode] = useState(false);

  const handleOpenOffline = () => {
    setIsOfflineStudentMode(true);
  };

  const handleExitOffline = () => {
    setIsOfflineStudentMode(false);
  };

  if (isOfflineStudentMode) {
    return (
      <div className="min-h-screen bg-emerald-50/50 flex flex-col font-sans">
        <Header
          isOfflineMode={true}
          onOpenOfflineCorner={handleOpenOffline}
          onExitOfflineMode={handleExitOffline}
        />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
          <OfflineStudentCornerView />
        </main>
        <Footer />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'students':
        return <StudentsView />;
      case 'skills_map':
        return <SkillsMapView />;
      case 'diagnostics':
        return <DiagnosticsView />;
      case 'adaptive_engine':
        return <AdaptiveEngineView />;
      case 'ai_workshop':
        return <AiWorkshopView />;
      case 'item_bank':
        return <ItemBankView />;
      case 'assign_task':
        return <TaskAssignmentView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'dossier_report':
        return <DossierReportView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col font-sans">
      <Header
        isOfflineMode={false}
        onOpenOfflineCorner={handleOpenOffline}
        onExitOfflineMode={handleExitOffline}
      />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {renderActiveView()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

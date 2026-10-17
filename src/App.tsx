import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { TopBar } from './components/TopBar';
import { HomeView } from './components/views/HomeView';
import { ProjectsView } from './components/views/ProjectsView';
import { TasksView } from './components/views/TasksView';
import { CalendarView } from './components/views/CalendarView';
import { TeamView } from './components/views/TeamView';
import { NotificationsView } from './components/views/NotificationsView';
import { SettingsView } from './components/views/SettingsView';
import { TaskModal } from './components/modals/TaskModal';
import { ProjectModal } from './components/modals/ProjectModal';
import { InviteMemberModal } from './components/modals/InviteMemberModal';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="relative flex min-h-screen selection:bg-purple-200/80 selection:text-purple-950">
      {/* Fixed Ambient Liquid Glass Background Blobs */}
      <div className="liquid-canvas-bg" aria-hidden="true">
        <div className="liquid-blob blob-lavender" />
        <div className="liquid-blob blob-sky" />
        <div className="liquid-blob blob-mint" />
        <div className="liquid-blob blob-coral" />
        <div className="liquid-blob blob-pink" />
      </div>

      {/* Desktop Floating Glass Sidebar */}
      <div className="hidden md:flex p-3 pr-0 shrink-0 sticky top-0 h-screen z-30">
        <Sidebar />
      </div>

      {/* Main Content Viewport with Floating Glass Top Bar */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        <div className="p-3 sm:p-4 pb-0 sticky top-0 z-20">
          <TopBar />
        </div>
        <main className="flex-1 overflow-y-auto px-1 sm:px-2 pt-2">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'projects' && <ProjectsView />}
          {activeTab === 'tasks' && <TasksView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'team' && <TeamView />}
          {activeTab === 'notifications' && <NotificationsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Floating Glass Navigation Bar */}
      <MobileNav />

      {/* Global Modals */}
      <TaskModal />
      <ProjectModal />
      <InviteMemberModal />
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

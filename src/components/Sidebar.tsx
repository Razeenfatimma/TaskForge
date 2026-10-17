import React from 'react';
import { 
  Home, 
  FolderKanban, 
  CheckSquare, 
  Calendar, 
  Users, 
  Bell, 
  Settings, 
  Plus, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from './UserAvatar';
import { ViewTab } from '../types';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    openCreateTaskModal, 
    openCreateProjectModal, 
    unreadNotificationsCount,
    currentUser,
    users, 
    setCurrentUser,
    projects, 
    openProject, 
    selectedProjectId 
  } = useApp();

  const navItems: { id: ViewTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: projects.length },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'team', label: 'Team', icon: Users, badge: users.length },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 glass-strong rounded-3xl h-[calc(100vh-1.5rem)] flex flex-col transition-all select-none overflow-hidden">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/40">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-400 to-sky-400 flex items-center justify-center text-white shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform border border-white/40">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-heading text-xl font-bold tracking-tight text-gray-900 block leading-tight">
                TaskForge
              </span>
              <span className="text-xs font-semibold text-purple-800/90 block">
                Workspace Studio
              </span>
            </div>
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => openCreateTaskModal()}
            className="flex-1 btn-glossy flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
          <button
            onClick={openCreateProjectModal}
            title="Create Project"
            className="glass-button p-2 text-purple-800 rounded-xl transition-all"
          >
            <FolderKanban className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white/85 backdrop-blur-md text-purple-950 font-bold border border-white shadow-xs'
                  : 'text-gray-700 hover:bg-white/45 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-purple-700' : 'text-gray-500'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'glass-pill bg-purple-200/80 text-purple-950'
                      : 'glass-pill text-purple-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Project Access Section */}
        <div className="pt-5 px-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Active Projects
            </span>
            <button
              onClick={openCreateProjectModal}
              className="text-xs text-purple-800 hover:text-purple-950 font-bold"
            >
              + Add
            </button>
          </div>
          <div className="space-y-1">
            {projects.slice(0, 5).map((project) => {
              const isSelected = activeTab === 'projects' && selectedProjectId === project.id;
              return (
                <button
                  key={project.id}
                  onClick={() => openProject(project.id, 'board')}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all text-left group ${
                    isSelected
                      ? 'bg-white/80 text-purple-950 font-bold border border-white shadow-2xs'
                      : 'text-gray-700 hover:bg-white/40 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded-md glass-pill flex items-center justify-center text-xs shrink-0">
                      {project.iconEmoji}
                    </span>
                    <span className="truncate">{project.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Switcher Footer */}
      <div className="p-3 border-t border-white/40 bg-white/20">
        <div className="flex items-center gap-3 p-2 rounded-2xl glass-subtle hover:bg-white/60 transition-colors">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-xs shrink-0 border border-white/60"
            style={{ backgroundColor: `${currentUser.avatarColor}25` }}
          >
            <UserAvatar user={currentUser} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-700 truncate">{currentUser.role}</p>
          </div>
          <select
            value={currentUser.id}
            onChange={(e) => setCurrentUser(e.target.value)}
            className="sr-only"
            id="user-select-hidden"
            aria-label="Switch User"
          />
        </div>
      </div>
    </aside>
  );
};

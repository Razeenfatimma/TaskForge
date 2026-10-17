import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  ChevronDown, 
  Sparkles, 
  CheckCircle2, 
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from './UserAvatar';

export const TopBar: React.FC = () => {
  const { 
    activeTab, 
    selectedProjectId, 
    getProject, 
    projectSubTab, 
    setActiveTab, 
    openProject,
    openCreateTaskModal, 
    openCreateProjectModal, 
    searchQuery, 
    setSearchQuery,
    currentUser,
    users,
    setCurrentUser,
    notifications,
    markNotificationRead,
    unreadNotificationsCount,
    tasks,
    projects
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setIsNotifMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentProject = selectedProjectId ? getProject(selectedProjectId) : null;

  // Search results
  const searchResults = searchQuery.trim() ? {
    projects: projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.tagLine.toLowerCase().includes(searchQuery.toLowerCase())),
    tasks: tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))),
    users: users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.role.toLowerCase().includes(searchQuery.toLowerCase()))
  } : null;

  const hasResults = searchResults && (searchResults.projects.length > 0 || searchResults.tasks.length > 0 || searchResults.users.length > 0);

  return (
    <header className="glass-strong rounded-2xl px-4 sm:px-6 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Breadcrumbs */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="md:hidden flex items-center gap-2 mr-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-xs border border-white/40">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 truncate">
            <button
              onClick={() => setActiveTab('home')}
              className="hover:text-purple-800 transition-colors shrink-0 font-medium"
            >
              TaskForge
            </button>
            <span className="opacity-60">/</span>
            {activeTab === 'projects' && currentProject ? (
              <>
                <button
                  onClick={() => openProject(currentProject.id, 'overview')}
                  className="hover:text-purple-800 transition-colors flex items-center gap-1.5 truncate text-gray-900 font-semibold"
                >
                  <span className="w-5 h-5 rounded-md glass-pill text-xs inline-flex items-center justify-center">
                    {currentProject.iconEmoji}
                  </span>
                  <span className="truncate">{currentProject.name}</span>
                </button>
                <span className="opacity-60">/</span>
                <span className="text-purple-800 capitalize font-bold">{projectSubTab}</span>
              </>
            ) : (
              <span className="text-gray-900 capitalize font-bold">{activeTab}</span>
            )}
          </div>
        </div>

        {/* Center / Search bar */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search projects, tasks, or team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm glass-input text-gray-900 placeholder:text-gray-500 rounded-xl outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Search Overlay dropdown */}
          {isSearchFocused && searchResults && (
            <div 
              onMouseDown={(e) => e.preventDefault()}
              className="absolute left-0 right-0 top-full mt-2 glass-strong rounded-2xl shadow-2xl p-3 max-h-80 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-1"
            >
              {!hasResults ? (
                <div className="p-4 text-center text-xs text-gray-500 font-medium">
                  No matches found for &quot;{searchQuery}&quot;
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.projects.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-purple-700 px-2 mb-1">
                        Projects
                      </div>
                      {searchResults.projects.slice(0, 3).map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            openProject(p.id, 'board');
                            setIsSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/70 text-left transition-colors text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span>{p.iconEmoji}</span>
                            <span className="font-semibold text-gray-900">{p.name}</span>
                          </div>
                          <span className="text-[11px] text-gray-600 font-medium">{p.category}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchResults.tasks.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-purple-700 px-2 mb-1">
                        Tasks
                      </div>
                      {searchResults.tasks.slice(0, 4).map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            openProject(t.projectId, 'board');
                            setIsSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/70 text-left transition-colors text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <CheckCircle2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="font-medium text-gray-900 truncate">{t.title}</span>
                          </div>
                          <span className="text-[11px] font-bold text-purple-700 shrink-0 capitalize">{t.priority}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchResults.users.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-purple-700 px-2 mb-1">
                        Team
                      </div>
                      {searchResults.users.slice(0, 3).map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            setActiveTab('team');
                            setIsSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-white/70 text-left transition-colors text-xs"
                        >
                          <span className="w-6 h-6 rounded-lg glass-pill flex items-center justify-center text-xs">
                            <UserAvatar user={u} />
                          </span>
                          <span className="font-semibold text-gray-900">{u.name}</span>
                          <span className="text-gray-600 font-medium">· {u.role}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create Task */}
          <button
            onClick={() => openCreateTaskModal()}
            className="btn-glossy flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Task</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
              className="glass-button relative p-2 text-gray-700 hover:text-purple-800 rounded-xl transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-white" />
              )}
            </button>

            {isNotifMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 glass-strong rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/50 px-1">
                  <span className="text-xs font-bold text-gray-900">Notifications</span>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className="text-[11px] text-purple-700 hover:text-purple-900 font-bold"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer border ${
                        n.read ? 'bg-white/40 border-white/40 hover:bg-white/60' : 'bg-purple-100/60 border-purple-200/80 hover:bg-purple-100 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between text-gray-900 font-bold mb-0.5">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-gray-500 font-normal">{n.timestamp}</span>
                      </div>
                      <p className="text-gray-700 text-[11px] line-clamp-2">{n.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Switcher */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="glass-button flex items-center gap-2 p-1.5 pl-2 rounded-xl"
            >
              <div 
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shadow-xs border border-white/60"
                style={{ backgroundColor: `${currentUser.avatarColor}25` }}
              >
                <UserAvatar user={currentUser} />
              </div>
              <span className="hidden md:inline text-xs font-bold text-gray-900">
                {currentUser.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 glass-strong rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="p-2 border-b border-white/50 mb-1">
                  <p className="text-xs text-gray-600 font-medium">Switch Active Team Member</p>
                </div>
                <div className="space-y-1">
                  {users.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u.id);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors text-xs ${
                          isSelected
                            ? 'bg-purple-200/70 text-purple-950 font-bold border border-white'
                            : 'hover:bg-white/60 text-gray-700'
                        }`}
                      >
                        <span 
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shadow-xs border border-white/60"
                          style={{ backgroundColor: `${u.avatarColor}25` }}
                        >
                          <UserAvatar user={u} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold truncate text-gray-900">{u.name}</p>
                          <p className="text-[11px] text-gray-600 truncate">{u.role}</p>
                        </div>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-purple-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

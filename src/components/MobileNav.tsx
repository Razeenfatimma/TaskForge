import React from 'react';
import { Home, FolderKanban, CheckSquare, Calendar, Users, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ViewTab } from '../types';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, unreadNotificationsCount } = useApp();

  const items: { id: ViewTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadNotificationsCount },
  ];

  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 glass-strong rounded-2xl px-2 py-2 flex items-center justify-around shadow-2xl border border-white/80">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition-all relative min-w-[50px] ${
              isActive 
                ? 'text-purple-950 font-bold bg-white/70 shadow-2xs border border-white/80' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] text-purple-700' : ''}`} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 bg-pink-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-0.5 leading-none">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

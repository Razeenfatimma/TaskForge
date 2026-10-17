import React, { useState } from 'react';
import { 
  Bell,
  CheckCheck, 
  Trash2, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  FolderKanban, 
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    clearNotifications,
    openProject
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'deadline':
        return <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0"><Clock className="w-5 h-5" /></div>;
      case 'assignment':
        return <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0"><Sparkles className="w-5 h-5" /></div>;
      case 'status':
        return <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><CheckCircle2 className="w-5 h-5" /></div>;
      default:
        return <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0"><FolderKanban className="w-5 h-5" /></div>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Notifications & Alerts
          </h1>
          <p className="text-sm text-gray-700 font-medium mt-1">
            Deadlines, task assignments, and workspace sprint activity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
          <button
            onClick={clearNotifications}
            className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-gray-200 transition-colors"
            title="Clear all notifications"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-purple-50'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'unread'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-purple-50'
          }`}
        >
          Unread ({notifications.filter((n) => !n.read).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-purple-100/80 shadow-xs space-y-3">
        {filteredNotifs.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              markNotificationRead(item.id);
              if (item.projectId) {
                openProject(item.projectId, 'board');
              }
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              item.read
                ? 'bg-white/60 border-purple-50 hover:bg-purple-50/40'
                : 'bg-purple-50/70 border-purple-200 shadow-xs'
            }`}
          >
            {getNotificationIcon(item.type)}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-heading text-sm font-bold text-gray-900 leading-snug">
                  {item.title}
                </h3>
                <span className="text-[11px] font-medium text-gray-500 shrink-0">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>

            {item.projectId && (
              <div className="shrink-0 self-center">
                <ArrowRight className="w-4 h-4 text-purple-600 opacity-60 hover:opacity-100" />
              </div>
            )}
          </div>
        ))}

        {filteredNotifs.length === 0 && (
          <div className="py-16 text-center text-xs text-gray-500">
            <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            No notifications in this view.
          </div>
        )}
      </div>
    </div>
  );
};

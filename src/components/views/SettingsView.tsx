import React, { useState } from 'react';
import { 
  RotateCcw, 
  Download, 
  ShieldCheck, 
  Palette, 
  UserCheck,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PROJECT_COLORS } from '../../utils/theme';
import { UserAvatar } from '../UserAvatar';

export const SettingsView: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    users, 
    resetAllData, 
    projects, 
    tasks, 
    activities, 
    notifications,
    files 
  } = useApp();

  const [confirmReset, setConfirmReset] = useState(false);

  const handleExportData = () => {
    const backup = {
      projects,
      tasks,
      users,
      activities,
      notifications,
      files,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `TaskForge_Backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-2">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Workspace Settings
        </h1>
        <p className="text-sm text-gray-700 font-medium mt-1">
          Profile preferences, pastel design system tokens, and local data persistence
        </p>
      </div>

      {/* 1. Active User Profile Switcher */}
      <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-purple-100/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-purple-50">
          <UserCheck className="w-5 h-5 text-purple-600" />
          <h2 className="font-heading text-base font-bold text-gray-900">
            Active Workspace Member
          </h2>
        </div>

        <p className="text-xs text-gray-600">
          Switch who you are logged in as to test team assignments, activity logs, and personal tasks.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {users.map((user) => {
            const isSelected = user.id === currentUser.id;
            return (
              <div
                key={user.id}
                onClick={() => setCurrentUser(user.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-100/80 shadow-xs ring-2 ring-purple-300'
                    : 'border-purple-100/60 bg-purple-50/30 hover:bg-purple-50/70'
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: `${user.avatarColor}20` }}
                >
                  <UserAvatar user={user} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs text-gray-900 truncate">{user.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-purple-700" />}
                  </div>
                  <span className="text-[11px] text-gray-600 block truncate">{user.role}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Visual Style & Color Architecture */}
      <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-purple-100/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-purple-50">
          <Palette className="w-5 h-5 text-purple-600" />
          <h2 className="font-heading text-base font-bold text-gray-900">
            Project Color Identity System
          </h2>
        </div>

        <p className="text-xs text-gray-600">
          Every project owns exactly one dedicated pastel shade that governs its poster card, banner gradient, progress bars, board columns, and badges:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {Object.values(PROJECT_COLORS).map((colorScheme) => (
            <div 
              key={colorScheme.id}
              className="p-3.5 rounded-2xl border text-center space-y-2"
              style={{ 
                background: colorScheme.gradient,
                borderColor: colorScheme.border 
              }}
            >
              <div 
                className="w-6 h-6 rounded-full mx-auto shadow-2xs"
                style={{ backgroundColor: colorScheme.primary }}
              />
              <div>
                <p className="font-bold text-xs text-gray-900">{colorScheme.label}</p>
                <p className="text-[10px] font-mono text-gray-700 mt-0.5">{colorScheme.primary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Data Persistence & Backup */}
      <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-purple-100/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-purple-50">
          <ShieldCheck className="w-5 h-5 text-purple-600" />
          <h2 className="font-heading text-base font-bold text-gray-900">
            Data Storage & Backup (LocalStorage)
          </h2>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          TaskForge persists all projects, tasks, comments, files, and notification history locally in your browser. All updates survive refreshes and browser restarts.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Backup</span>
          </button>

          {confirmReset ? (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 p-1.5 rounded-xl">
              <span className="text-xs font-bold text-rose-700 px-1">Reset all data to default?</span>
              <button
                onClick={() => {
                  resetAllData();
                  setConfirmReset(false);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:bg-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Sample Data</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

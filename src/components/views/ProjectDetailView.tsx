import React, { useState } from 'react';
import { 
  FolderKanban, 
  Calendar, 
  Users, 
  Layers, 
  FileText, 
  ArrowLeft,
  Trash2,
  Edit3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getProjectTheme } from '../../utils/theme';
import { UserAvatar } from '../UserAvatar';
import { ProjectTab } from '../../types';
import { ProjectOverview } from './ProjectOverview';
import { KanbanBoard } from './KanbanBoard';
import { ProjectTimeline } from './ProjectTimeline';
import { ProjectTeam } from './ProjectTeam';
import { ProjectFiles } from './ProjectFiles';

interface ProjectDetailViewProps {
  projectId: string;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ projectId }) => {
  const { 
    getProject, 
    getProjectProgress, 
    getProjectMembers, 
    projectSubTab, 
    setProjectSubTab, 
    openEditProjectModal, 
    deleteProject, 
    setActiveTab
  } = useApp();

  const [confirmDelete, setConfirmDelete] = useState(false);

  const project = getProject(projectId);
  if (!project) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-gray-500">Project not found.</p>
        <button
          onClick={() => setActiveTab('projects')}
          className="mt-4 px-4 py-2 text-xs font-bold text-white bg-purple-600 rounded-xl"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const theme = getProjectTheme(project.color);
  const progress = getProjectProgress(project.id);
  const members = getProjectMembers(project.id);

  const tabs: { id: ProjectTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: FolderKanban },
    { id: 'board', label: 'Board (Kanban)', icon: Layers },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'files', label: 'Files', icon: FileText },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-2">
      {/* Back button */}
      <div>
        <button
          onClick={() => setActiveTab('projects')}
          className="glass-button inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-gray-900 transition-colors py-1.5 px-3 rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Projects</span>
        </button>
      </div>

      {/* Colorful Project Banner (Owns one pastel color) */}
      <div 
        className="glass rounded-3xl p-6 sm:p-8 border relative overflow-hidden transition-all"
        style={{ 
          background: theme.glassGradient,
          borderColor: theme.glassBorder,
          boxShadow: `inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.95), 0 16px 36px -8px ${theme.shadow}, 0 4px 12px -2px rgba(0,0,0,0.03)`
        }}
      >
        {/* Subtle geometric SVG accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none opacity-20 overflow-hidden flex items-center justify-end">
          <svg viewBox="0 0 300 300" className="w-[300px] h-[300px] text-white fill-current transform translate-x-10">
            <circle cx="150" cy="150" r="120" />
            <path d="M 50,150 A 100,100 0 0,0 250,150 Z" opacity="0.5" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            {/* Category & Status */}
            <div className="flex flex-wrap items-center gap-2">
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold tracking-wide glass-pill shadow-2xs"
                style={{ color: theme.badgeText }}
              >
                {project.category}
              </span>
              <span className="text-xs font-semibold text-gray-500">·</span>
              <span 
                className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide glass-pill text-gray-800 shadow-2xs"
              >
                {project.status}
              </span>
              <span className="text-xs font-semibold text-gray-500">·</span>
              <span className="text-xs font-bold text-gray-800">Due {project.dueDate}</span>
            </div>

            {/* Title & Emoji Icon */}
            <div className="flex items-start gap-4 pt-1">
              <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center text-3xl shrink-0">
                {project.iconEmoji}
              </div>
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
                  {project.name}
                </h1>
                <p className="text-sm text-gray-800 font-medium mt-1 leading-relaxed">
                  {project.tagLine}
                </p>
              </div>
            </div>
          </div>

          {/* Right Banner Card: Progress + Actions */}
          <div className="glass-card p-4 sm:p-5 rounded-2xl shadow-xs space-y-3 min-w-[260px]">
            <div className="flex items-center justify-between text-xs font-bold text-gray-800">
              <span>Overall Progress</span>
              <span className="tabular-nums font-extrabold text-base" style={{ color: theme.primaryDark }}>
                {progress}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-white/70 rounded-full overflow-hidden p-0.5 border border-white/60">
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out shadow-xs"
                style={{ width: `${progress}%`, backgroundColor: theme.primary }}
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-xs text-gray-700">
              <div className="flex items-center -space-x-1.5">
                {members.slice(0, 4).map((m) => (
                  <div
                    key={m.id}
                    title={`${m.name} (${m.role})`}
                    className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold shadow-2xs"
                    style={{ backgroundColor: `${m.avatarColor}25` }}
                  >
                    <UserAvatar user={m} />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditProjectModal(project)}
                  className="glass-button p-1.5 rounded-lg text-gray-700 hover:text-gray-900"
                  title="Edit Project"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                {confirmDelete ? (
                  <div className="flex items-center gap-1.5 glass-strong px-2 py-1 rounded-xl">
                    <span className="text-[11px] font-bold text-rose-700">Delete?</span>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="px-2 py-0.5 text-[11px] font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-2 py-0.5 text-[11px] font-semibold text-gray-700 rounded-lg hover:bg-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="glass-button p-1.5 rounded-lg text-rose-600 hover:text-rose-800"
                    title="Archive Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 glass-strong rounded-2xl shadow-2xs overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = projectSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setProjectSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white/90 text-purple-950 shadow-xs border border-white'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-purple-700' : 'text-gray-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Tab Views */}
      <div className="pt-2">
        {projectSubTab === 'overview' && <ProjectOverview projectId={projectId} />}
        {projectSubTab === 'board' && <KanbanBoard projectId={projectId} />}
        {projectSubTab === 'timeline' && <ProjectTimeline projectId={projectId} />}
        {projectSubTab === 'team' && <ProjectTeam projectId={projectId} />}
        {projectSubTab === 'files' && <ProjectFiles projectId={projectId} />}
      </div>
    </div>
  );
};

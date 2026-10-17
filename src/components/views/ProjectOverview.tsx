import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Users, 
  Layers, 
  Calendar, 
  ArrowRight,
  Sparkles,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getProjectTheme, PRIORITY_CONFIG } from '../../utils/theme';
import { UserAvatar } from '../UserAvatar';

interface ProjectOverviewProps {
  projectId: string;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({ projectId }) => {
  const { 
    getProject, 
    getProjectTasks, 
    getProjectMembers, 
    getProjectProgress, 
    setProjectSubTab, 
    openEditTaskModal,
    openCreateTaskModal,
    activities,
    getUser
  } = useApp();

  const project = getProject(projectId);
  if (!project) return null;

  const theme = getProjectTheme(project.color);
  const tasks = getProjectTasks(projectId);
  const members = getProjectMembers(projectId);
  const progress = getProjectProgress(projectId);

  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const reviewCount = tasks.filter((t) => t.status === 'review').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;

  const projectActivities = activities.filter((a) => a.projectId === projectId || a.projectName === project.name);

  return (
    <div className="space-y-6">
      {/* 4 Quick Stat Cards with Project Pastel Accents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-3xl border border-purple-100/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-700 text-xs font-semibold">
            <span>Overall Progress</span>
            <span className="p-1.5 rounded-xl bg-purple-50 text-purple-700">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tabular-nums">
              {progress}%
            </span>
            <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: theme.primary }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-3xl border border-purple-100/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-700 text-xs font-semibold">
            <span>In Progress</span>
            <span className="p-1.5 rounded-xl bg-sky-50 text-sky-700">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-sky-700 tabular-nums">
              {inProgressCount}
            </span>
            <span className="text-xs text-gray-600 block mt-1 font-medium">Active workstreams</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-3xl border border-purple-100/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-700 text-xs font-semibold">
            <span>In Review</span>
            <span className="p-1.5 rounded-xl bg-amber-50 text-amber-700">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 tabular-nums">
              {reviewCount}
            </span>
            <span className="text-xs text-gray-600 block mt-1 font-medium">Awaiting sign-off</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-3xl border border-purple-100/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-700 text-xs font-semibold">
            <span>Completed</span>
            <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tabular-nums">
              {doneCount}/{tasks.length}
            </span>
            <span className="text-xs text-gray-600 block mt-1 font-medium">Tasks resolved</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Key Tasks and Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* About This Project */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-purple-100/80 shadow-xs">
            <h3 className="font-heading text-base font-bold text-gray-900 mb-2">
              Project Brief & Objectives
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              {project.description}
            </p>

            <div className="mt-4 pt-4 border-t border-purple-50 flex flex-wrap gap-4 text-xs font-semibold text-gray-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Target Launch: <strong className="text-gray-900">{project.dueDate}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Team: <strong className="text-gray-900">{members.length} Collaborators</strong></span>
              </div>
            </div>
          </div>

          {/* Active Tasks List Preview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-purple-100/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading text-base font-bold text-gray-900">
                  Project Tasks
                </h3>
                <span className="text-xs text-gray-600 font-medium">
                  {tasks.length} total tasks registered
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openCreateTaskModal(projectId)}
                  className="flex items-center gap-1 text-xs font-bold text-white px-3 py-1.5 rounded-xl shadow-xs"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
                <button
                  onClick={() => setProjectSubTab('board')}
                  className="flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 px-3 py-1.5 rounded-xl"
                >
                  <span>Open Kanban</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-purple-50">
              {tasks.slice(0, 5).map((t) => {
                const priority = PRIORITY_CONFIG[t.priority];
                const assignee = getUser(t.assigneeId);

                return (
                  <div
                    key={t.id}
                    onClick={() => openEditTaskModal(t)}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-purple-50/50 rounded-xl px-2 -mx-2 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: priority.dot }}
                      />
                      <div className="truncate">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {t.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                          <span className="capitalize">{t.status.replace('_', ' ')}</span>
                          <span>·</span>
                          <span>Due {t.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {assignee && (
                        <div 
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shadow-xs"
                          style={{ backgroundColor: `${assignee.avatarColor}20` }}
                          title={assignee.name}
                        >
                          <UserAvatar user={assignee} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Team Roster & Project Action Stream */}
        <div className="space-y-6">
          {/* Team Members */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-purple-100/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-base font-bold text-gray-900">
                Project Squad
              </h3>
              <button
                onClick={() => setProjectSubTab('team')}
                className="text-xs font-bold text-purple-700 hover:text-purple-900"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-xs shrink-0"
                    style={{ backgroundColor: `${member.avatarColor}20` }}
                  >
                    <UserAvatar user={member} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 truncate">{member.name}</p>
                    <p className="text-[11px] text-gray-600 truncate">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Activity Stream */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-purple-100/80 shadow-xs">
            <h3 className="font-heading text-base font-bold text-gray-900 mb-3">
              Sprint Activity
            </h3>
            <div className="space-y-3">
              {projectActivities.length > 0 ? (
                projectActivities.slice(0, 4).map((act) => (
                  <div key={act.id} className="text-xs flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg overflow-hidden shrink-0">
                      <UserAvatar user={act} />
                    </span>
                    <div className="leading-snug">
                      <p className="text-gray-900">
                        <strong className="text-gray-900">{act.userName}</strong> {act.action}{' '}
                        <span className="font-medium text-purple-900">&quot;{act.targetTitle}&quot;</span>
                      </p>
                      <span className="text-[10px] text-gray-500 font-medium">{act.timestamp}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No actions recorded for this project yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

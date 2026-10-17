import React, { useState } from 'react';
import { 
  UserPlus, 
  Mail, 
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getProjectTheme } from '../../utils/theme';
import { UserAvatar } from '../UserAvatar';

export const TeamView: React.FC = () => {
  const { 
    users, 
    tasks, 
    projects, 
    currentUser, 
    setCurrentUser, 
    openInviteModal, 
    openEditTaskModal,
    openProject
  } = useApp();

  const [selectedMemberId, setSelectedMemberId] = useState<string>(currentUser.id);

  const selectedMember = users.find((u) => u.id === selectedMemberId) || users[0];
  const memberTasks = tasks.filter((t) => t.assigneeId === selectedMember.id);
  const memberCompletedTasks = memberTasks.filter((t) => t.status === 'done');
  const memberProjects = projects.filter((p) => p.members.includes(selectedMember.id));

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Team & People
          </h1>
          <p className="text-sm text-gray-700 font-medium mt-1">
            Collaborators, roles, workload distributions, and assignments
          </p>
        </div>

        <button
          onClick={openInviteModal}
          className="flex items-center gap-2 py-2.5 px-5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite New Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Member Directory List */}
        <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-purple-100/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-50">
            <h2 className="font-heading text-base font-bold text-gray-900">
              Workspace Roster ({users.length})
            </h2>
            <span className="text-xs text-purple-700 font-bold">Active</span>
          </div>

          <div className="space-y-2">
            {users.map((user) => {
              const isSelected = user.id === selectedMember.id;
              const isCurrent = user.id === currentUser.id;
              const userTasks = tasks.filter((t) => t.assigneeId === user.id);

              return (
                <div
                  key={user.id}
                  onClick={() => setSelectedMemberId(user.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-100/80 border-purple-300 shadow-xs'
                      : 'bg-purple-50/30 hover:bg-purple-50/70 border-purple-100/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-xs shrink-0"
                      style={{ backgroundColor: `${user.avatarColor}20`, border: `1px solid ${user.avatarColor}35` }}
                    >
                      <UserAvatar user={user} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-heading text-sm font-bold text-gray-900 truncate">
                          {user.name}
                        </span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-200 text-purple-900">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 truncate font-medium">{user.role}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-purple-900 tabular-nums">
                      {userTasks.length} tasks
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Member Profile & Assigned Tasks (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Member Card Header */}
          <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0"
                  style={{ backgroundColor: `${selectedMember.avatarColor}25`, border: `1px solid ${selectedMember.avatarColor}40` }}
                >
                  <UserAvatar user={selectedMember} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
                      {selectedMember.name}
                    </h2>
                    {selectedMember.id !== currentUser.id && (
                      <button
                        onClick={() => setCurrentUser(selectedMember.id)}
                        className="text-xs px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold transition-colors"
                        title="Act as this user"
                      >
                        Switch To This User
                      </button>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-purple-700 font-semibold mt-0.5">
                    {selectedMember.role}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 flex items-center gap-1.5 font-medium">
                    <Mail className="w-3.5 h-3.5 text-gray-500" />
                    <span>{selectedMember.email}</span>
                  </p>
                </div>
              </div>

              {/* Workload Metric */}
              <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100 min-w-[180px]">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Workload Completion</span>
                  <span className="tabular-nums font-extrabold text-purple-700">
                    {memberTasks.length > 0 
                      ? Math.round((memberCompletedTasks.length / memberTasks.length) * 100) 
                      : 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${memberTasks.length > 0 ? (memberCompletedTasks.length / memberTasks.length) * 100 : 0}%` 
                    }}
                  />
                </div>
                <div className="text-[11px] text-gray-600 mt-1.5 font-medium">
                  {memberCompletedTasks.length} of {memberTasks.length} tasks completed
                </div>
              </div>
            </div>

            {/* Contributing Projects */}
            <div className="pt-4 border-t border-purple-50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Active Projects ({memberProjects.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {memberProjects.map((p) => {
                  const theme = getProjectTheme(p.color);
                  return (
                    <button
                      key={p.id}
                      onClick={() => openProject(p.id, 'board')}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-bold hover:shadow-xs"
                      style={{ 
                        backgroundColor: theme.badgeBg, 
                        borderColor: theme.border, 
                        color: theme.primaryDark 
                      }}
                    >
                      <span>{p.iconEmoji}</span>
                      <span>{p.name}</span>
                      <ArrowRight className="w-3 h-3 ml-0.5 opacity-60" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Assigned Tasks List */}
          <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-purple-100/80 shadow-xs space-y-4">
            <h3 className="font-heading text-base font-bold text-gray-900">
              Tasks Assigned to {selectedMember.name.split(' ')[0]} ({memberTasks.length})
            </h3>

            <div className="divide-y divide-purple-50">
              {memberTasks.map((task) => {
                const proj = projects.find((p) => p.id === task.projectId);
                const theme = proj ? getProjectTheme(proj.color) : null;
                const isDone = task.status === 'done';

                return (
                  <div
                    key={task.id}
                    onClick={() => openEditTaskModal(task)}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-purple-50/50 rounded-xl px-2 -mx-2 transition-colors cursor-pointer group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {proj && (
                          <span 
                            className="px-2 py-0.5 rounded text-[10px] font-bold"
                            style={{ backgroundColor: theme?.badgeBg, color: theme?.badgeText }}
                          >
                            {proj.name}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 font-medium">Due {task.dueDate}</span>
                      </div>
                      <p className={`font-heading text-sm font-bold text-gray-900 group-hover:text-purple-900 transition-colors ${
                        isDone ? 'line-through text-gray-400' : ''
                      }`}>
                        {task.title}
                      </p>
                    </div>

                    <span className="text-xs font-bold capitalize px-2.5 py-1 rounded-full bg-purple-50 text-purple-900 shrink-0">
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                );
              })}

              {memberTasks.length === 0 && (
                <div className="py-12 text-center text-xs text-gray-500">
                  No tasks currently assigned to this team member.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

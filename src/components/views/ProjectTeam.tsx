import React, { useState } from 'react';
import { UserPlus, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getProjectTheme } from '../../utils/theme';
import { UserAvatar } from '../UserAvatar';

interface ProjectTeamProps {
  projectId: string;
}

export const ProjectTeam: React.FC<ProjectTeamProps> = ({ projectId }) => {
  const { 
    getProject, 
    getProjectMembers, 
    getProjectTasks, 
    users, 
    updateProject, 
    openInviteModal 
  } = useApp();

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const project = getProject(projectId);
  if (!project) return null;

  const theme = getProjectTheme(project.color);
  const projectMembers = getProjectMembers(projectId);
  const tasks = getProjectTasks(projectId);

  // Available users not yet in this project
  const availableUsers = users.filter((u) => !project.members.includes(u.id));

  const handleAddMemberToProject = (userId: string) => {
    updateProject({
      ...project,
      members: [...project.members, userId],
    });
    setIsAddMemberOpen(false);
  };

  const handleRemoveMemberFromProject = (userId: string) => {
    if (project.members.length <= 1) return; // keep at least 1 member
    updateProject({
      ...project,
      members: project.members.filter((id) => id !== userId),
    });
  };

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-purple-100/80 shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-purple-50">
        <div>
          <h3 className="font-heading text-lg font-bold text-gray-900">
            Project Team & Collaborators
          </h3>
          <p className="text-xs text-gray-600 font-medium mt-0.5">
            {projectMembers.length} active members contributing to this project
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsAddMemberOpen(!isAddMemberOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs"
              style={{ backgroundColor: theme.primary }}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>

            {isAddMemberOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-purple-100 p-2 z-30 animate-in fade-in">
                <p className="text-xs font-bold text-gray-700 px-2 py-1">
                  Assign Existing Teammate
                </p>
                {availableUsers.length > 0 ? (
                  <div className="space-y-1">
                    {availableUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleAddMemberToProject(u.id)}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-left hover:bg-purple-50 text-xs transition-colors"
                      >
                        <span className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-xs">
                          <UserAvatar user={u} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-gray-900 truncate">{u.name}</p>
                          <p className="text-[11px] text-gray-600 truncate">{u.role}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 p-2">All workspace members are already on this team.</p>
                )}

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={() => {
                      setIsAddMemberOpen(false);
                      openInviteModal();
                    }}
                    className="w-full text-center py-1.5 text-xs font-bold text-purple-700 hover:text-purple-900"
                  >
                    + Invite New Workspace User
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Team Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectMembers.map((member) => {
          const assignedTasks = tasks.filter((t) => t.assigneeId === member.id);
          const completedTasks = assignedTasks.filter((t) => t.status === 'done');

          return (
            <div 
              key={member.id}
              className="bg-purple-50/30 hover:bg-purple-50/70 p-5 rounded-2xl border border-purple-100/70 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs"
                    style={{ backgroundColor: `${member.avatarColor}20`, border: `1px solid ${member.avatarColor}30` }}
                  >
                    <UserAvatar user={member} />
                  </div>

                  {project.members.length > 1 && (
                    <button
                      onClick={() => handleRemoveMemberFromProject(member.id)}
                      className="text-xs text-gray-600 hover:text-rose-600 font-medium"
                      title="Remove from project"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="mt-3">
                  <h4 className="font-heading text-sm font-bold text-gray-900">
                    {member.name}
                  </h4>
                  <p className="text-xs text-purple-700 font-semibold mt-0.5">
                    {member.role}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 flex items-center gap-1 font-medium">
                    <Mail className="w-3 h-3 text-gray-600" />
                    <span>{member.email}</span>
                  </p>
                </div>
              </div>

              {/* Workload stats */}
              <div className="mt-4 pt-3 border-t border-purple-100/60 flex items-center justify-between text-xs font-semibold text-gray-700">
                <span>Assigned Tasks</span>
                <span className="font-bold text-gray-900 tabular-nums">
                  {completedTasks.length}/{assignedTasks.length} Completed
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

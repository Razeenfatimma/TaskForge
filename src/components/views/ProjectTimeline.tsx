import React from 'react';
import { Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../../utils/theme';
import { UserAvatar } from '../UserAvatar';

interface ProjectTimelineProps {
  projectId: string;
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ projectId }) => {
  const { getProjectTasks, openEditTaskModal, getUser } = useApp();

  const tasks = getProjectTasks(projectId);

  // Sort tasks chronologically by dueDate
  const sortedTasks = [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-purple-100/80 shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-purple-50">
        <div>
          <h3 className="font-heading text-lg font-bold text-gray-900">
            Project Milestone Timeline
          </h3>
          <p className="text-xs text-gray-600 font-medium mt-0.5">
            Chronological task schedule and delivery milestones
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Done</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Review</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>To Do</span>
          </div>
        </div>
      </div>

      {/* Visual Timeline list */}
      <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-purple-200">
        {sortedTasks.map((task) => {
          const status = STATUS_CONFIG[task.status];
          const priority = PRIORITY_CONFIG[task.priority];
          const assignee = getUser(task.assigneeId);

          return (
            <div 
              key={task.id}
              onClick={() => openEditTaskModal(task)}
              className="relative group cursor-pointer"
            >
              {/* Timeline Node Icon */}
              <div 
                className="absolute -left-6 top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-xs border-2 border-white ring-2 ring-purple-100 transition-transform group-hover:scale-125"
                style={{ backgroundColor: status.headerColor }}
              >
                {task.status === 'done' ? '✓' : '•'}
              </div>

              {/* Task Content Card */}
              <div className="ml-3 bg-purple-50/40 hover:bg-purple-50/80 p-4 rounded-2xl border border-purple-100/70 transition-all hover:shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide"
                      style={{ backgroundColor: status.bg, color: status.text }}
                    >
                      {status.label}
                    </span>
                    <span 
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                      style={{ backgroundColor: priority.bg, color: priority.text }}
                    >
                      {priority.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>Target: {task.dueDate}</span>
                  </div>
                </div>

                <h4 className="font-heading text-sm font-bold text-gray-900 group-hover:text-purple-900 transition-colors">
                  {task.title}
                </h4>

                {task.description && (
                  <p className="text-xs text-gray-700 line-clamp-1 mt-1 font-medium">
                    {task.description}
                  </p>
                )}

                {/* Progress Bar & Assignee */}
                <div className="mt-3 flex items-center justify-between gap-4">
                  <div className="flex-1 max-w-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 mb-1">
                      <span>Progress</span>
                      <span className="tabular-nums">{task.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200/80 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%`, backgroundColor: status.headerColor }}
                      />
                    </div>
                  </div>

                  {assignee && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-700">
                      <span className="w-6 h-6 rounded-lg overflow-hidden">
                        <UserAvatar user={assignee} />
                      </span>
                      <span className="font-semibold text-gray-800">{assignee.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

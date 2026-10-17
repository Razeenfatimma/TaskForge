import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Search, 
  Filter, 
  CheckSquare,
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { STATUS_CONFIG, PRIORITY_CONFIG, getProjectTheme } from '../../utils/theme';
import { UserAvatar } from '../UserAvatar';

export const TasksView: React.FC = () => {
  const { 
    tasks, 
    projects, 
    currentUser, 
    getProject, 
    getUser, 
    openCreateTaskModal, 
    openEditTaskModal, 
    moveTask
  } = useApp();

  const [tabFilter, setTabFilter] = useState<'all' | 'my'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter((t) => {
    if (tabFilter === 'my' && t.assigneeId !== currentUser.id) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (projectFilter !== 'all' && t.projectId !== projectFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match = t.title.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q) ||
                    t.tags.some(tag => tag.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Workspace Tasks
          </h1>
          <p className="text-sm text-gray-700 font-medium mt-1">
            Global task queue across all active project streams
          </p>
        </div>

        <button
          onClick={() => openCreateTaskModal()}
          className="flex items-center gap-2 py-2.5 px-5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Task</span>
        </button>
      </div>

      {/* Primary Tab Switcher & Filters */}
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-3xl border border-purple-100/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* All / My Tasks Toggle */}
          <div className="flex items-center gap-1 p-1 bg-purple-50 rounded-2xl">
            <button
              onClick={() => setTabFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tabFilter === 'all'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setTabFilter('my')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                tabFilter === 'my'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>My Tasks</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-800">
                {tasks.filter((t) => t.assigneeId === currentUser.id).length}
              </span>
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-purple-50/50 rounded-xl border border-purple-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-900 font-medium"
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-purple-50 text-xs">
          <div className="flex items-center gap-1.5 text-gray-600 font-semibold">
            <Filter className="w-3.5 h-3.5 text-purple-600" />
            <span>Filter By:</span>
          </div>

          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-purple-50/60 border border-purple-100 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.iconEmoji} {p.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-purple-50/60 border border-purple-100 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-purple-50/60 border border-purple-100 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {(statusFilter !== 'all' || priorityFilter !== 'all' || projectFilter !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setPriorityFilter('all');
                setProjectFilter('all');
                setSearchTerm('');
              }}
              className="text-xs text-purple-700 hover:text-purple-900 font-bold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Tasks Table / List */}
      <div className="bg-white/85 backdrop-blur-sm rounded-3xl border border-purple-100/80 shadow-xs overflow-hidden">
        <div className="divide-y divide-purple-50">
          {filteredTasks.map((task) => {
            const proj = getProject(task.projectId);
            const projTheme = proj ? getProjectTheme(proj.color) : null;
            const priority = PRIORITY_CONFIG[task.priority];
            const status = STATUS_CONFIG[task.status];
            const assignee = getUser(task.assigneeId);
            const isDone = task.status === 'done';

            return (
              <div
                key={task.id}
                onClick={() => openEditTaskModal(task)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-purple-50/40 transition-colors cursor-pointer group"
              >
                {/* Left: Checkbox + Title + Project */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveTask(task.id, isDone ? 'todo' : 'done');
                    }}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 sm:mt-0 ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-gray-300 hover:border-purple-500 bg-white'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {proj && (
                        <span 
                          className="px-2 py-0.5 rounded-md text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs"
                          style={{ backgroundColor: projTheme?.badgeBg, color: projTheme?.badgeText }}
                        >
                          <span>{proj.iconEmoji}</span>
                          <span className="truncate max-w-[120px]">{proj.name}</span>
                        </span>
                      )}

                      <span 
                        className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide"
                        style={{ backgroundColor: priority.bg, color: priority.text }}
                      >
                        {priority.label}
                      </span>
                    </div>

                    <h3 className={`font-heading text-sm sm:text-base font-bold text-gray-900 group-hover:text-purple-900 transition-colors ${
                      isDone ? 'line-through text-gray-400' : ''
                    }`}>
                      {task.title}
                    </h3>
                  </div>
                </div>

                {/* Right: Meta, Assignee, Status */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 text-xs pl-9 sm:pl-0">
                  <div className="flex items-center gap-1 text-gray-600 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="tabular-nums">{task.dueDate}</span>
                  </div>

                  <span 
                    className="px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: status.bg, color: status.text }}
                  >
                    {status.label}
                  </span>

                  {assignee && (
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shadow-xs shrink-0"
                      style={{ backgroundColor: `${assignee.avatarColor}20` }}
                      title={`Assigned to ${assignee.name}`}
                    >
                      <UserAvatar user={assignee} />
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditTaskModal(task);
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white shadow-2xs"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredTasks.length === 0 && (
            <div className="py-16 text-center text-gray-500 text-xs">
              No tasks match your current filter conditions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

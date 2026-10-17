import React, { useState } from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  CheckSquare, 
  Search, 
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaskStatus } from '../../types';
import { STATUS_CONFIG, PRIORITY_CONFIG, getProjectTheme } from '../../utils/theme';
import { UserAvatar } from '../UserAvatar';

interface KanbanBoardProps {
  projectId: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const { 
    getProjectTasks, 
    moveTask, 
    openCreateTaskModal, 
    openEditTaskModal, 
    getUser, 
    getProject,
    deleteTask
  } = useApp();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<TaskStatus | null>(null);
  const [quickMenuTaskId, setQuickMenuTaskId] = useState<string | null>(null);
  const [boardSearch, setBoardSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const project = getProject(projectId);
  const projectTheme = project ? getProjectTheme(project.color) : null;
  const tasks = getProjectTasks(projectId);

  // Column definitions
  const columns: { status: TaskStatus; label: string }[] = [
    { status: 'todo', label: 'To Do' },
    { status: 'in_progress', label: 'In Progress' },
    { status: 'review', label: 'Review' },
    { status: 'done', label: 'Done' },
  ];

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropColumn !== status) {
      setActiveDropColumn(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if leaving the column boundary
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setActiveDropColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      moveTask(taskId, status);
    }
    setDraggedTaskId(null);
    setActiveDropColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setActiveDropColumn(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(boardSearch.toLowerCase()) || 
                          t.description.toLowerCase().includes(boardSearch.toLowerCase()) ||
                          t.tags.some(tag => tag.toLowerCase().includes(boardSearch.toLowerCase()));
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-4">
      {/* Board Controls: Search & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-strong p-3 rounded-2xl">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter tasks on board..."
              value={boardSearch}
              onChange={(e) => setBoardSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs glass-input rounded-xl text-gray-900 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <span>Priority:</span>
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs glass-input rounded-xl px-2.5 py-1.5 font-bold text-gray-800 outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            onClick={() => openCreateTaskModal(projectId)}
            className="btn-glossy flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold text-white"
            style={{ backgroundColor: projectTheme?.primary || '#8B5CF6' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Columns Grid - All 4 columns have identical frosted glass softness */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colConfig = STATUS_CONFIG[col.status];
          const colTasks = filteredTasks.filter((t) => t.status === col.status);
          const isDropTarget = activeDropColumn === col.status;

          return (
            <div
              key={col.status}
              onDragOver={(e) => handleDragOver(e, col.status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.status)}
              className={`rounded-3xl p-4 border transition-all duration-200 min-h-[500px] flex flex-col glass-subtle ${
                isDropTarget
                  ? 'ring-2 ring-purple-400 bg-white/70 border-white scale-[1.01] shadow-xl'
                  : ''
              }`}
              style={{
                backgroundColor: isDropTarget ? 'rgba(255, 255, 255, 0.75)' : colConfig.columnBg,
                borderColor: isDropTarget ? 'rgba(255, 255, 255, 1)' : colConfig.border,
              }}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/50">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full shadow-xs"
                    style={{ backgroundColor: colConfig.headerColor }}
                  />
                  <h3 className="font-heading text-sm font-bold text-gray-900">
                    {col.label}
                  </h3>
                  <span 
                    className="px-2 py-0.5 rounded-full text-xs font-extrabold tabular-nums glass-pill"
                    style={{ color: colConfig.headerColor }}
                  >
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => openCreateTaskModal(projectId)}
                  className="glass-button p-1 rounded-lg text-gray-600 hover:text-gray-900"
                  title={`Add task to ${col.label}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Task Cards Container */}
              <div className="space-y-3 flex-1">
                {colTasks.map((task) => {
                  const priority = PRIORITY_CONFIG[task.priority];
                  const assignee = getUser(task.assigneeId);
                  const isBeingDragged = draggedTaskId === task.id;
                  const isMenuOpen = quickMenuTaskId === task.id;
                  const completedSubtasks = task.checklist.filter((c) => c.completed).length;

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => openEditTaskModal(task)}
                      className={`group relative glass-card rounded-2xl p-4 cursor-grab active:cursor-grabbing transition-all duration-200 select-none ${
                        isBeingDragged ? 'card-dragging' : 'hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Top: Priority + Mobile/Touch Fallback Move Menu */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span 
                          className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide glass-pill shadow-2xs"
                          style={{ 
                            backgroundColor: priority.bg, 
                            color: priority.text,
                            borderColor: priority.border
                          }}
                        >
                          {priority.label}
                        </span>

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickMenuTaskId(isMenuOpen ? null : task.id);
                            }}
                            className="glass-button p-1 rounded-lg text-gray-400 hover:text-gray-700"
                            title="Task options & move"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {/* Quick 'Move to' Fallback menu for touch and rapid workflow */}
                          {isMenuOpen && (
                            <div 
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 mt-1 w-44 glass-strong rounded-2xl shadow-2xl p-2 z-40 animate-in fade-in"
                            >
                              <div className="text-[10px] font-bold text-gray-500 uppercase px-2 py-1">
                                Move to...
                              </div>
                              {columns.map((c) => (
                                <button
                                  key={c.status}
                                  onClick={() => {
                                    moveTask(task.id, c.status);
                                    setQuickMenuTaskId(null);
                                  }}
                                  disabled={task.status === c.status}
                                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                                    task.status === c.status 
                                      ? 'bg-purple-100/70 text-purple-950 font-bold opacity-70 cursor-default'
                                      : 'hover:bg-white/80 text-gray-800'
                                  }`}
                                >
                                  <span>{c.label}</span>
                                  {task.status === c.status && <CheckCircle2 className="w-3 h-3 text-purple-600" />}
                                </button>
                              ))}

                              <div className="border-t border-white/60 my-1 pt-1">
                                <button
                                  onClick={() => {
                                    setQuickMenuTaskId(null);
                                    openEditTaskModal(task);
                                  }}
                                  className="w-full text-left px-2 py-1.5 text-xs text-gray-800 hover:bg-white/80 rounded-xl font-bold"
                                >
                                  Edit Details
                                </button>
                                <button
                                  onClick={() => {
                                    setQuickMenuTaskId(null);
                                    deleteTask(task.id);
                                  }}
                                  className="w-full text-left px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold"
                                >
                                  Delete Task
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="font-heading text-sm font-bold text-gray-900 leading-snug group-hover:text-purple-950 transition-colors mb-1.5">
                        {task.title}
                      </h4>

                      {/* Description preview */}
                      {task.description && (
                        <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed mb-3">
                          {task.description}
                        </p>
                      )}

                      {/* Checklist progress strip if items exist */}
                      {task.checklist && task.checklist.length > 0 && (
                        <div className="mb-3 glass-subtle p-2 rounded-xl">
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 mb-1">
                            <span className="flex items-center gap-1">
                              <CheckSquare className="w-3 h-3 text-purple-600" />
                              <span>Subtasks</span>
                            </span>
                            <span className="tabular-nums">
                              {completedSubtasks}/{task.checklist.length}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200/70 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-600 rounded-full transition-all duration-300"
                              style={{ width: `${(completedSubtasks / task.checklist.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Bottom row: Assignee Avatar + Due Date */}
                      <div className="pt-2 border-t border-white/60 flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span className="tabular-nums font-semibold text-gray-700">{task.dueDate}</span>
                        </div>

                        {assignee && (
                          <div 
                            className="w-6 h-6 rounded-lg glass-pill flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: `${assignee.avatarColor}25` }}
                            title={`Assigned to ${assignee.name}`}
                          >
                            <UserAvatar user={assignee} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-white/80 rounded-2xl flex flex-col items-center justify-center text-center p-4 glass-subtle">
                    <p className="text-xs font-semibold text-gray-400">
                      No tasks in {col.label}
                    </p>
                    <button
                      onClick={() => openCreateTaskModal(projectId)}
                      className="mt-2 text-xs font-bold text-purple-700 hover:text-purple-900"
                    >
                      + Add a task
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

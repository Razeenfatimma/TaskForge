import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  CheckSquare, 
  Calendar, 
  Clock, 
  User as UserIcon,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority, TaskStatus, ChecklistItem } from '../../types';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../../utils/theme';
import { formatLocalDate } from '../../utils/date';

export const TaskModal: React.FC = () => {
  const { 
    isTaskModalOpen, 
    closeTaskModal, 
    editingTask, 
    taskModalDefaultProjectId,
    projects, 
    users, 
    createTask, 
    updateTask, 
    deleteTask,
    currentUser
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [progress, setProgress] = useState(0);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setConfirmDelete(false);
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setProjectId(editingTask.projectId);
      setStatus(editingTask.status);
      setPriority(editingTask.priority);
      setAssigneeId(editingTask.assigneeId);
      setDueDate(editingTask.dueDate);
      setProgress(editingTask.progress);
      setTags(editingTask.tags || []);
      setChecklist(editingTask.checklist || []);
    } else {
      setTitle('');
      setDescription('');
      setProjectId(taskModalDefaultProjectId || projects[0]?.id || '');
      setStatus('todo');
      setPriority('medium');
      setAssigneeId(currentUser.id);
      setDueDate(formatLocalDate(new Date()));
      setProgress(0);
      setTags(['Sprint']);
      setChecklist([]);
    }
  }, [editingTask, taskModalDefaultProjectId, projects, currentUser, isTaskModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTaskModalOpen) closeTaskModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTaskModalOpen, closeTaskModal]);

  if (!isTaskModalOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    const item: ChecklistItem = {
      id: `c-${Date.now()}`,
      text: newSubtaskText.trim(),
      completed: false,
    };
    const updated = [...checklist, item];
    setChecklist(updated);
    setNewSubtaskText('');
  };

  const handleToggleSubtaskLocal = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    const completedCount = updated.filter((i) => i.completed).length;
    setProgress(Math.round((completedCount / updated.length) * 100));
  };

  const handleRemoveSubtask = (id: string) => {
    setChecklist(checklist.filter((i) => i.id !== id));
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    if (editingTask) {
      updateTask({
        ...editingTask,
        title: title.trim(),
        description: description.trim(),
        projectId,
        status,
        priority,
        assigneeId,
        dueDate,
        progress: Number(progress),
        tags,
        checklist,
      });
    } else {
      createTask({
        title: title.trim(),
        description: description.trim(),
        projectId,
        status,
        priority,
        assigneeId,
        dueDate,
        progress: Number(progress),
        tags,
        checklist,
        commentsCount: 0,
      });
    }

    closeTaskModal();
  };

  const handleDelete = () => {
    if (editingTask) {
      deleteTask(editingTask.id);
      closeTaskModal();
    }
  };

  return (
    <div 
      onClick={closeTaskModal}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-purple-100 max-h-[92vh] overflow-y-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-900">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>

          <button
            onClick={closeTaskModal}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design Interactive Mobile Nav Sheet"
              className="w-full text-sm font-semibold p-3 rounded-2xl bg-purple-50/40 border border-purple-200 outline-none focus:bg-white focus:ring-2 focus:ring-purple-300 text-gray-900"
            />
          </div>

          {/* Project & Assignee row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Project *
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl bg-purple-50/40 border border-purple-200 outline-none text-gray-900"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.iconEmoji} {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Assignee *
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl bg-purple-50/40 border border-purple-200 outline-none text-gray-900"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status & Priority row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  const newStatus = e.target.value as TaskStatus;
                  setStatus(newStatus);
                  if (newStatus === 'done') setProgress(100);
                }}
                className="w-full text-xs font-semibold p-2.5 rounded-xl bg-purple-50/40 border border-purple-200 outline-none text-gray-900"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl bg-purple-50/40 border border-purple-200 outline-none text-gray-900"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl bg-purple-50/40 border border-purple-200 outline-none text-gray-900"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Description & Specifications
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline deliverables, constraints, and criteria for completion..."
              className="w-full text-xs p-3 rounded-2xl bg-purple-50/40 border border-purple-200 outline-none focus:bg-white focus:ring-2 focus:ring-purple-300 text-gray-900"
            />
          </div>

          {/* Checklist Subtasks */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700">
              Checklist / Subtasks
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add subtask item..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 text-xs p-2.5 rounded-xl bg-purple-50/30 border border-purple-200 outline-none"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-2 text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-xl transition-colors"
              >
                Add Item
              </button>
            </div>

            {checklist.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded-xl bg-purple-50/40 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer min-w-0 flex-1">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggleSubtaskLocal(item.id)}
                        className="rounded text-purple-600 focus:ring-purple-400"
                      />
                      <span className={`truncate font-medium ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {item.text}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(item.id)}
                      className="text-gray-400 hover:text-rose-500 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-purple-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="text-xs p-2 rounded-xl bg-purple-50/30 border border-purple-200 outline-none w-40"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
              >
                + Add Tag
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-purple-100 flex items-center justify-between gap-3">
            {editingTask ? (
              confirmDelete ? (
                <div className="flex items-center gap-1.5 bg-rose-50 p-1.5 rounded-xl border border-rose-200">
                  <span className="text-xs font-bold text-rose-700 px-1">Delete task?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-2 py-1 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 p-2 rounded-xl hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Task</span>
                </button>
              )
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeTaskModal}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all active:scale-95"
              >
                {editingTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

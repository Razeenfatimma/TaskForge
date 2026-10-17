import React, { useState, useEffect } from 'react';
import { X, FolderKanban } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectColor } from '../../types';
import { PROJECT_COLORS } from '../../utils/theme';
import { formatLocalDate } from '../../utils/date';
import { UserAvatar } from '../UserAvatar';

export const ProjectModal: React.FC = () => {
  const { 
    isProjectModalOpen, 
    closeProjectModal, 
    editingProject, 
    createProject, 
    updateProject, 
    users 
  } = useApp();

  const [name, setName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<ProjectColor>('purple');
  const [iconEmoji, setIconEmoji] = useState('📱');
  const [category, setCategory] = useState('Product & Design');
  const [dueDate, setDueDate] = useState(() => {
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);
    return formatLocalDate(defaultDueDate);
  });
  const [status, setStatus] = useState<Project['status']>('Active');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const availableEmojis = ['📱', '🌊', '🌱', '☀️', '🌸', '⚡', '🚀', '💻', '🎯', '🛠️', '🎨', '📊', '🌐', '🛡️', '📦', '🔬'];

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name);
      setTagLine(editingProject.tagLine);
      setDescription(editingProject.description);
      setColor(editingProject.color);
      setIconEmoji(editingProject.iconEmoji);
      setCategory(editingProject.category);
      setDueDate(editingProject.dueDate);
      setStatus(editingProject.status);
      setSelectedMembers(editingProject.members || []);
    } else {
      setName('');
      setTagLine('');
      setDescription('');
      setColor('purple');
      setIconEmoji('📱');
      setCategory('Product & Design');
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 14);
      setDueDate(formatLocalDate(defaultDueDate));
      setStatus('Active');
      setSelectedMembers(users.slice(0, 3).map((u) => u.id));
    }
  }, [editingProject, users, isProjectModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isProjectModalOpen) closeProjectModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProjectModalOpen, closeProjectModal]);

  if (!isProjectModalOpen) return null;

  const handleToggleMember = (userId: string) => {
    if (selectedMembers.includes(userId)) {
      if (selectedMembers.length > 1) {
        setSelectedMembers(selectedMembers.filter((id) => id !== userId));
      }
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProject) {
      updateProject({
        ...editingProject,
        name: name.trim(),
        tagLine: tagLine.trim(),
        description: description.trim(),
        color,
        iconEmoji,
        category,
        dueDate,
        status,
        members: selectedMembers,
      });
    } else {
      createProject({
        name: name.trim(),
        tagLine: tagLine.trim(),
        description: description.trim(),
        color,
        iconEmoji,
        category,
        dueDate,
        status,
        members: selectedMembers,
      });
    }

    closeProjectModal();
  };

  return (
    <div 
      onClick={closeProjectModal}
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
              <FolderKanban className="w-4 h-4" />
            </div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-900">
              {editingProject ? 'Edit Project Settings' : 'Create New Project'}
            </h2>
          </div>

          <button
            onClick={closeProjectModal}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Helix Mobile App v3"
              className="w-full text-sm font-semibold p-3 rounded-2xl bg-purple-50/40 border border-purple-200 outline-none focus:bg-white focus:ring-2 focus:ring-purple-300 text-gray-900"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Tagline / Subheading
            </label>
            <input
              type="text"
              value={tagLine}
              onChange={(e) => setTagLine(e.target.value)}
              placeholder="e.g. Redesigning next-generation mobile streaming workflows"
              className="w-full text-xs font-medium p-2.5 rounded-xl bg-purple-50/40 border border-purple-200 outline-none text-gray-900"
            />
          </div>

          {/* Project Color Palette Picker (Lavender, Sky Blue, Mint Green, Coral Orange, Soft Pink) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Project Pastel Color (Owns this tint throughout TaskForge) *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {(Object.keys(PROJECT_COLORS) as ProjectColor[]).map((cKey) => {
                const scheme = PROJECT_COLORS[cKey];
                const isSelected = color === cKey;
                return (
                  <button
                    key={cKey}
                    type="button"
                    onClick={() => setColor(cKey)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'ring-2 ring-purple-600 scale-102 shadow-sm font-bold'
                        : 'opacity-80 hover:opacity-100 hover:scale-101'
                    }`}
                    style={{ background: scheme.gradient, borderColor: scheme.border }}
                  >
                    <div 
                      className="w-5 h-5 rounded-full shadow-2xs"
                      style={{ backgroundColor: scheme.primary }}
                    />
                    <span className="text-[11px] text-gray-900 leading-tight">
                      {scheme.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emoji Icon Picker */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Project Tile Emoji *
            </label>
            <div className="flex flex-wrap gap-2">
              {availableEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIconEmoji(emoji)}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                    iconEmoji === emoji
                      ? 'bg-purple-600 text-white shadow-md scale-110'
                      : 'bg-purple-50 hover:bg-purple-100 text-gray-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Category, Status & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Product & Design"
                className="w-full text-xs font-semibold p-2.5 rounded-xl bg-purple-50/40 border border-purple-200 outline-none text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl bg-purple-50/40 border border-purple-200 outline-none text-gray-900"
              >
                <option value="Active">Active</option>
                <option value="Review">Review</option>
                <option value="Planning">Planning</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Target Launch Date
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
              Project Scope & Overview
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail key milestones, high-level objectives, and architecture..."
              className="w-full text-xs p-3 rounded-2xl bg-purple-50/40 border border-purple-200 outline-none focus:bg-white focus:ring-2 focus:ring-purple-300 text-gray-900"
            />
          </div>

          {/* Team Members Allocation */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Assign Team Members
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {users.map((u) => {
                const isSelected = selectedMembers.includes(u.id);
                return (
                  <div
                    key={u.id}
                    onClick={() => handleToggleMember(u.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-purple-100 border-purple-300 shadow-2xs font-semibold'
                        : 'bg-purple-50/30 border-purple-100 hover:bg-purple-50/70'
                    }`}
                  >
                    <span 
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shadow-2xs"
                      style={{ backgroundColor: `${u.avatarColor}20` }}
                    >
                      <UserAvatar user={u} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-900 truncate">{u.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{u.role}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="rounded text-purple-600 focus:ring-purple-400"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-purple-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeProjectModal}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all active:scale-95"
            >
              {editingProject ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

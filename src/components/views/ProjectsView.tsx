import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  ArrowRight, 
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getProjectTheme } from '../../utils/theme';
import { UserAvatar } from '../UserAvatar';
import { ProjectDetailView } from './ProjectDetailView';

export const ProjectsView: React.FC = () => {
  const { 
    projects, 
    selectedProjectId, 
    openProject, 
    openCreateProjectModal, 
    getProjectProgress,
    getProjectMembers
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // If a specific project is selected, render its detail view
  if (selectedProjectId) {
    return <ProjectDetailView projectId={selectedProjectId} />;
  }

  // Categories extraction
  const categories = ['all', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.tagLine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Workspace Projects
          </h1>
          <p className="text-sm text-gray-700 font-medium mt-1">
            Active sprints, roadmaps, and cross-functional team initiatives
          </p>
        </div>

        <button
          onClick={openCreateProjectModal}
          className="flex items-center gap-2 py-2.5 px-5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/75 backdrop-blur-sm p-3 rounded-2xl border border-purple-100 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-gray-700 hover:bg-purple-100 hover:text-gray-900'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 sm:w-64 max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-purple-50/50 rounded-xl border border-purple-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-900 font-medium"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const theme = getProjectTheme(project.color);
          const progress = getProjectProgress(project.id);
          const members = getProjectMembers(project.id);

          return (
            <div
              key={project.id}
              onClick={() => openProject(project.id, 'overview')}
              className="rounded-3xl p-6 border cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between group"
              style={{
                background: theme.gradient,
                borderColor: theme.border,
                boxShadow: `0 8px 24px -6px ${theme.shadow}`,
                minHeight: '360px'
              }}
            >
              <div>
                {/* Header Icon + Badges */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/95 shadow-sm flex items-center justify-center text-3xl group-hover:scale-105 transition-transform border border-white">
                    {project.iconEmoji}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span 
                      className="px-2.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-2xs"
                      style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
                    >
                      {project.category}
                    </span>
                    <span className="text-[11px] font-extrabold uppercase tracking-wide text-gray-700 bg-white/70 px-2 py-0.5 rounded-md">
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-heading text-xl font-bold text-gray-900 group-hover:text-purple-950 transition-colors leading-snug">
                  {project.name}
                </h3>
                <p className="text-xs text-gray-800 font-medium line-clamp-3 mt-2 leading-relaxed">
                  {project.tagLine}
                </p>
              </div>

              {/* Progress & Bottom Bar */}
              <div className="mt-6 pt-4 border-t border-black/5 space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                    <span>Sprint Completion</span>
                    <span className="tabular-nums font-extrabold" style={{ color: theme.primaryDark }}>
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-white/80 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${progress}%`, backgroundColor: theme.primary }}
                    />
                  </div>
                </div>

                {/* Due Date & Team */}
                <div className="flex items-center justify-between text-xs text-gray-700">
                  <div className="flex items-center gap-1 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-gray-600" />
                    <span>Due {project.dueDate}</span>
                  </div>

                  <div className="flex items-center -space-x-1.5">
                    {members.slice(0, 3).map((m) => (
                      <div
                        key={m.id}
                        className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold shadow-2xs"
                        style={{ backgroundColor: `${m.avatarColor}20` }}
                        title={m.name}
                      >
                        <UserAvatar user={m} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openProject(project.id, 'board');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-xs group-hover:shadow-md transition-all active:scale-95"
                  style={{ backgroundColor: theme.btnBg }}
                >
                  <span>Open Kanban Board</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

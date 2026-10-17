import React, { useRef } from 'react';
import { 
  ArrowRight, 
  Play, 
  Clock, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Layers, 
  Sparkles, 
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getProjectTheme, PRIORITY_CONFIG } from '../../utils/theme';
import { UserAvatar } from '../UserAvatar';

export const HomeView: React.FC = () => {
  const { 
    currentUser, 
    recentProject, 
    projects, 
    openProject, 
    todaysFocusTasks, 
    upcomingDeadlines, 
    activities, 
    getProject, 
    getUser, 
    getProjectProgress,
    getProjectMembers,
    moveTask,
    openEditTaskModal
  } = useApp();

  // Scroll refs for horizontal rows
  const projectsRowRef = useRef<HTMLDivElement>(null);
  const tasksRowRef = useRef<HTMLDivElement>(null);
  const deadlinesRowRef = useRef<HTMLDivElement>(null);

  const scrollRow = (ref: React.RefObject<HTMLDivElement | null>, offset: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const featured = recentProject || projects[0];
  const featuredTheme = featured ? getProjectTheme(featured.color) : null;
  const featuredProgress = featured ? getProjectProgress(featured.id) : 0;
  const featuredMembers = featured ? getProjectMembers(featured.id) : [];

  return (
    <div className="space-y-10 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
      {/* 1. Hero Greeting & Featured 'Continue Where You Left Off' Card */}
      <section className="relative">
        <div className="mb-4">
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            {getGreeting()}, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-700 mt-1 font-medium">
            What would you like to continue today?
          </p>
        </div>

        {featured && featuredTheme && (
          <div 
            className="relative rounded-3xl p-6 sm:p-8 overflow-hidden transition-all duration-300 hover:shadow-2xl border glass"
            style={{ 
              background: featuredTheme.glassGradient,
              borderColor: featuredTheme.glassBorder,
              boxShadow: `inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.9), 0 16px 36px -8px ${featuredTheme.shadow}, 0 4px 12px -2px rgba(0,0,0,0.03)`
            }}
          >
            {/* Subtle SVG geometric shape decor with soft refraction accent */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-20 overflow-hidden flex items-center justify-end">
              <svg viewBox="0 0 400 400" className="w-[450px] h-[450px] text-white fill-current transform translate-x-16 -translate-y-8">
                <circle cx="200" cy="200" r="160" />
                <path d="M 50,200 A 150,150 0 0,0 350,200 Z" opacity="0.4" />
                <rect x="120" y="80" width="160" height="240" rx="40" opacity="0.3" />
              </svg>
            </div>

            <div className="relative z-10 max-w-2xl">
              {/* Category & Status pill */}
              <div className="flex items-center gap-2 mb-3">
                <span 
                  className="px-3 py-1 rounded-full text-xs font-bold tracking-wide glass-pill shadow-2xs"
                  style={{ color: featuredTheme.badgeText }}
                >
                  Featured Workspace
                </span>
                <span className="text-xs font-semibold text-gray-500">·</span>
                <span className="text-xs font-bold text-gray-800">{featured.category}</span>
                <span className="text-xs font-semibold text-gray-500">·</span>
                <span className="text-xs font-bold text-gray-800">Due {featured.dueDate}</span>
              </div>

              {/* Title & Tagline */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center text-3xl shrink-0">
                  {featured.iconEmoji}
                </div>
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-snug">
                    {featured.name}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-800 font-medium line-clamp-2 mt-0.5">
                    {featured.tagLine}
                  </p>
                </div>
              </div>

              {/* Progress & Team Bar */}
              <div className="mt-5 space-y-2 max-w-lg glass-subtle p-4 rounded-2xl">
                <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                  <span>Sprint Completion</span>
                  <span className="tabular-nums text-sm font-extrabold" style={{ color: featuredTheme.primaryDark }}>
                    {featuredProgress}%
                  </span>
                </div>
                <div className="w-full h-3 bg-white/70 rounded-full overflow-hidden p-0.5 border border-white/60">
                  <div 
                    className="h-full rounded-full transition-all duration-500 ease-out shadow-xs"
                    style={{ 
                      width: `${featuredProgress}%`, 
                      backgroundColor: featuredTheme.primary 
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openProject(featured.id, 'board')}
                  className="btn-glossy flex items-center gap-2 py-3 px-6 rounded-2xl text-sm font-bold text-white"
                  style={{ backgroundColor: featuredTheme.btnBg }}
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Continue Where You Left Off</span>
                </button>

                <button
                  onClick={() => openProject(featured.id, 'overview')}
                  className="glass-button flex items-center gap-1.5 py-3 px-5 rounded-2xl text-sm font-bold text-gray-900"
                >
                  <span>Project Overview</span>
                  <ArrowRight className="w-4 h-4 text-gray-600" />
                </button>

                {/* Team Avatars */}
                <div className="flex items-center -space-x-2 ml-auto hidden sm:flex">
                  {featuredMembers.map((m) => (
                    <div
                      key={m.id}
                      title={`${m.name} (${m.role})`}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold shadow-xs"
                      style={{ backgroundColor: `${m.avatarColor}25` }}
                    >
                      <UserAvatar user={m} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. Continue Working: Horizontal row of tall poster-style project tiles */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600" />
            <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-900">
              Continue Working
            </h2>
            <span className="text-xs font-semibold text-gray-600 ml-1">
              ({projects.length} Active Projects)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollRow(projectsRowRef, -320)}
              className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 shadow-xs border border-purple-100 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollRow(projectsRowRef, 320)}
              className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 shadow-xs border border-purple-100 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Poster Row */}
        <div 
          ref={projectsRowRef}
          className="netflix-row flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scroll-smooth"
        >
          {projects.map((project) => {
            const theme = getProjectTheme(project.color);
            const progress = getProjectProgress(project.id);
            const members = getProjectMembers(project.id);

            return (
              <div
                key={project.id}
                onClick={() => openProject(project.id, 'board')}
                className="w-72 shrink-0 snap-start rounded-3xl p-5 border cursor-pointer glass hover-glass-sheen flex flex-col justify-between group"
                style={{
                  background: theme.glassGradient,
                  borderColor: theme.glassBorder,
                  boxShadow: `inset 0 1px 1px 0 rgba(255, 255, 255, 0.9), 0 12px 28px -8px ${theme.shadow}, 0 2px 8px -2px rgba(0,0,0,0.03)`,
                  minHeight: '340px'
                }}
              >
                <div>
                  {/* Top Bar: Icon + Category */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {project.iconEmoji}
                    </div>
                    <span 
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide glass-pill"
                      style={{ color: theme.badgeText }}
                    >
                      {project.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading text-lg font-extrabold text-gray-900 group-hover:text-purple-950 transition-colors leading-snug">
                    {project.name}
                  </h3>
                  <p className="text-xs text-gray-800 font-medium line-clamp-2 mt-1.5 leading-relaxed">
                    {project.tagLine}
                  </p>
                </div>

                {/* Bottom stats and action */}
                <div className="mt-4 pt-4 border-t border-white/50 space-y-3">
                  {/* Progress */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                      <span>Progress</span>
                      <span className="tabular-nums font-extrabold" style={{ color: theme.primaryDark }}>
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/70 rounded-full overflow-hidden p-0.5 border border-white/60">
                      <div 
                        className="h-full rounded-full transition-all duration-300 shadow-xs"
                        style={{ width: `${progress}%`, backgroundColor: theme.primary }}
                      />
                    </div>
                  </div>

                  {/* Due Date & Team Avatars */}
                  <div className="flex items-center justify-between text-xs text-gray-700">
                    <div className="flex items-center gap-1 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-gray-600" />
                      <span>{project.dueDate}</span>
                    </div>

                    <div className="flex items-center -space-x-1.5">
                      {members.slice(0, 3).map((m) => (
                        <div
                          key={m.id}
                          className="w-6 h-6 rounded-full border border-white flex items-center justify-center text-[10px] shadow-xs"
                          style={{ backgroundColor: `${m.avatarColor}25` }}
                          title={m.name}
                        >
                          <UserAvatar user={m} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openProject(project.id, 'board');
                    }}
                    className="btn-glossy w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
                    style={{ backgroundColor: theme.btnBg }}
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Today's Focus: A row of large task cards tinted by priority */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-900">
              Today&apos;s Focus
            </h2>
            <span className="text-xs font-semibold text-gray-600 ml-1">
              (High Priority Tasks)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollRow(tasksRowRef, -320)}
              className="glass-button p-1.5 rounded-xl text-gray-600 hover:text-gray-900"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollRow(tasksRowRef, 320)}
              className="glass-button p-1.5 rounded-xl text-gray-600 hover:text-gray-900"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Focus Cards */}
        <div 
          ref={tasksRowRef}
          className="netflix-row flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scroll-smooth"
        >
          {todaysFocusTasks.map((task) => {
            const proj = getProject(task.projectId);
            const projTheme = proj ? getProjectTheme(proj.color) : null;
            const priorityInfo = PRIORITY_CONFIG[task.priority];
            const assignee = getUser(task.assigneeId);

            return (
              <div
                key={task.id}
                onClick={() => openEditTaskModal(task)}
                className="w-80 shrink-0 snap-start rounded-3xl p-5 border cursor-pointer glass-card hover-glass-sheen flex flex-col justify-between group"
                style={{
                  backgroundColor: priorityInfo.bg,
                  borderColor: priorityInfo.border,
                }}
              >
                <div>
                  {/* Top: Project pill + Priority */}
                  <div className="flex items-center justify-between mb-3">
                    {proj && (
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          openProject(proj.id, 'board');
                        }}
                        className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full glass-pill hover:bg-white transition-colors"
                        style={{ color: projTheme?.primaryDark }}
                      >
                        <span>{proj.iconEmoji}</span>
                        <span className="truncate max-w-[130px]">{proj.name}</span>
                      </span>
                    )}

                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide glass-pill shadow-2xs"
                      style={{ color: priorityInfo.text }}
                    >
                      {priorityInfo.label}
                    </span>
                  </div>

                  {/* Task Title */}
                  <h3 className="font-heading text-base font-bold text-gray-900 group-hover:text-purple-950 transition-colors leading-snug">
                    {task.title}
                  </h3>

                  <p className="text-xs text-gray-700 font-medium line-clamp-2 mt-1.5 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                {/* Bottom Meta & Start Button */}
                <div className="mt-4 pt-3 border-t border-black/5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      {assignee && (
                        <div 
                          className="w-6 h-6 rounded-lg glass-pill flex items-center justify-center text-xs"
                          style={{ backgroundColor: `${assignee.avatarColor}25` }}
                          title={`Assigned to ${assignee.name}`}
                        >
                          <UserAvatar user={assignee} />
                        </div>
                      )}
                      <span className="font-bold text-gray-800">{assignee?.name.split(' ')[0]}</span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-700 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-gray-600" />
                      <span>{task.dueDate}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (task.status === 'todo') {
                          moveTask(task.id, 'in_progress');
                        } else if (task.status === 'in_progress') {
                          moveTask(task.id, 'review');
                        } else {
                          moveTask(task.id, 'done');
                        }
                      }}
                      className="btn-glossy flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-gray-900 flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>
                        {task.status === 'todo' ? 'Start Task' : task.status === 'in_progress' ? 'Move to Review' : 'Mark as Done'}
                      </span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditTaskModal(task);
                      }}
                      className="glass-button p-2 rounded-xl text-xs font-semibold text-gray-700"
                      title="Edit Task Details"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Upcoming Deadlines: Horizontal date-strip timeline color-coded by project */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-600" />
            <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-900">
              Upcoming Deadlines
            </h2>
            <span className="text-xs font-semibold text-gray-600 ml-1">
              (Chronological Timeline)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollRow(deadlinesRowRef, -320)}
              className="glass-button p-1.5 rounded-xl text-gray-600 hover:text-gray-900"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollRow(deadlinesRowRef, 320)}
              className="glass-button p-1.5 rounded-xl text-gray-600 hover:text-gray-900"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Deadline Strip */}
        <div 
          ref={deadlinesRowRef}
          className="netflix-row flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scroll-smooth"
        >
          {upcomingDeadlines.slice(0, 8).map((task) => {
            const proj = getProject(task.projectId);
            const theme = proj ? getProjectTheme(proj.color) : null;
            const assignee = getUser(task.assigneeId);

            // Compute relative urgency label dynamically
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const due = new Date(task.dueDate);
            due.setHours(0, 0, 0, 0);
            const daysDiff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const urgencyLabel = daysDiff < 0 ? 'Overdue' : daysDiff === 0 ? 'Today' : daysDiff === 1 ? 'Tomorrow' : `In ${daysDiff} days`;

            return (
              <div
                key={task.id}
                onClick={() => openEditTaskModal(task)}
                className="w-72 shrink-0 snap-start glass-card hover-glass-sheen rounded-3xl p-4 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Date Chip & Urgency */}
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="px-2.5 py-1 rounded-full text-xs font-extrabold tabular-nums glass-pill"
                      style={{ 
                        color: theme?.badgeText || '#5B21B6'
                      }}
                    >
                      {task.dueDate}
                    </span>
                    <span className="text-[11px] font-bold text-gray-700 glass-pill px-2 py-0.5 rounded-md">
                      {urgencyLabel}
                    </span>
                  </div>

                  {/* Project indicator line */}
                  {proj && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-1">
                      <span>{proj.iconEmoji}</span>
                      <span className="truncate">{proj.name}</span>
                    </div>
                  )}

                  {/* Task Title */}
                  <p className="font-heading text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                    {task.title}
                  </p>
                </div>

                {/* Bottom Assignee & Progress */}
                <div className="mt-3 pt-2.5 border-t border-white/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-700">
                    {assignee && (
                      <span className="w-6 h-6 rounded-lg overflow-hidden shrink-0">
                        <UserAvatar user={assignee} />
                      </span>
                    )}
                    <span className="font-bold text-gray-800">{assignee?.name.split(' ')[0]}</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800">
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Recent Activity: Friendly feed with avatars */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-900">
              Recent Activity
            </h2>
          </div>
          <span className="text-xs text-gray-600 font-medium">Real-time team updates</span>
        </div>

        <div className="glass-strong rounded-3xl p-5 shadow-xs divide-y divide-white/50">
          {activities.slice(0, 6).map((activity) => (
            <div 
              key={activity.id} 
              className="py-3.5 first:pt-1 last:pb-1 flex items-start gap-3.5 transition-colors hover:bg-white/50 rounded-2xl px-2.5 -mx-2.5"
            >
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-xs shrink-0 mt-0.5 border border-white/60"
                style={{ backgroundColor: `${activity.userColor}25` }}
              >
                <UserAvatar user={activity} />
              </div>

              <div className="flex-1 min-w-0 text-xs sm:text-sm">
                <p className="text-gray-900 leading-snug">
                  <span className="font-bold text-gray-900">{activity.userName}</span>{' '}
                  <span className="text-gray-700">{activity.action}</span>{' '}
                  <span className="font-semibold text-purple-950">&quot;{activity.targetTitle}&quot;</span>
                  {activity.projectName && (
                    <span className="text-gray-600"> in <span className="font-bold text-gray-900">{activity.projectName}</span></span>
                  )}
                </p>
                <p className="text-[11px] text-gray-500 font-medium mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getProjectTheme, PRIORITY_CONFIG } from '../../utils/theme';
import { formatLocalDate } from '../../utils/date';

export const CalendarView: React.FC = () => {
  const { tasks, getProject, openCreateTaskModal, openEditTaskModal } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(() => formatLocalDate(new Date()));
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  const daysInMonth = new Date(currentMonth.year, currentMonth.month + 1, 0).getDate();
  const startDayOfWeek = new Date(currentMonth.year, currentMonth.month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(prev => prev.month === 0 ? { year: prev.year - 1, month: 11 } : { ...prev, month: prev.month - 1 });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => prev.month === 11 ? { year: prev.year + 1, month: 0 } : { ...prev, month: prev.month + 1 });
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(formatLocalDate(today));
    setCurrentMonth({ year: today.getFullYear(), month: today.getMonth() });
  };

  // Helper to format date string YYYY-MM-DD
  const formatDateString = (day: number) => {
    const mm = String(currentMonth.month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${currentMonth.year}-${mm}-${dd}`;
  };

  // Group tasks by date
  const tasksByDate = tasks.reduce<Record<string, typeof tasks>>((acc, task) => {
    acc[task.dueDate] = acc[task.dueDate] || [];
    acc[task.dueDate].push(task);
    return acc;
  }, {});

  const selectedDayTasks = tasksByDate[selectedDate] || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Delivery Calendar
          </h1>
          <p className="text-sm text-gray-700 font-medium mt-1">
            Track release schedules, milestones, and task deadlines
          </p>
        </div>

        <button
          onClick={() => openCreateTaskModal()}
          className="flex items-center gap-2 py-2.5 px-5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Scheduled Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid (2 Cols) */}
        <div className="lg:col-span-2 bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-purple-100/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-50">
            <h2 className="font-heading text-lg font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-purple-600" />
              <span>{monthNames[currentMonth.month]} {currentMonth.year}</span>
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToday}
                className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
              >
                Today
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-xl hover:bg-purple-50 text-gray-600 transition-colors"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-xl hover:bg-purple-50 text-gray-600 transition-colors"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 py-1">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {/* Blank offset days */}
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`blank-${i}`} className="h-20 sm:h-24 rounded-2xl bg-purple-50/20" />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = formatDateString(dayNum);
              const dayTasks = tasksByDate[dateStr] || [];
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === formatLocalDate(new Date());

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-20 sm:h-24 rounded-2xl p-1.5 sm:p-2 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-purple-500 bg-purple-100/70 shadow-sm ring-2 ring-purple-300'
                      : isToday
                      ? 'border-purple-300 bg-purple-50/60'
                      : 'border-purple-50 hover:border-purple-200 bg-white/60 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold tabular-nums w-5 h-5 rounded-full flex items-center justify-center ${
                      isToday
                        ? 'bg-purple-600 text-white'
                        : isSelected
                        ? 'text-purple-900 font-extrabold'
                        : 'text-gray-700'
                    }`}>
                      {dayNum}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-[10px] font-extrabold px-1 rounded-md bg-purple-200/80 text-purple-900 tabular-nums">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Task preview pills */}
                  <div className="space-y-1 overflow-hidden">
                    {dayTasks.slice(0, 2).map((t) => {
                      const proj = getProject(t.projectId);
                      const theme = proj ? getProjectTheme(proj.color) : null;
                      return (
                        <div
                          key={t.id}
                          className="text-[10px] font-bold px-1 py-0.5 rounded truncate text-white shadow-2xs"
                          style={{ backgroundColor: theme?.primary || '#8B5CF6' }}
                          title={t.title}
                        >
                          {t.title}
                        </div>
                      );
                    })}
                    {dayTasks.length > 2 && (
                      <span className="text-[9px] text-gray-500 font-bold block truncate">
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda (1 Col) */}
        <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-purple-100/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-50">
            <div>
              <h3 className="font-heading text-base font-bold text-gray-900">
                Scheduled for {selectedDate}
              </h3>
              <p className="text-xs text-gray-600 font-medium">
                {selectedDayTasks.length} tasks due
              </p>
            </div>

            <button
              onClick={() => openCreateTaskModal()}
              className="p-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
              title="Add task for this date"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {selectedDayTasks.map((task) => {
              const proj = getProject(task.projectId);
              const theme = proj ? getProjectTheme(proj.color) : null;
              const priority = PRIORITY_CONFIG[task.priority];

              return (
                <div
                  key={task.id}
                  onClick={() => openEditTaskModal(task)}
                  className="p-3.5 rounded-2xl border border-purple-100/80 bg-purple-50/40 hover:bg-purple-50/80 transition-all cursor-pointer group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    {proj && (
                      <span 
                        className="px-2 py-0.5 rounded text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs"
                        style={{ backgroundColor: theme?.badgeBg, color: theme?.badgeText }}
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

                  <h4 className="font-heading text-sm font-bold text-gray-900 group-hover:text-purple-900 leading-snug">
                    {task.title}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-gray-600 pt-1 border-t border-purple-100/50">
                    <span className="capitalize font-semibold text-purple-700">
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className="font-bold tabular-nums">{task.progress}%</span>
                  </div>
                </div>
              );
            })}

            {selectedDayTasks.length === 0 && (
              <div className="py-16 text-center text-xs text-gray-500">
                <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                No tasks scheduled for this day. Click &quot;+&quot; to plan one.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

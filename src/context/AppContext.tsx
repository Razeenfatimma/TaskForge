import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Project, 
  Task, 
  User, 
  ActivityItem, 
  NotificationItem, 
  ProjectFile, 
  ViewTab, 
  ProjectTab,
  TaskStatus,
  TaskPriority
} from '../types';
import { 
  SEED_PROJECTS, 
  SEED_TASKS, 
  SEED_USERS, 
  SEED_ACTIVITIES, 
  SEED_NOTIFICATIONS, 
  SEED_FILES 
} from '../data/seedData';

interface AppContextType {
  // State
  projects: Project[];
  tasks: Task[];
  users: User[];
  currentUser: User;
  activities: ActivityItem[];
  notifications: NotificationItem[];
  files: ProjectFile[];
  activeTab: ViewTab;
  selectedProjectId: string | null;
  projectSubTab: ProjectTab;
  searchQuery: string;
  
  // Modals
  isTaskModalOpen: boolean;
  editingTask: Task | null;
  taskModalDefaultProjectId: string | null;
  isProjectModalOpen: boolean;
  editingProject: Project | null;
  isInviteModalOpen: boolean;

  // Navigation
  setActiveTab: (tab: ViewTab) => void;
  openProject: (projectId: string, subTab?: ProjectTab) => void;
  setProjectSubTab: (tab: ProjectTab) => void;
  setSearchQuery: (query: string) => void;
  setCurrentUser: (userId: string) => void;

  // Modal controls
  openCreateTaskModal: (defaultProjectId?: string) => void;
  openEditTaskModal: (task: Task) => void;
  closeTaskModal: () => void;
  openCreateProjectModal: () => void;
  openEditProjectModal: (project: Project) => void;
  closeProjectModal: () => void;
  openInviteModal: () => void;
  closeInviteModal: () => void;

  // CRUD Operations
  createTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;

  createProject: (project: Omit<Project, 'id' | 'lastAccessedAt'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;

  inviteMember: (member: Omit<User, 'id' | 'initials'>) => void;
  uploadFile: (file: Omit<ProjectFile, 'id' | 'uploadedAt'>) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  unreadNotificationsCount: number;

  // Derived queries & calculations
  getProjectProgress: (projectId: string) => number;
  getProject: (projectId: string) => Project | undefined;
  getUser: (userId: string) => User | undefined;
  getProjectTasks: (projectId: string) => Task[];
  getProjectMembers: (projectId: string) => User[];
  todaysFocusTasks: Task[];
  upcomingDeadlines: Task[];
  recentProject: Project | undefined;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROJECTS: 'taskforge_projects_v1',
  TASKS: 'taskforge_tasks_v1',
  USERS: 'taskforge_users_v1',
  ACTIVITIES: 'taskforge_activities_v1',
  NOTIFICATIONS: 'taskforge_notifications_v1',
  FILES: 'taskforge_files_v1',
  CURRENT_USER_ID: 'taskforge_current_user_id_v1',
};

// Safe JSON loader with type-guarding against corrupted storage data
function loadStorage<T>(key: string, fallback: T, isArray = true): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (isArray && !Array.isArray(parsed)) {
      console.warn(`Stored value for "${key}" is not an array; using default data.`);
      return fallback;
    }
    return parsed ?? fallback;
  } catch (error) {
    console.error(`Unable to load stored value for "${key}".`, error);
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Unable to save stored value for "${key}".`, error);
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state safely from localStorage or seed defaults
  const [users, setUsers] = useState<User[]>(() =>
    loadStorage<User[]>(STORAGE_KEYS.USERS, SEED_USERS).map((user) => {
      const { avatarUrl: _legacyAvatarUrl, ...cleanUser } = user as User & { avatarUrl?: string };
      return cleanUser;
    })
  );
  const [currentUserId, setCurrentUserId] = useState<string>(() => loadStorage(STORAGE_KEYS.CURRENT_USER_ID, 'user-sarah', false));
  const [projects, setProjects] = useState<Project[]>(() => loadStorage(STORAGE_KEYS.PROJECTS, SEED_PROJECTS));
  const [tasks, setTasks] = useState<Task[]>(() => loadStorage(STORAGE_KEYS.TASKS, SEED_TASKS));
  const [activities, setActivities] = useState<ActivityItem[]>(() =>
    loadStorage<ActivityItem[]>(STORAGE_KEYS.ACTIVITIES, SEED_ACTIVITIES).map((activity) => {
      const { userAvatarUrl: _legacyAvatarUrl, userInitials: _legacyInitials, ...cleanActivity } = activity as ActivityItem & {
        userAvatarUrl?: string;
        userInitials?: string;
      };
      return cleanActivity;
    })
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStorage(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS));
  const [files, setFiles] = useState<ProjectFile[]>(() => loadStorage(STORAGE_KEYS.FILES, SEED_FILES));

  // Navigation
  const [activeTab, setActiveTab] = useState<ViewTab>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectSubTab, setProjectSubTab] = useState<ProjectTab>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskModalDefaultProjectId, setTaskModalDefaultProjectId] = useState<string | null>(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Unified persistence synchronization
  useEffect(() => {
    saveStorage(STORAGE_KEYS.USERS, users);
    saveStorage(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    saveStorage(STORAGE_KEYS.PROJECTS, projects);
    saveStorage(STORAGE_KEYS.TASKS, tasks);
    saveStorage(STORAGE_KEYS.ACTIVITIES, activities);
    saveStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    saveStorage(STORAGE_KEYS.FILES, files);
  }, [users, currentUserId, projects, tasks, activities, notifications, files]);

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0] || SEED_USERS[0];
  }, [users, currentUserId]);

  const setCurrentUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  // Helper getters
  const getUser = (userId: string) => users.find((u) => u.id === userId);
  const getProject = (projectId: string) => projects.find((p) => p.id === projectId);
  const getProjectTasks = (projectId: string) => tasks.filter((t) => t.projectId === projectId);
  const getProjectMembers = (projectId: string) => {
    const proj = getProject(projectId);
    if (!proj) return [];
    return users.filter((u) => proj.members.includes(u.id));
  };

  // Single source of truth calculation for project progress derived from tasks
  const getProjectProgress = (projectId: string): number => {
    const projTasks = tasks.filter((t) => t.projectId === projectId);
    if (projTasks.length === 0) return 0;
    const totalScore = projTasks.reduce((sum, t) => {
      if (t.status === 'done') return sum + 100;
      return sum + (t.progress || 0);
    }, 0);
    return Math.round(totalScore / projTasks.length);
  };

  // Derived: Today's Focus (active tasks with high/urgent priority or upcoming deadline)
  const todaysFocusTasks = useMemo(() => {
    const priorityWeight: Record<TaskPriority, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    return [...tasks]
      .filter((t) => t.status !== 'done')
      .sort((a, b) => {
        const pDiff = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
        if (pDiff !== 0) return pDiff;
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [tasks]);

  // Derived: Upcoming Deadlines (all incomplete tasks sorted by due date)
  const upcomingDeadlines = useMemo(() => {
    return [...tasks]
      .filter((t) => t.status !== 'done')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [tasks]);

  // Derived: Most recently accessed project for hero "Continue where you left off"
  const recentProject = useMemo(() => {
    if (projects.length === 0) return undefined;
    return [...projects].sort((a, b) => {
      const aTime = new Date(a.lastAccessedAt || 0).getTime();
      const bTime = new Date(b.lastAccessedAt || 0).getTime();
      return bTime - aTime;
    })[0];
  }, [projects]);

  // Unread notifications count
  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Navigation handlers
  const openProject = (projectId: string, subTab: ProjectTab = 'overview') => {
    setSelectedProjectId(projectId);
    setProjectSubTab(subTab);
    setActiveTab('projects');

    // Update lastAccessedAt for this project
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, lastAccessedAt: new Date().toISOString() } : p
      )
    );
  };

  // Modal open/close
  const openCreateTaskModal = (defaultProjectId?: string) => {
    setEditingTask(null);
    setTaskModalDefaultProjectId(defaultProjectId || selectedProjectId || (projects[0]?.id ?? null));
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setTaskModalDefaultProjectId(task.projectId);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setTaskModalDefaultProjectId(null);
  };

  const openCreateProjectModal = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (project: Project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const openInviteModal = () => setIsInviteModalOpen(true);
  const closeInviteModal = () => setIsInviteModalOpen(false);

  // Helper to add activity log
  const logActivity = (
    action: string, 
    targetTitle: string, 
    projectId?: string, 
    projectName?: string
  ) => {
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      projectId,
      projectName: projectName || (projectId ? getProject(projectId)?.name : undefined),
      userId: currentUser.id,
      userName: currentUser.name,
      userColor: currentUser.avatarColor,
      action,
      targetTitle,
      timestamp: 'Just now',
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 49)]);
  };

  // Helper to push notification
  const pushNotification = (
    title: string, 
    description: string, 
    type: NotificationItem['type'], 
    projectId?: string, 
    taskId?: string
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      description,
      timestamp: 'Just now',
      read: false,
      type,
      projectId,
      taskId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // CRUD Actions
  const createTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newId = `task-${Date.now()}`;
    const newTask: Task = {
      ...taskData,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);

    const proj = getProject(newTask.projectId);
    logActivity('created task', newTask.title, newTask.projectId, proj?.name);

    if (newTask.assigneeId && newTask.assigneeId !== currentUser.id) {
      const assignee = getUser(newTask.assigneeId);
      pushNotification(
        'New Task Assigned',
        `${currentUser.name} assigned '${newTask.title}' to ${assignee?.name || 'you'}.`,
        'assignment',
        newTask.projectId,
        newTask.id
      );
    }
  };

  const updateTask = (task: Task) => {
    const oldTask = tasks.find((t) => t.id === task.id);
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));

    const proj = getProject(task.projectId);
    if (oldTask && oldTask.status !== task.status) {
      const statusLabel = task.status === 'done' ? 'Done' : task.status === 'review' ? 'Review' : task.status === 'in_progress' ? 'In Progress' : 'To Do';
      logActivity(`moved to ${statusLabel}`, task.title, task.projectId, proj?.name);
    } else {
      logActivity('updated details of', task.title, task.projectId, proj?.name);
    }
  };

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    const newProgress = newStatus === 'done' ? 100 : task.status === 'done' ? 75 : task.progress;
    const updatedTask: Task = {
      ...task,
      status: newStatus,
      progress: newProgress,
    };

    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

    const proj = getProject(task.projectId);
    const statusLabels: Record<TaskStatus, string> = {
      todo: 'To Do',
      in_progress: 'In Progress',
      review: 'Review',
      done: 'Done',
    };
    const label = statusLabels[newStatus];

    logActivity(`moved to ${label}`, task.title, task.projectId, proj?.name);

    if (newStatus === 'done') {
      pushNotification(
        'Task Completed 🎉',
        `'${task.title}' was marked as Done in ${proj?.name || 'project'}.`,
        'status',
        task.projectId,
        task.id
      );
    }
  };

  const deleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    const proj = getProject(task.projectId);
    logActivity('deleted task', task.title, task.projectId, proj?.name);
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedChecklist = task.checklist.map((item) =>
      item.id === subtaskId ? { ...item, completed: !item.completed } : item
    );

    const completedCount = updatedChecklist.filter((c) => c.completed).length;
    const totalCount = updatedChecklist.length;
    const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : task.progress;

    const updatedTask: Task = {
      ...task,
      checklist: updatedChecklist,
      progress: newProgress,
      status: newProgress === 100 ? 'done' : task.status === 'done' ? 'in_progress' : task.status,
    };

    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

    const proj = getProject(task.projectId);
    logActivity(`updated checklist on`, task.title, task.projectId, proj?.name);
  };

  const createProject = (projectData: Omit<Project, 'id' | 'lastAccessedAt'>) => {
    const newId = `proj-${Date.now()}`;
    const newProject: Project = {
      ...projectData,
      id: newId,
      lastAccessedAt: new Date().toISOString(),
    };
    setProjects((prev) => [newProject, ...prev]);
    logActivity('created project', newProject.name, newProject.id, newProject.name);
    pushNotification(
      'New Project Created',
      `'${newProject.name}' was launched in ${newProject.category}.`,
      'project',
      newProject.id
    );
    setSelectedProjectId(newId);
    setProjectSubTab('overview');
    setActiveTab('projects');
  };

  const updateProject = (project: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));
    logActivity('updated settings for project', project.name, project.id, project.name);
  };

  const deleteProject = (projectId: string) => {
    const proj = getProject(projectId);
    if (!proj) return;
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setTasks((prev) => prev.filter((t) => t.projectId !== projectId));
    setFiles((prev) => prev.filter((f) => f.projectId !== projectId));
    logActivity('archived project', proj.name);
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
      setActiveTab('home');
    }
  };

  const inviteMember = (memberData: Omit<User, 'id' | 'initials'>) => {
    const names = memberData.name.trim().split(' ');
    const initials = names.length > 1 
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : names[0].slice(0, 2).toUpperCase();

    const newUser: User = {
      ...memberData,
      id: `user-${Date.now()}`,
      initials,
    };

    setUsers((prev) => [...prev, newUser]);
    logActivity('invited new team member', newUser.name);
    pushNotification(
      'Team Member Joined',
      `${newUser.name} (${newUser.role}) was added to TaskForge.`,
      'project'
    );
  };

  const uploadFile = (fileData: Omit<ProjectFile, 'id' | 'uploadedAt'>) => {
    const newFile: ProjectFile = {
      ...fileData,
      id: `file-${Date.now()}`,
      uploadedAt: 'Today',
    };
    setFiles((prev) => [newFile, ...prev]);
    const proj = getProject(newFile.projectId);
    logActivity('uploaded asset', newFile.name, newFile.projectId, proj?.name);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const resetAllData = () => {
    Object.values(STORAGE_KEYS).forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch (error) {
        console.error(`Unable to remove stored value for "${k}".`, error);
      }
    });
    setUsers(SEED_USERS);
    setCurrentUserId('user-sarah');
    setProjects(SEED_PROJECTS);
    setTasks(SEED_TASKS);
    setActivities(SEED_ACTIVITIES);
    setNotifications(SEED_NOTIFICATIONS);
    setFiles(SEED_FILES);
    setSelectedProjectId(null);
    setActiveTab('home');
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        tasks,
        users,
        currentUser,
        activities,
        notifications,
        files,
        activeTab,
        selectedProjectId,
        projectSubTab,
        searchQuery,
        isTaskModalOpen,
        editingTask,
        taskModalDefaultProjectId,
        isProjectModalOpen,
        editingProject,
        isInviteModalOpen,
        setActiveTab,
        openProject,
        setProjectSubTab,
        setSearchQuery,
        setCurrentUser,
        openCreateTaskModal,
        openEditTaskModal,
        closeTaskModal,
        openCreateProjectModal,
        openEditProjectModal,
        closeProjectModal,
        openInviteModal,
        closeInviteModal,
        createTask,
        updateTask,
        moveTask,
        deleteTask,
        toggleSubtask,
        createProject,
        updateProject,
        deleteProject,
        inviteMember,
        uploadFile,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        unreadNotificationsCount,
        getProjectProgress,
        getProject,
        getUser,
        getProjectTasks,
        getProjectMembers,
        todaysFocusTasks,
        upcomingDeadlines,
        recentProject,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

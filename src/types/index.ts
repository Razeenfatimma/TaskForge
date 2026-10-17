export type ProjectColor = 'purple' | 'blue' | 'green' | 'coral' | 'pink';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarColor: string;
  initials: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string; // ISO date string (YYYY-MM-DD)
  progress: number; // 0 to 100
  tags: string[];
  checklist: ChecklistItem[];
  commentsCount: number;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  tagLine: string;
  description: string;
  color: ProjectColor;
  iconEmoji: string;
  dueDate: string;
  status: 'Active' | 'Review' | 'Planning' | 'Completed';
  members: string[]; // User IDs
  category: string;
  lastAccessedAt: string;
}

export interface ActivityItem {
  id: string;
  projectId?: string;
  projectName?: string;
  userId: string;
  userName: string;
  userColor: string;
  action: string;
  targetTitle: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'assignment' | 'deadline' | 'project' | 'status';
  projectId?: string;
  taskId?: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  size: string;
  fileType: 'figma' | 'pdf' | 'doc' | 'image' | 'code';
  uploadedBy: string;
  uploadedAt: string;
  url?: string;
}

export type ViewTab = 'home' | 'projects' | 'tasks' | 'calendar' | 'team' | 'notifications' | 'settings';
export type ProjectTab = 'overview' | 'board' | 'timeline' | 'team' | 'files';

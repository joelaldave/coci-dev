export interface BaseTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  assignee: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  completedAt?: Date;
}

export interface TaskUI {
  assigneeInitials: string;
  assigneeColor: string;
}

export type Task = BaseTask & TaskUI;

export interface TaskCreateRequest {
  title: string;
  description: string;
  priority: TaskPriority;
  category: string;
  assignee: string;
  dueDate: Date;
  status: TaskStatus;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  IN_REVIEW = 'in-review',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface TaskColumn {
  id: TaskStatus;
  title: string;
  color: string;
  badgeColor: string;
  hoverColor: string;
  tasks: Task[];
}

export interface TaskCreateRequest {
  title: string;
  description: string;
  priority: TaskPriority;
  category: string;
  assignee: string;
  assigneeInitials: string;
  assigneeColor: string;
  dueDate: Date;
  status: TaskStatus;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  inReview: number;
  completed: number;
  overdue: number;
}

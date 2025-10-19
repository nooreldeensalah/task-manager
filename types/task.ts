import type { Timestamp } from 'firebase/firestore';

export type TaskId = string;

export interface Task {
  id: TaskId;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
  dueDate?: Date | null;
  notificationId?: string | null;
}

export interface TaskDraft {
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  notificationId?: string | null;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  completed?: boolean;
  completedAt?: Date | null;
  dueDate?: Date | null;
  notificationId?: string | null;
}

export interface TaskDocument {
  title: string;
  description?: string | null;
  completed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp | null;
  dueDate?: Timestamp | null;
  notificationId?: string | null;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  /** Has the task list been loaded (successfully or with error) at least once this session? */
  initialized: boolean;
}

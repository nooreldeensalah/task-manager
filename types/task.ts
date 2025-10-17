import type { Timestamp } from 'firebase/firestore';

export type TaskId = string;

export interface Task {
  id: TaskId;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date | null;
  notificationId?: string | null;
}

export interface TaskDraft {
  description: string;
  dueDate?: Date | null;
  notificationId?: string | null;
}

export interface TaskUpdate {
  description?: string;
  completed?: boolean;
  dueDate?: Date | null;
  notificationId?: string | null;
}

export interface TaskDocument {
  description: string;
  completed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  dueDate?: Timestamp | null;
  notificationId?: string | null;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

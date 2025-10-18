import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type FirestoreError,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';

import { FIRESTORE_COLLECTIONS } from '@/constants/Config';
import { getFirestoreInstance } from '@/services/firestore';
import type { Task, TaskDraft, TaskId, TaskUpdate } from '@/types/task';
import { normalizeDescription, normalizeTitle } from '@/utils/validation';

const tasksCollection = (userId: string) =>
  collection(
    getFirestoreInstance(),
    FIRESTORE_COLLECTIONS.USERS,
    userId,
    FIRESTORE_COLLECTIONS.TASKS,
  );

const taskDocument = (userId: string, taskId: TaskId) =>
  doc(
    getFirestoreInstance(),
    FIRESTORE_COLLECTIONS.USERS,
    userId,
    FIRESTORE_COLLECTIONS.TASKS,
    taskId,
  );

const timestampToDate = (value: Timestamp | Date | null | undefined, fallback: Date): Date => {
  if (!value) {
    return fallback;
  }

  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  return fallback;
};

const nullableTimestampToDate = (value: Timestamp | Date | null | undefined): Date | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  return null;
};

const mapSnapshotToTask = (snapshot: QueryDocumentSnapshot<DocumentData>): Task => {
  const data = snapshot.data();
  const fallbackDate = new Date();
  const normalizedTitle = normalizeTitle(data.title ?? '') || normalizeTitle(data.description ?? '') || 'Untitled task';
  const normalizedDescription = normalizeDescription(data.description ?? '');

  return {
    id: snapshot.id,
    title: normalizedTitle,
    description: normalizedDescription,
    completed: Boolean(data.completed),
    createdAt: timestampToDate(data.createdAt, fallbackDate),
    updatedAt: timestampToDate(data.updatedAt, fallbackDate),
    completedAt: nullableTimestampToDate(data.completedAt),
    dueDate: nullableTimestampToDate(data.dueDate),
    notificationId: data.notificationId ?? null,
  };
};

export const createTask = async (userId: string, draft: TaskDraft): Promise<Task> => {
  const trimmedTitle = normalizeTitle(draft.title) || 'Untitled task';
  const trimmedDescription = normalizeDescription(draft.description ?? '');
  const descriptionValue = trimmedDescription.length > 0 ? trimmedDescription : null;
  const now = new Date();

  const docRef = await addDoc(tasksCollection(userId), {
    title: trimmedTitle,
    description: descriptionValue,
    completed: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    completedAt: null,
    dueDate: draft.dueDate ? Timestamp.fromDate(draft.dueDate) : null,
    notificationId: draft.notificationId ?? null,
  });

  return {
    id: docRef.id,
    title: trimmedTitle,
    description: trimmedDescription,
    completed: false,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    dueDate: draft.dueDate ?? null,
    notificationId: draft.notificationId ?? null,
  };
};

export const updateTask = async (userId: string, taskId: TaskId, updates: TaskUpdate): Promise<void> => {
  const docRef = taskDocument(userId, taskId);

  const payload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (updates.description !== undefined) {
    const normalizedDescription = normalizeDescription(updates.description ?? '');
    payload.description = normalizedDescription.length > 0 ? normalizedDescription : null;
  }

  if (updates.title !== undefined) {
    const normalizedTitle = normalizeTitle(updates.title);
    payload.title = normalizedTitle || 'Untitled task';
  }

  if (updates.completed !== undefined) {
    payload.completed = updates.completed;
    payload.completedAt = updates.completed ? serverTimestamp() : null;
  }

  if (updates.dueDate !== undefined) {
    payload.dueDate = updates.dueDate ? Timestamp.fromDate(updates.dueDate) : null;
  }

  if (updates.notificationId !== undefined) {
    payload.notificationId = updates.notificationId ?? null;
  }

  await updateDoc(docRef, payload);
};

export const deleteTask = async (userId: string, taskId: TaskId): Promise<void> => {
  const docRef = taskDocument(userId, taskId);
  await deleteDoc(docRef);
};

export const fetchTasks = async (userId: string): Promise<Task[]> => {
  const tasksQuery = query(tasksCollection(userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(tasksQuery);
  return snapshot.docs.map(mapSnapshotToTask);
};

export const subscribeToTasks = (
  userId: string,
  listener: (tasks: Task[]) => void,
  onError?: (error: FirestoreError) => void,
): Unsubscribe => {
  const tasksQuery = query(tasksCollection(userId), orderBy('createdAt', 'desc'));

  return onSnapshot(
    tasksQuery,
    (snapshot) => {
      const tasks = snapshot.docs.map(mapSnapshotToTask);
      listener(tasks);
    },
    onError,
  );
};

import { useCallback, useContext } from 'react';

import { TaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/hooks/useAuth';
import {
    createTask as createTaskService,
    deleteTask as deleteTaskService,
    fetchTasks as fetchTasksService,
    updateTask as updateTaskService,
} from '@/services/taskService';
import type { Task, TaskDraft, TaskId, TaskUpdate } from '@/types/task';
import { toErrorMessage } from '@/utils/errors';
import { normalizeDescription, normalizeTitle } from '@/utils/validation';

export const useTasks = () => {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider.');
  }

  const { state, dispatch } = context;
  const { user } = useAuth();

  if (!user) {
    throw new Error('useTasks requires an authenticated user.');
  }

  const userId = user.uid;

  const setLoading = useCallback(
    (value: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: value });
    },
    [dispatch],
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    },
    [dispatch],
  );

  const setInitialized = useCallback(
    (value: boolean) => {
      dispatch({ type: 'SET_INITIALIZED', payload: value });
    },
    [dispatch],
  );

  const createTask = useCallback(
    async (draft: TaskDraft): Promise<Task> => {
      try {
        const newTask = await createTaskService(userId, draft);
        dispatch({ type: 'ADD_TASK', payload: newTask });
        return newTask;
      } catch (error) {
        const message = toErrorMessage(error);
        setError(message);
        throw error;
      }
    },
    [dispatch, setError, userId],
  );

  const updateTask = useCallback(
    async (taskId: TaskId, updates: TaskUpdate): Promise<void> => {
      try {
        await updateTaskService(userId, taskId, updates);

        const existing = state.tasks.find((task) => task.id === taskId);
        if (!existing) {
          return;
        }

        const normalizedTitle =
          updates.title !== undefined
            ? normalizeTitle(updates.title)
            : undefined;

        const normalizedDescription =
          updates.description !== undefined
            ? normalizeDescription(updates.description ?? '')
            : undefined;

        const updatedTask: Task = {
          ...existing,
          title:
            normalizedTitle !== undefined && normalizedTitle.length === 0
              ? 'Untitled task'
              : normalizedTitle ?? existing.title,
          description:
            normalizedDescription !== undefined
              ? normalizedDescription
              : existing.description,
          completed:
            updates.completed !== undefined ? updates.completed : existing.completed,
          completedAt:
            updates.completed !== undefined
              ? updates.completed
                ? new Date()
                : null
              : existing.completedAt ?? null,
          dueDate:
            updates.dueDate !== undefined ? updates.dueDate ?? null : existing.dueDate ?? null,
          notificationId:
            updates.notificationId !== undefined
              ? updates.notificationId ?? null
              : existing.notificationId ?? null,
          updatedAt: new Date(),
        };

        dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      } catch (error) {
        const message = toErrorMessage(error);
        setError(message);
        throw error;
      }
    },
    [dispatch, setError, state.tasks, userId],
  );

  const deleteTask = useCallback(
    async (taskId: TaskId): Promise<void> => {
      try {
        await deleteTaskService(userId, taskId);
        dispatch({ type: 'DELETE_TASK', payload: taskId });
      } catch (error) {
        const message = toErrorMessage(error);
        setError(message);
        throw error;
      }
    },
    [dispatch, setError, userId],
  );

  const fetchTasks = useCallback(async (): Promise<Task[]> => {
    setLoading(true);

    try {
      const tasks = await fetchTasksService(userId);
      dispatch({ type: 'SET_TASKS', payload: tasks });
      setInitialized(true);
      return tasks;
    } catch (error) {
      const message = toErrorMessage(error);
      setError(message);
      setInitialized(true);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [dispatch, setError, setInitialized, setLoading, userId]);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    initialized: state.initialized,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
    clearError,
  };
};

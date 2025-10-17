import type { FirestoreError, Unsubscribe } from 'firebase/firestore';
import { useCallback, useContext } from 'react';

import { TaskContext } from '@/contexts/TaskContext';
import {
    createTask as createTaskService,
    deleteTask as deleteTaskService,
    fetchTasks as fetchTasksService,
    subscribeToTasks as subscribeToTasksService,
    updateTask as updateTaskService,
} from '@/services/taskService';
import type { Task, TaskDraft, TaskId, TaskUpdate } from '@/types/task';

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Something went wrong. Please try again.';
};

export const useTasks = () => {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider.');
  }

  const { state, dispatch } = context;

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

  const createTask = useCallback(
    async (draft: TaskDraft): Promise<Task> => {
      setLoading(true);

      try {
        const newTask = await createTaskService(draft);
        dispatch({ type: 'ADD_TASK', payload: newTask });
        return newTask;
      } catch (error) {
        const message = toErrorMessage(error);
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, setError, setLoading],
  );

  const updateTask = useCallback(
    async (taskId: TaskId, updates: TaskUpdate): Promise<void> => {
      setLoading(true);

      try {
        await updateTaskService(taskId, updates);

        const existing = state.tasks.find((task) => task.id === taskId);
        if (!existing) {
          return;
        }

        const updatedTask: Task = {
          ...existing,
          description:
            updates.description !== undefined
              ? updates.description.trim()
              : existing.description,
          completed:
            updates.completed !== undefined ? updates.completed : existing.completed,
          dueDate: updates.dueDate !== undefined ? updates.dueDate ?? null : existing.dueDate ?? null,
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
      } finally {
        setLoading(false);
      }
    },
    [dispatch, setError, setLoading, state.tasks],
  );

  const deleteTask = useCallback(
    async (taskId: TaskId): Promise<void> => {
      setLoading(true);

      try {
        await deleteTaskService(taskId);
        dispatch({ type: 'DELETE_TASK', payload: taskId });
      } catch (error) {
        const message = toErrorMessage(error);
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, setError, setLoading],
  );

  const fetchTasks = useCallback(async (): Promise<Task[]> => {
    setLoading(true);

    try {
      const tasks = await fetchTasksService();
      dispatch({ type: 'SET_TASKS', payload: tasks });
      return tasks;
    } catch (error) {
      const message = toErrorMessage(error);
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [dispatch, setError, setLoading]);

  const subscribeToTasks = useCallback(
    (onError?: (error: FirestoreError) => void): Unsubscribe => {
      setLoading(true);

      return subscribeToTasksService(
        (tasks) => {
          dispatch({ type: 'SET_TASKS', payload: tasks });
          setLoading(false);
          setError(null);
        },
        (error) => {
          const message = toErrorMessage(error);
          setError(message);
          setLoading(false);
          onError?.(error);
        },
      );
    },
    [dispatch, setError, setLoading],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
    subscribeToTasks,
    clearError,
  };
};

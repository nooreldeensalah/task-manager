import { createContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { initialTaskState, taskReducer } from '@/reducers/taskReducer';
import { subscribeToTasks as subscribeToTasksService } from '@/services/taskService';
import type { TaskAction } from '@/types/actions';
import type { TaskState } from '@/types/task';
import { toErrorMessage } from '@/utils/errors';

interface TaskContextValue {
  state: TaskState;
  dispatch: Dispatch<TaskAction>;
}

export const TaskContext = createContext<TaskContextValue | null>(null);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      dispatch({ type: 'RESET' });
      return;
    }

    let isActive = true;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    const unsubscribe = subscribeToTasksService(
      user.uid,
      (tasks) => {
        if (!isActive) {
          return;
        }

        dispatch({ type: 'SET_TASKS', payload: tasks });
      },
      (error) => {
        if (!isActive) {
          return;
        }

        const message = toErrorMessage(error);
        dispatch({ type: 'SET_ERROR', payload: message });
        dispatch({ type: 'SET_LOADING', payload: false });
      },
    );

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [user?.uid]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

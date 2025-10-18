import { createContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { initialTaskState, taskReducer } from '@/reducers/taskReducer';
import type { TaskAction } from '@/types/actions';
import type { TaskState } from '@/types/task';

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
    dispatch({ type: 'RESET' });
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

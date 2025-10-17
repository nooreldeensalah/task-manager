import { createContext, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';

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

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

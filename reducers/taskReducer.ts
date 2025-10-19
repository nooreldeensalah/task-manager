import type { TaskAction } from '@/types/actions';
import type { Task, TaskState } from '@/types/task';

export const initialTaskState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  initialized: false,
};

const upsertTask = (tasks: Task[], next: Task): Task[] => {
  const index = tasks.findIndex((task) => task.id === next.id);
  if (index === -1) {
    return [next, ...tasks];
  }

  const updated = [...tasks];
  updated[index] = next;
  return updated;
};

const removeTask = (tasks: Task[], taskId: string): Task[] =>
  tasks.filter((task) => task.id !== taskId);

export const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload,
        loading: false,
        error: null,
        initialized: true,
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: upsertTask(state.tasks, action.payload),
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: upsertTask(state.tasks, action.payload),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: removeTask(state.tasks, action.payload),
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        // Even on error, we've attempted a load; mark initialized so UI can show error/empty states appropriately
        initialized: true,
      };
    case 'SET_INITIALIZED':
      return {
        ...state,
        initialized: action.payload,
      };
    case 'RESET':
      return {
        tasks: [],
        loading: false,
        error: null,
        initialized: false,
      };
    default: {
      const exhaustiveCheck: never = action;
      return state;
    }
  }
};

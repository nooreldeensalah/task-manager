import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import LoadingIndicator from '@/components/common/LoadingIndicator';
import Colors from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import type { Task, TaskId } from '@/types/task';

import TaskItem from './TaskItem';

export interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: TaskId, completed: boolean) => void;
  onDeleteTask: (taskId: TaskId) => void;
  onTaskPress?: (taskId: TaskId) => void;
  refreshing?: boolean;
  onRefresh?: () => Promise<void> | void;
  ListEmptyComponent?: ReactNode;
  loading?: boolean;
}

export const TaskList = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onTaskPress,
  refreshing = false,
  onRefresh,
  ListEmptyComponent,
  loading = false,
}: TaskListProps) => {
  const { theme } = useTheme();
  const palette = Colors[theme];

  const shouldShowEmptyState = tasks.length === 0 && !loading && Boolean(ListEmptyComponent);

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: palette.surface }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.primary} />
        ) : undefined
      }
      accessibilityLabel="Task list">
      <View style={styles.list}>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
            onPress={onTaskPress}
          />
        ))}
      </View>

      {loading ? <LoadingIndicator /> : null}
      {shouldShowEmptyState ? ListEmptyComponent : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },
  list: {
    flexGrow: 1,
  },
});

export default TaskList;

import type { ReactNode } from 'react';
import { Platform, RefreshControl, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import LoadingIndicator from '@/components/common/LoadingIndicator';
import Colors from '@/constants/Colors';
import { BREAKPOINTS, SPACING } from '@/constants/Layout';
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
  /** Extra bottom padding to keep last items above overlays (e.g., a floating FAB) */
  bottomPadding?: number;
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
  bottomPadding = 0,
}: TaskListProps) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const { width } = useWindowDimensions();
  const isWideDesktop = Platform.OS === 'web' && width >= BREAKPOINTS.desktop;

  const shouldShowEmptyState = tasks.length === 0 && !loading && Boolean(ListEmptyComponent);

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: 'transparent' }]}
      contentContainerStyle={[styles.contentContainer, bottomPadding ? { paddingBottom: bottomPadding } : null]}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.primary} />
        ) : undefined
      }
      accessibilityLabel="Task list">
      <View style={[styles.list, isWideDesktop ? styles.listDesktop : null]}>
        {tasks.map((task, index) => (
          <View
            key={task.id}
            style={
              isWideDesktop
                ? styles.desktopItemWrapper
                : styles.itemWrapper
            }
          >
            <TaskItem
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              onPress={onTaskPress}
              appearanceDelay={index * 40}
            />
          </View>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <LoadingIndicator />
        </View>
      ) : null}
      {shouldShowEmptyState ? (
        <View style={[styles.emptyState, isWideDesktop ? styles.emptyStateDesktop : null]}>
          {ListEmptyComponent}
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  list: {
    flexGrow: 1,
  },
  listDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  itemWrapper: {
    width: '100%',
  },
  desktopItemWrapper: {
    // Use flex-basis instead of fixed width for better responsiveness
    flexBasis: '50%',
    flexShrink: 0,
    flexGrow: 0,
    // Subtract half the gap from the max width
    maxWidth: 'calc(50% - 8px)' as any,
  },
  loadingContainer: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  emptyState: {
    marginTop: SPACING.xl,
  },
  emptyStateDesktop: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 480,
  },
});

export default TaskList;

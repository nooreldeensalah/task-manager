import { useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import LoadingIndicator from '@/components/common/LoadingIndicator';
import { BREAKPOINTS, SPACING } from '@/constants/Layout';
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
  const { width } = useWindowDimensions();
  const isWideDesktop = Platform.OS === 'web' && width >= BREAKPOINTS.desktop;
  const numColumns = isWideDesktop ? 2 : 1;

  const shouldShowEmptyState = tasks.length === 0 && !loading && Boolean(ListEmptyComponent);

  const renderTask = useCallback(({ item, index }: ListRenderItemInfo<Task>) => (
    <View style={[styles.itemWrapper, isWideDesktop ? styles.desktopItemWrapper : styles.itemWrapperSingle]}>
      <TaskItem
        task={item}
        onToggle={onToggleTask}
        onDelete={onDeleteTask}
        onPress={onTaskPress}
        appearanceDelay={index * 40}
      />
    </View>
  ), [isWideDesktop, onDeleteTask, onTaskPress, onToggleTask]);

  const keyExtractor = useCallback((task: Task) => task.id, []);

  const emptyComponent = shouldShowEmptyState
    ? () => (
        <View style={[styles.emptyState, isWideDesktop ? styles.emptyStateDesktop : null]}>
          {ListEmptyComponent}
        </View>
      )
    : undefined;

  const footerComponent = loading
    ? () => (
        <View style={styles.loadingContainer}>
          <LoadingIndicator />
        </View>
      )
    : undefined;

  const refreshingState = onRefresh ? refreshing : false;

  return (
    <FlatList
      accessibilityLabel="Task list"
      data={tasks}
      keyExtractor={keyExtractor}
      renderItem={renderTask}
      numColumns={numColumns}
      style={[styles.list]}
      contentContainerStyle={[
        styles.contentContainer,
        bottomPadding ? { paddingBottom: bottomPadding } : null,
        tasks.length === 0 ? styles.contentContainerEmpty : null,
      ]}
      columnWrapperStyle={isWideDesktop ? styles.desktopColumnWrapper : undefined}
      ListEmptyComponent={emptyComponent}
      ListFooterComponent={footerComponent}
      refreshing={refreshingState}
      onRefresh={onRefresh}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: SPACING.xs,
  },
  contentContainerEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  itemWrapper: {
    flex: 1,
    minWidth: 0,
  },
  itemWrapperSingle: {
    width: '100%',
  },
  desktopItemWrapper: {
    paddingHorizontal: SPACING.xs,
  },
  desktopColumnWrapper: {
    paddingHorizontal: SPACING.xs,
  },
  loadingContainer: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateDesktop: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 480,
  },
});

export default TaskList;

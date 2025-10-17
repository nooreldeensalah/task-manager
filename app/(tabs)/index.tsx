import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import TaskInput from '@/components/task/TaskInput';
import TaskList from '@/components/task/TaskList';
import Colors from '@/constants/Colors';
import { useTasks } from '@/hooks/useTasks';
import { useTheme } from '@/hooks/useTheme';
import type { TaskId } from '@/types/task';

export default function TaskListScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const palette = Colors[theme];
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
    subscribeToTasks,
    clearError,
  } = useTasks();

  const [refreshing, setRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToTasks();

    fetchTasks().catch(() => {
      // Errors are surfaced via context state.
    });

    return unsubscribe;
  }, [fetchTasks, subscribeToTasks]);

  const handleCreateTask = useCallback(
    async ({ title, description }: { title: string; description: string }) => {
      setCreating(true);

      try {
        await createTask({ title, description });
      } finally {
        setCreating(false);
      }
    },
    [createTask],
  );

  const handleToggleTask = useCallback(
    async (taskId: TaskId, completed: boolean) => {
      await updateTask(taskId, { completed });
    },
    [updateTask],
  );

  const handleDeleteTask = useCallback(
    async (taskId: TaskId) => {
      await deleteTask(taskId);
    },
    [deleteTask],
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await fetchTasks();
    } finally {
      setRefreshing(false);
    }
  }, [fetchTasks]);

  const handleRetrySync = useCallback(async () => {
    clearError();
    await handleRefresh();
  }, [clearError, handleRefresh]);

  const handleTaskPress = useCallback((taskId: TaskId) => {
    router.push(`/task/${taskId}`);
  }, [router]);

  const emptyState = useMemo(
    () => (
      <EmptyState
        title="Get started by adding your first task!"
        description="Capture what's on your mind and stay organized."
      />
    ),
    [],
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <View style={[styles.container, { backgroundColor: palette.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: palette.text }]}>My Tasks</Text>
          <Text style={[styles.subtitle, { color: palette.textMuted }]}>Stay on top of your day</Text>
        </View>

        {error ? (
          <View
            style={[
              styles.errorBanner,
              { backgroundColor: palette.surfaceElevated, borderColor: palette.danger },
            ]}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            <Text style={[styles.errorTitle, { color: palette.danger }]}>We ran into a sync issue</Text>
            <Text style={[styles.errorMessage, { color: palette.text }]}>There was a problem syncing your tasks. Check your connection and try again.</Text>
            <Text style={[styles.errorDetails, { color: palette.textMuted }]}>Details: {error}</Text>
            <Button label="Retry sync" onPress={handleRetrySync} variant="primary" fullWidth />
          </View>
        ) : null}

        <View
          style={[
            styles.inputCard,
            { backgroundColor: palette.surfaceElevated, borderColor: palette.border },
          ]}
        >
          <TaskInput onSubmit={handleCreateTask} loading={creating} />
        </View>

        <View style={styles.listContainer}>
          <TaskList
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onTaskPress={handleTaskPress}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListEmptyComponent={emptyState}
            loading={loading && !refreshing}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    paddingVertical: 16,
    gap: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  errorBanner: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  errorMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  errorDetails: {
    fontSize: 12,
    lineHeight: 18,
  },
  inputCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  listContainer: {
    flex: 1,
  },
});

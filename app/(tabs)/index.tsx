import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '@/components/common/EmptyState';
import TaskInput from '@/components/task/TaskInput';
import TaskList from '@/components/task/TaskList';
import Colors from '@/constants/Colors';
import { useTasks } from '@/hooks/useTasks';
import { useTheme } from '@/hooks/useTheme';
import type { TaskId } from '@/types/task';

export default function TaskListScreen() {
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
    return unsubscribe;
  }, [subscribeToTasks]);

  useEffect(() => {
    if (!error) {
      return;
    }

    Alert.alert('Something went wrong', error, [{ text: 'Dismiss', onPress: clearError }], {
      onDismiss: clearError,
    });
  }, [error, clearError]);

  const handleCreateTask = useCallback(
    async (description: string) => {
      setCreating(true);

      try {
        await createTask({ description });
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
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: palette.background }]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: palette.text }]}>My Tasks</Text>
          <Text style={[styles.subtitle, { color: palette.textMuted }]}>Stay on top of your day</Text>
        </View>
        <TaskInput onSubmit={handleCreateTask} loading={creating} />
        <TaskList
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={emptyState}
          loading={loading && !refreshing}
        />
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
  },
  header: {
    paddingTop: 12,
    paddingBottom: 8,
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
  },
});

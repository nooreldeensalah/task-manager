import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthGate from '@/components/auth/AuthGate';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import FloatingActionButton from '@/components/common/FloatingActionButton';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import ResponsiveContainer from '@/components/common/ResponsiveContainer';
import TaskFilterBar, { type TaskStatusFilter } from '@/components/task/TaskFilterBar';
import TaskInput from '@/components/task/TaskInput';
import TaskList from '@/components/task/TaskList';
import Colors from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { useTheme } from '@/hooks/useTheme';
import type { TaskId } from '@/types/task';

function TaskListContent() {
  const router = useRouter();
  const { user } = useAuth();
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
    clearError,
    initialized,
  } = useTasks();

  const [refreshing, setRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [composerVisible, setComposerVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const handleCreateTask = useCallback(
    async ({ title, description, dueDate }: { title: string; description?: string | null; dueDate: Date | null }) => {
      setCreating(true);

      try {
        const sanitizedDescription =
          typeof description === 'string' && description.trim().length > 0
            ? description.trim()
            : undefined;

        await createTask({
          title,
          ...(sanitizedDescription !== undefined ? { description: sanitizedDescription } : {}),
          ...(dueDate ? { dueDate } : {}),
        });
        setComposerVisible(false);
      } finally {
        setCreating(false);
      }
    },
    [createTask],
  );

  const handleOpenComposer = useCallback(() => {
    setComposerVisible(true);
  }, []);

  const handleCloseComposer = useCallback(() => {
    setComposerVisible(false);
  }, []);

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

  const statusCounts = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        acc.all += 1;

        if (task.completed) {
          acc.completed += 1;
        } else {
          acc.active += 1;
        }

        return acc;
      },
      { all: 0, active: 0, completed: 0 } as Record<TaskStatusFilter, number>,
    );
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      if (statusFilter === 'completed' && !task.completed) {
        return false;
      }

      if (statusFilter === 'active' && task.completed) {
        return false;
      }

      if (query.length === 0) {
        return true;
      }

      const titleMatch = task.title.toLowerCase().includes(query);
      const descriptionMatch = (task.description ?? '').toLowerCase().includes(query);

      return titleMatch || descriptionMatch;
    });
  }, [tasks, searchQuery, statusFilter]);

  const filteredEmptyState = useMemo(() => {
    const hasInitialState = tasks.length === 0 && searchQuery.trim().length === 0 && statusFilter === 'all';

    if (hasInitialState) {
      return emptyState;
    }

    return (
      <EmptyState
        title="No tasks match your filters"
        description="Try adjusting your filters or updating your search."
      />
    );
  }, [emptyState, searchQuery, statusFilter, tasks.length]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]} edges={['bottom']}>
      {!initialized ? (
        <LoadingIndicator fullScreen />
      ) : (
      <ResponsiveContainer outerStyle={styles.mainOuter} style={styles.mainContent}>
        <TaskFilterBar
          filter={statusFilter}
          counts={statusCounts}
          onFilterChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onClearSearch={() => setSearchQuery('')}
        />

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

        <View style={styles.listContainer}>
          <TaskList
            tasks={filteredTasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onTaskPress={handleTaskPress}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListEmptyComponent={filteredEmptyState}
            loading={initialized && loading && !refreshing}
          />
          <View style={styles.fabContainerAbsolute} pointerEvents="box-none">
            <FloatingActionButton
              onPress={handleOpenComposer}
              accessibilityLabel="Create a new task"
              icon={<MaterialCommunityIcons name="plus" size={24} color={palette.background} />}
            />
          </View>
        </View>
      </ResponsiveContainer>
      )}

      <Modal
        visible={composerVisible}
        animationType="slide"
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
        onRequestClose={handleCloseComposer}
      >
        <SafeAreaView style={[styles.modalSafeArea, { backgroundColor: palette.background }]}>
          <KeyboardAvoidingView
            style={styles.modalKeyboard}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: palette.text }]}>New Task</Text>
              <Pressable
                onPress={handleCloseComposer}
                accessibilityLabel="Close task creator"
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.modalCloseButton,
                  {
                    backgroundColor: pressed ? palette.surface : 'transparent',
                  },
                ]}
              >
                <MaterialCommunityIcons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              keyboardShouldPersistTaps="handled"
              alwaysBounceVertical={false}
            >
              <ResponsiveContainer outerStyle={styles.modalOuter} style={styles.modalContent}>
                <View
                  style={[styles.modalCard, { backgroundColor: palette.surfaceElevated, borderColor: palette.border }]}
                >
                  <TaskInput onSubmit={handleCreateTask} loading={creating} />
                </View>
              </ResponsiveContainer>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

export default function TaskListScreen() {
  const { user, initializing } = useAuth();
  const { theme } = useTheme();
  const palette = Colors[theme];

  if (initializing) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
        <LoadingIndicator fullScreen />
      </SafeAreaView>
    );
  }

  if (!user) {
    return <AuthGate />;
  }

  return <TaskListContent />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainOuter: {
    flex: 1,
    paddingTop: 16,
  },
  mainContent: {
    flex: 1,
    gap: 20,
  },
  errorBanner: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 12,
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
  listContainer: {
    flex: 1,
  },
  fabContainerAbsolute: {
    position: 'absolute',
    bottom: 24,
    right: 6,
    left: 0,
    alignItems: 'flex-end',
    zIndex: 10,
    pointerEvents: 'box-none',
  },
  modalSafeArea: {
    flex: 1,
  },
  modalKeyboard: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  modalCloseButton: {
    padding: 8,
    borderRadius: 12,
  },
  modalScrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  modalOuter: {
    paddingVertical: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 560,
  },
  modalCard: {
    borderRadius: 16,
    borderWidth: 1,
  },
});

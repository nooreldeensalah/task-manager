import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import LoadingIndicator from '@/components/common/LoadingIndicator';
import ResponsiveContainer from '@/components/common/ResponsiveContainer';
import TaskInput from '@/components/task/TaskInput';
import TaskList from '@/components/task/TaskList';
import Colors from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { useTheme } from '@/hooks/useTheme';
import type { TaskId } from '@/types/task';

function TaskListContent() {
  const router = useRouter();
  const { signOut: signOutUser, user } = useAuth();
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
  const [composerVisible, setComposerVisible] = useState(false);
  useEffect(() => {
    const unsubscribe = subscribeToTasks();

    fetchTasks().catch(() => {
      // Errors are surfaced via context state.
    });

    return unsubscribe;
  }, [fetchTasks, subscribeToTasks]);

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

  const handleSignOut = useCallback(async () => {
    try {
      await signOutUser();
    } catch (signOutError) {
      console.error('Failed to sign out:', signOutError);
    }
  }, [signOutUser]);

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
      <ResponsiveContainer outerStyle={styles.mainOuter} style={styles.mainContent}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: palette.text }]}>Tasks</Text>
            {user?.email ? (
              <Text style={[styles.subtitle, { color: palette.textMuted }]} numberOfLines={1}>
                {user.email}
              </Text>
            ) : null}
          </View>
          <View style={styles.headerActions}>
            <Pressable
              onPress={handleSignOut}
              accessibilityRole="button"
              accessibilityLabel="Sign out"
              hitSlop={8}
              style={({ pressed }) => [
                styles.headerAction,
                {
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
            >
              <MaterialCommunityIcons name="logout" size={24} color={palette.text} />
            </Pressable>
            <Pressable
              onPress={handleOpenComposer}
              accessibilityRole="button"
              accessibilityLabel="Create a new task"
              hitSlop={8}
              style={({ pressed }) => [
                styles.headerAction,
                {
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
            >
              <MaterialCommunityIcons name="plus" size={28} color={palette.primary} />
            </Pressable>
          </View>
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
      </ResponsiveContainer>

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
    paddingBottom: 24,
  },
  mainContent: {
    flex: 1,
    gap: 20,
  },
  header: {
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flexShrink: 1,
    gap: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerAction: {
    padding: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
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

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import TaskDetailCard from '@/components/task/TaskDetailCard';
import Colors from '@/constants/Colors';
import { useTasks } from '@/hooks/useTasks';
import { useTheme } from '@/hooks/useTheme';
import { validateTaskDescription, validateTaskTitle } from '@/utils/validation';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const palette = Colors[theme];
  const {
    tasks,
    loading,
    error,
    updateTask,
    fetchTasks,
    subscribeToTasks,
    clearError,
  } = useTasks();

  const [editing, setEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [descriptionDraft, setDescriptionDraft] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const task = useMemo(() => tasks.find((item) => item.id === id), [tasks, id]);

  useEffect(() => {
    const unsubscribe = subscribeToTasks();
    fetchTasks().catch(() => {
      // Errors are surfaced through context state and handled below.
    });

    return unsubscribe;
  }, [fetchTasks, subscribeToTasks]);

  useEffect(() => {
    if (task) {
      setTitleDraft(task.title);
      setDescriptionDraft(task.description);
    }
  }, [task?.description, task?.title, task]);

  useEffect(() => {
    if (!error) {
      return;
    }

    Alert.alert('Sync issue', error, [{ text: 'Dismiss', onPress: clearError }], {
      onDismiss: clearError,
    });
  }, [error, clearError]);

  const handleStartEditing = useCallback(() => {
    if (!task) {
      return;
    }

    setTitleDraft(task.title);
    setDescriptionDraft(task.description);
    setTitleError(null);
    setDescriptionError(null);
    setEditing(true);
  }, [task]);

  const handleCancelEditing = useCallback(() => {
    if (task) {
      setTitleDraft(task.title);
      setDescriptionDraft(task.description);
    }

    setTitleError(null);
    setDescriptionError(null);
    setEditing(false);
  }, [task]);

  const handleChangeTitle = useCallback((text: string) => {
    if (titleError) {
      setTitleError(null);
    }

    setTitleDraft(text);
  }, [titleError]);

  const handleChangeDescription = useCallback((text: string) => {
    if (descriptionError) {
      setDescriptionError(null);
    }

    setDescriptionDraft(text);
  }, [descriptionError]);

  const handleSave = useCallback(async () => {
    if (!task) {
      return;
    }

    const nextTitleError = validateTaskTitle(titleDraft);
    const nextDescriptionError = validateTaskDescription(descriptionDraft);

    setTitleError(nextTitleError);
    setDescriptionError(nextDescriptionError);

    if (nextTitleError || nextDescriptionError) {
      return;
    }

    setSaving(true);

    try {
      await updateTask(task.id, {
        title: titleDraft,
        description: descriptionDraft,
      });
      setEditing(false);
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Unable to update task.';
      setDescriptionError(message);
    } finally {
      setSaving(false);
    }
  }, [descriptionDraft, task, titleDraft, updateTask]);

  const handleToggleCompletion = useCallback(async (completed: boolean) => {
    if (!task) {
      return;
    }

    setUpdatingStatus(true);
    try {
      await updateTask(task.id, { completed });
    } finally {
      setUpdatingStatus(false);
    }
  }, [task, updateTask]);

  const handleRetry = useCallback(() => {
    fetchTasks().catch(() => {
      // Errors handled elsewhere
    });
  }, [fetchTasks]);

  const handleBackToList = useCallback(() => {
    router.replace('/(tabs)');
  }, [router]);

  const headerTitle = task ? task.title : 'Task not found';

  return (
    <>
      <Stack.Screen
        options={{
          title: headerTitle,
          headerStyle: { backgroundColor: palette.surfaceElevated },
          headerTintColor: palette.text,
          headerTitleStyle: { color: palette.text },
        }}
      />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
        <View style={[styles.container, { backgroundColor: palette.background }]}>
          {!task && loading ? (
            <LoadingIndicator fullScreen />
          ) : null}

          {!task && !loading ? (
            <View style={styles.emptyStateContainer}>
              <EmptyState
                title="Task not found"
                description="It may have been deleted or you might have opened an outdated link."
              />
              <Button label="Back to tasks" onPress={handleBackToList} />
            </View>
          ) : null}

          {task ? (
            <TaskDetailCard
              task={task}
              titleDraft={titleDraft}
              descriptionDraft={descriptionDraft}
              editing={editing}
              titleError={titleError}
              descriptionError={descriptionError}
              onChangeTitle={handleChangeTitle}
              onChangeDescription={handleChangeDescription}
              onStartEditing={handleStartEditing}
              onCancelEditing={handleCancelEditing}
              onSave={handleSave}
              onToggleCompletion={handleToggleCompletion}
              saving={saving}
              updatingStatus={updatingStatus}
            />
          ) : null}

          {task && !editing ? (
            <View style={styles.secondaryActions}>
              <Button label="Back to tasks" variant="ghost" onPress={handleBackToList} />
              <Button label="Refresh" variant="secondary" onPress={handleRetry} />
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  secondaryActions: {
    gap: 12,
  },
});

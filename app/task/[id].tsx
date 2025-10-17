import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '@/components/common/EmptyState';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import TaskDetailCard from '@/components/task/TaskDetailCard';
import Colors from '@/constants/Colors';
import { useTasks } from '@/hooks/useTasks';
import { useTheme } from '@/hooks/useTheme';
import { validateTaskDescription, validateTaskTitle } from '@/utils/validation';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
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
  const [dueDateDraft, setDueDateDraft] = useState<Date | null>(null);
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
      setDueDateDraft(task.dueDate ?? null);
    }
  }, [task?.description, task?.dueDate, task?.title, task]);

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
    setDueDateDraft(task.dueDate ?? null);
    setTitleError(null);
    setDescriptionError(null);
    setEditing(true);
  }, [task]);

  const handleCancelEditing = useCallback(() => {
    if (task) {
      setTitleDraft(task.title);
      setDescriptionDraft(task.description);
      setDueDateDraft(task.dueDate ?? null);
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

  const handleChangeDueDate = useCallback((date: Date | null) => {
    setDueDateDraft(date);
  }, []);

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
      const trimmedDescription = descriptionDraft.trim();
      await updateTask(task.id, {
        title: titleDraft,
        description: trimmedDescription.length > 0 ? trimmedDescription : null,
        dueDate: dueDateDraft ?? null,
      });
      setEditing(false);
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Unable to update task.';
      setDescriptionError(message);
    } finally {
      setSaving(false);
    }
  }, [descriptionDraft, dueDateDraft, task, titleDraft, updateTask]);

  const handleToggleCompletion = useCallback(async (completed: boolean) => {
    if (!task) {
      return;
    }

    setUpdatingStatus(true);
    try {
      await updateTask(task.id, { completed });
      await fetchTasks();
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
    } finally {
      setUpdatingStatus(false);
    }
  }, [task, updateTask, fetchTasks]);

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
              dueDateDraft={dueDateDraft}
              onChangeTitle={handleChangeTitle}
              onChangeDescription={handleChangeDescription}
              onChangeDueDate={handleChangeDueDate}
              onStartEditing={handleStartEditing}
              onCancelEditing={handleCancelEditing}
              onSave={handleSave}
              onToggleCompletion={handleToggleCompletion}
              saving={saving}
              updatingStatus={updatingStatus}
            />
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
});

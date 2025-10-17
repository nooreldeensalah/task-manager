import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Colors from '@/constants/Colors';
import { TASK_DESCRIPTION_MAX_LENGTH, TASK_TITLE_MAX_LENGTH } from '@/constants/Config';
import { useTheme } from '@/hooks/useTheme';
import type { Task } from '@/types/task';
import { formatDateTime, formatRelativeTime } from '@/utils/formatting';

export interface TaskDetailCardProps {
  task: Task;
  titleDraft: string;
  descriptionDraft: string;
  editing: boolean;
  titleError?: string | null;
  descriptionError?: string | null;
  onChangeTitle: (text: string) => void;
  onChangeDescription: (text: string) => void;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onSave: () => void;
  onToggleCompletion: (completed: boolean) => void;
  saving?: boolean;
  updatingStatus?: boolean;
}

export const TaskDetailCard = ({
  task,
  titleDraft,
  descriptionDraft,
  editing,
  titleError,
  descriptionError,
  onChangeTitle,
  onChangeDescription,
  onStartEditing,
  onCancelEditing,
  onSave,
  onToggleCompletion,
  saving = false,
  updatingStatus = false,
}: TaskDetailCardProps) => {
  const { theme } = useTheme();
  const palette = Colors[theme];

  const createdAtLabel = useMemo(
    () => formatDateTime(task.createdAt, { dateStyle: 'medium', timeStyle: 'short' }),
    [task.createdAt],
  );

  const updatedAtLabel = useMemo(
    () => formatDateTime(task.updatedAt, { dateStyle: 'medium', timeStyle: 'short' }),
    [task.updatedAt],
  );

  const completedAtLabel = useMemo(() => {
    if (!task.completedAt) {
      return null;
    }

    const absolute = formatDateTime(task.completedAt, { dateStyle: 'medium', timeStyle: 'short' });
    const relative = formatRelativeTime(task.completedAt);
    return `${absolute}${relative ? ` (${relative})` : ''}`;
  }, [task.completedAt]);

  const dueDateLabel = useMemo(() => {
    if (!task.dueDate) {
      return null;
    }

    const absolute = formatDateTime(task.dueDate, { dateStyle: 'medium', timeStyle: 'short' });
    const relative = formatRelativeTime(task.dueDate);
    return `${absolute}${relative ? ` (${relative})` : ''}`;
  }, [task.dueDate]);

  return (
    <View style={[styles.card, { backgroundColor: palette.surfaceElevated, borderColor: palette.border }]}
      accessibilityLabel="Task details card">
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: palette.text }]}>Task details</Text>
        <Button
          label={task.completed ? 'Mark incomplete' : 'Mark complete'}
          variant={task.completed ? 'secondary' : 'primary'}
          onPress={() => onToggleCompletion(!task.completed)}
          disabled={updatingStatus}
          loading={updatingStatus}
        />
      </View>

      <View style={styles.section}>
        {editing ? (
          <>
            <Input
              label="Title"
              value={titleDraft}
              onChangeText={onChangeTitle}
              maxLength={TASK_TITLE_MAX_LENGTH}
              errorText={titleError}
              accessibilityLabel="Edit task title"
              autoFocus
              returnKeyType="next"
              blurOnSubmit={false}
            />
            <Input
              label="Description"
              multiline
              value={descriptionDraft}
              onChangeText={onChangeDescription}
              maxLength={TASK_DESCRIPTION_MAX_LENGTH}
              showCounter
              errorText={descriptionError}
              accessibilityLabel="Edit task description"
              textAlignVertical="top"
              style={styles.input}
            />
          </>
        ) : (
          <View style={styles.summarySection}>
            <Text style={[styles.primaryTitle, { color: palette.text }]} accessibilityLabel="Task title">
              {task.title}
            </Text>
            <Text
              style={[styles.descriptionText, { color: palette.textMuted }]}
              accessibilityLabel="Task description">
              {task.description || 'No additional details yet.'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.metaSection}>
        <Text style={[styles.metaText, { color: palette.textMuted }]}>Created {createdAtLabel}</Text>
        <Text style={[styles.metaText, { color: palette.textMuted }]}>Updated {updatedAtLabel}</Text>
        {completedAtLabel ? (
          <Text style={[styles.metaText, { color: palette.textMuted }]}>Completed {completedAtLabel}</Text>
        ) : null}
        {dueDateLabel ? (
          <Text style={[styles.metaText, { color: palette.textMuted }]}>Due {dueDateLabel}</Text>
        ) : null}
      </View>

      <View style={styles.actionsRow}>
        {editing ? (
          <>
            <Button
              label="Cancel"
              variant="ghost"
              onPress={onCancelEditing}
              disabled={saving}
            />
            <Button
              label="Save changes"
              onPress={onSave}
              loading={saving}
              disabled={saving}
              fullWidth
            />
          </>
        ) : (
          <Button label="Edit task details" variant="secondary" onPress={onStartEditing} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  section: {
    gap: 12,
  },
  summarySection: {
    gap: 8,
  },
  primaryTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  input: {
    minHeight: 120,
  },
  metaSection: {
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionsRow: {
    gap: 12,
  },
});

export default TaskDetailCard;

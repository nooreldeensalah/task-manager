import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import Button from '@/components/common/Button';
import DueDateField from '@/components/common/DueDateField';
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
  dueDateDraft: Date | null;
  onChangeTitle: (text: string) => void;
  onChangeDescription: (text: string) => void;
  onChangeDueDate: (date: Date | null) => void;
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
  dueDateDraft,
  onChangeTitle,
  onChangeDescription,
  onChangeDueDate,
  onStartEditing,
  onCancelEditing,
  onSave,
  onToggleCompletion,
  saving = false,
  updatingStatus = false,
}: TaskDetailCardProps) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const { width } = useWindowDimensions();
  const isWideLayout = width >= 768;

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
    <View
      style={[
        styles.card,
        isWideLayout ? styles.cardWide : null,
        { backgroundColor: palette.surfaceElevated, borderColor: palette.border },
      ]}
      accessibilityLabel="Task details card">
      <View style={styles.headerRow}>
        <View style={styles.titleSection}>
          <Text style={[styles.primaryTitle, { color: task.completed ? palette.textMuted : palette.text }]} accessibilityLabel="Task title">
            {task.title}
          </Text>
          {task.completed && (
            <View style={styles.completedBadge}>
              <MaterialCommunityIcons name="check-circle" size={16} color={palette.success} />
              <Text style={[styles.completedText, { color: palette.success }]}>Completed</Text>
            </View>
          )}
        </View>
        <View style={styles.headerActions}>
          {!editing && (
            <Pressable
              onPress={onStartEditing}
              style={({ pressed }) => [
                styles.iconButton,
                {
                  backgroundColor: pressed ? palette.surface : 'transparent',
                  borderColor: palette.border,
                }
              ]}
              accessibilityLabel="Edit task"
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name="pencil" size={20} color={palette.text} />
            </Pressable>
          )}
          <Pressable
            onPress={() => onToggleCompletion(!task.completed)}
            disabled={updatingStatus}
            style={({ pressed }) => [
              styles.iconButton,
              {
                backgroundColor: task.completed
                  ? (pressed ? palette.surface : palette.surfaceElevated)
                  : (pressed ? palette.primaryMuted : palette.primary),
                borderColor: task.completed ? palette.border : 'transparent',
              }
            ]}
            accessibilityLabel={task.completed ? "Mark incomplete" : "Mark complete"}
            accessibilityRole="button"
          >
            {updatingStatus ? (
              <ActivityIndicator size="small" color={task.completed ? palette.text : palette.background} />
            ) : (
              <MaterialCommunityIcons
                name={task.completed ? 'check-circle-outline' : 'check-circle'}
                size={20}
                color={task.completed ? palette.text : palette.background}
              />
            )}
          </Pressable>
        </View>
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
              returnKeyType="next"
              blurOnSubmit={false}
            />
            <Input
              label="Description (optional)"
              multiline
              value={descriptionDraft}
              onChangeText={onChangeDescription}
              maxLength={TASK_DESCRIPTION_MAX_LENGTH}
              showCounter
              errorText={descriptionError}
              accessibilityLabel="Edit task description"
              textAlignVertical="top"
              placeholder="Add more context (optional)"
              helperText="Optional — leave blank if not needed"
              style={styles.input}
            />
            <DueDateField value={dueDateDraft} onChange={onChangeDueDate} label="Due date (optional)" mode="datetime" />
          </>
        ) : (
          <View style={styles.summarySection}>
            <Text
              style={[styles.descriptionText, { color: palette.textMuted }]}
              accessibilityLabel="Task description">
              {task.description || 'No additional details yet.'}
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.metaSection, isWideLayout ? styles.metaSectionWide : null]}>
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
        ) : null}
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
    width: '100%',
  },
  cardWide: {
    padding: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    minWidth: 40,
    minHeight: 40,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    flex: 1,
    gap: 8,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
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
  metaSectionWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
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

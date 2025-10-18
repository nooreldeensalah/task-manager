import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import Button from '@/components/common/Button';
import DueDateField from '@/components/common/DueDateField';
import Input from '@/components/common/Input';
import Colors from '@/constants/Colors';
import { TASK_DESCRIPTION_MAX_LENGTH, TASK_TITLE_MAX_LENGTH } from '@/constants/Config';
import { BREAKPOINTS, RADIUS, SPACING, TYPOGRAPHY } from '@/constants/Layout';
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
  const isWideLayout = width >= BREAKPOINTS.tablet;

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

  const metaItems = useMemo(
    () =>
      [
        { label: 'Created', value: createdAtLabel },
        { label: 'Updated', value: updatedAtLabel },
        task.completed ? { label: 'Completed', value: completedAtLabel } : null,
        dueDateLabel ? { label: 'Due', value: dueDateLabel } : null,
      ].filter((item): item is { label: string; value: string } => Boolean(item?.value)),
    [completedAtLabel, createdAtLabel, dueDateLabel, task.completed, updatedAtLabel],
  );

  const completionIconName = task.completed ? 'check-circle-outline' : 'check-circle';
  const completionBackground = task.completed ? palette.surface : palette.primary;
  const completionIconColor = task.completed ? palette.primary : palette.background;
  const completionBorderColor = task.completed ? palette.primary : 'transparent';

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
          <Text
            style={[styles.primaryTitle, { color: task.completed ? palette.textMuted : palette.text }]}
            accessibilityLabel="Task title">
            {task.title}
          </Text>
          {task.completed && (
            <View style={[styles.completedBadge, { borderColor: palette.success, backgroundColor: palette.surface }]}>
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
                },
              ]}
              accessibilityLabel="Edit task"
              accessibilityRole="button">
              <MaterialCommunityIcons name="pencil" size={20} color={palette.text} />
            </Pressable>
          )}
          <Pressable
            onPress={() => onToggleCompletion(!task.completed)}
            disabled={updatingStatus}
            style={({ pressed }) => [
              styles.iconButton,
              {
                backgroundColor: pressed ? palette.primaryMuted : completionBackground,
                borderColor: completionBorderColor,
              },
            ]}
            accessibilityLabel={task.completed ? 'Mark incomplete' : 'Mark complete'}
            accessibilityRole="button">
            {updatingStatus ? (
              <ActivityIndicator size="small" color={completionIconColor} />
            ) : (
              <MaterialCommunityIcons name={completionIconName} size={20} color={completionIconColor} />
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
              helperText="Optional - leave blank if not needed"
              style={styles.descriptionInput}
            />
            <DueDateField value={dueDateDraft} onChange={onChangeDueDate} label="Due date (optional)" mode="datetime" />
          </>
        ) : (
          <View style={styles.summarySection}>
            <Text style={[styles.descriptionText, { color: palette.textMuted }]} accessibilityLabel="Task description">
              {task.description || 'No additional details yet.'}
            </Text>
          </View>
        )}
      </View>

      {metaItems.length > 0 && (
        <View style={[styles.metaSection, isWideLayout ? styles.metaSectionWide : null]}>
          {metaItems.map((item) => (
            <View key={item.label} style={[styles.metaItem, isWideLayout ? styles.metaItemWide : null]}>
              <Text style={[styles.metaLabel, { color: palette.textMuted }]}>{item.label}</Text>
              <Text style={[styles.metaValue, { color: palette.text }]}>{item.value}</Text>
            </View>
          ))}
        </View>
      )}

      {editing && (
        <View style={styles.actionsRow}>
          <Button
            label="Cancel"
            variant="ghost"
            onPress={onCancelEditing}
            disabled={saving}
            style={styles.actionButton}
          />
          <Button
            label="Save changes"
            onPress={onSave}
            loading={saving}
            style={styles.primaryActionButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  cardWide: {
    padding: SPACING.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  titleSection: {
    flex: 1,
    gap: SPACING.xs,
    alignItems: 'flex-start',
  },
  primaryTitle: {
    ...TYPOGRAPHY.titleLg,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
  },
  completedText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  iconButton: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  section: {
    gap: SPACING.md,
  },
  summarySection: {
    gap: SPACING.sm,
  },
  descriptionText: {
    ...TYPOGRAPHY.body,
  },
  descriptionInput: {
    minHeight: 120,
  },
  metaSection: {
    gap: SPACING.sm,
  },
  metaSectionWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  metaItem: {
    gap: SPACING.xs,
  },
  metaItemWide: {
    flexBasis: '48%',
  },
  metaLabel: {
    ...TYPOGRAPHY.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: 'bold',
  },
  metaValue: {
    ...TYPOGRAPHY.bodySmall,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
  },
  primaryActionButton: {
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
  },
});

export default TaskDetailCard;

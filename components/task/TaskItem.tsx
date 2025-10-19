import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import ConfirmDialog from '@/components/common/ConfirmDialog';
import Colors from '@/constants/Colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '@/constants/Layout';
import { useTheme } from '@/hooks/useTheme';
import type { Task, TaskId } from '@/types/task';
import { formatDateTime, formatRelativeTime } from '@/utils/formatting';

export interface TaskItemProps {
  task: Task;
  onToggle: (taskId: TaskId, completed: boolean) => void;
  onDelete: (taskId: TaskId) => void;
  onPress?: (taskId: TaskId) => void;
  appearanceDelay?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const TaskItem = ({ task, onToggle, onDelete, onPress, appearanceDelay = 0 }: TaskItemProps) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const [confirmVisible, setConfirmVisible] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const relativeDate = useMemo(() => {
    const reference = task.completed
      ? task.completedAt ?? task.updatedAt
      : task.updatedAt;

    return formatRelativeTime(reference);
  }, [task.completed, task.completedAt, task.updatedAt]);

  const dueDateLabel = useMemo(() => {
    if (!task.dueDate) {
      return null;
    }

    const relative = formatRelativeTime(task.dueDate);
    return relative || formatDateTime(task.dueDate, { dateStyle: 'medium' });
  }, [task.dueDate]);

  const handleToggle = useCallback(() => {
    onToggle(task.id, !task.completed);
  }, [onToggle, task.completed, task.id]);

  const handleDelete = useCallback(() => {
    setConfirmVisible(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    setConfirmVisible(false);
    onDelete(task.id);
  }, [onDelete, task.id]);

  const handleCancelDelete = useCallback(() => {
    setConfirmVisible(false);
  }, []);

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(task.id);
      return;
    }

    onToggle(task.id, !task.completed);
  }, [onPress, onToggle, task.completed, task.id]);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 240,
      delay: appearanceDelay,
      useNativeDriver: true,
    }).start();
  }, [appearanceDelay, opacity]);

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 6,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
    }).start();
  }, [scale]);

  return (
    <>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <AnimatedPressable
          accessibilityRole="button"
          accessibilityHint={onPress ? 'Open task details' : 'Toggle task completion'}
          accessibilityState={{ checked: task.completed }}
          style={[
            styles.container,
            {
              backgroundColor: palette.surfaceElevated,
              borderColor: palette.border,
              opacity: task.completed ? 0.65 : 1,
            },
          ]}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          testID={`task-item-${task.id}`}>
          <Pressable
            onPress={handleToggle}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: task.completed }}
            style={[
              styles.checkbox,
              {
                borderColor: task.completed ? palette.primary : palette.border,
                backgroundColor: task.completed ? palette.primary : 'transparent',
              },
            ]}>
            {task.completed && <MaterialCommunityIcons name="check" size={18} color={palette.background} />}
          </Pressable>
          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                {
                  color: palette.text,
                  textDecorationLine: task.completed ? 'line-through' : 'none',
                },
              ]}
              numberOfLines={2}
              accessibilityLabel="Task title">
              {task.title}
            </Text>
            <View style={styles.descriptionContainer}>
              {task.description ? (
                <Text
                  style={[styles.description, { color: palette.textMuted }]}
                  numberOfLines={2}
                  accessibilityLabel="Task description">
                  {task.description}
                </Text>
              ) : null}
            </View>
            <View style={styles.metaRow}>
              <Text style={[styles.meta, { color: palette.textMuted }]}>{relativeDate}</Text>
              {dueDateLabel ? (
                <Text style={[styles.due, { color: palette.danger }]} accessibilityLabel="Task due date">
                  Due {dueDateLabel}
                </Text>
              ) : null}
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete task"
            style={styles.deleteButton}
            onPress={handleDelete}>
            <MaterialCommunityIcons name="trash-can-outline" size={22} color={palette.danger} />
          </Pressable>
        </AnimatedPressable>
      </Animated.View>

      <ConfirmDialog
        visible={confirmVisible}
        title="Delete task?"
        message="This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmLabel="Delete"
        cancelLabel="Keep"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: SPACING.xs,
  },
  title: {
    ...TYPOGRAPHY.subtitle,
  },
  descriptionContainer: {
    minHeight: TYPOGRAPHY.bodySmall.lineHeight * 2,
  },
  description: {
    ...TYPOGRAPHY.bodySmall,
  },
  meta: {
    ...TYPOGRAPHY.caption,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  due: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  deleteButton: {
    padding: SPACING.xs,
  },
});

export default TaskItem;

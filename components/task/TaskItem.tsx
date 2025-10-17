import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ConfirmDialog from '@/components/common/ConfirmDialog';
import Colors from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import type { Task, TaskId } from '@/types/task';
import { formatRelativeTime } from '@/utils/formatting';

export interface TaskItemProps {
  task: Task;
  onToggle: (taskId: TaskId, completed: boolean) => void;
  onDelete: (taskId: TaskId) => void;
  onPress?: (taskId: TaskId) => void;
}

export const TaskItem = ({ task, onToggle, onDelete, onPress }: TaskItemProps) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const [confirmVisible, setConfirmVisible] = useState(false);

  const relativeDate = useMemo(() => formatRelativeTime(task.createdAt), [task.createdAt]);

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

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityHint="Toggle task completion or open details"
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
              styles.description,
              {
                color: palette.text,
                textDecorationLine: task.completed ? 'line-through' : 'none',
              },
            ]}
            numberOfLines={3}>
            {task.description}
          </Text>
          <Text style={[styles.meta, { color: palette.textMuted }]}>{relativeDate}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete task"
          style={styles.deleteButton}
          onPress={handleDelete}>
          <MaterialCommunityIcons name="trash-can-outline" size={22} color={palette.danger} />
        </Pressable>
      </Pressable>

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
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
    gap: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 6,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
  },
  meta: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 4,
  },
});

export default TaskItem;

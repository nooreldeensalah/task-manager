import { useCallback, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import { Button } from '@/components/common/Button';
import Input from '@/components/common/Input';
import { TASK_DESCRIPTION_MAX_LENGTH } from '@/constants/Config';
import { validateTaskDescription } from '@/utils/validation';

export interface TaskInputProps {
  onSubmit: (description: string) => Promise<void> | void;
  loading?: boolean;
}

export const TaskInput = ({ onSubmit, loading = false }: TaskInputProps) => {
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    const validationError = validateTaskDescription(description);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await onSubmit(description.trim());
      setDescription('');
      setError(null);
      Keyboard.dismiss();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create task.');
    }
  }, [description, onSubmit]);

  const handleChangeText = useCallback((text: string) => {
    setDescription(text);
    if (error) {
      setError(null);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <Input
        label="What needs to get done?"
        placeholder="Add a task"
        multiline
        value={description}
        onChangeText={handleChangeText}
        helperText="Keep it short and actionable"
        errorText={error}
        maxLength={TASK_DESCRIPTION_MAX_LENGTH}
        showCounter
        autoCorrect
        autoCapitalize="sentences"
        accessibilityLabel="Task description"
        textAlignVertical="top"
        style={styles.input}
      />
      <Button
        label="Add Task"
        onPress={handleSubmit}
        loading={loading}
        disabled={description.trim().length === 0}
        fullWidth
        accessibilityLabel="Add task"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    padding: 16,
    borderRadius: 16,
  },
  input: {
    minHeight: 90,
  },
});

export default TaskInput;

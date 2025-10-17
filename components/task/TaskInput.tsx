import { useCallback, useRef, useState } from 'react';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/common/Button';
import DueDateField from '@/components/common/DueDateField';
import Input from '@/components/common/Input';
import { TASK_DESCRIPTION_MAX_LENGTH, TASK_TITLE_MAX_LENGTH } from '@/constants/Config';
import { validateTaskDescription, validateTaskTitle } from '@/utils/validation';

export interface TaskInputProps {
  onSubmit: (task: { title: string; description?: string | null; dueDate: Date | null }) => Promise<void> | void;
  loading?: boolean;
}

export const TaskInput = ({ onSubmit, loading = false }: TaskInputProps) => {
  const descriptionInputRef = useRef<TextInput | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    const titleValidationError = validateTaskTitle(title);
    const descriptionValidationError = validateTaskDescription(description);
    const trimmedDescription = description.trim();

    setTitleError(titleValidationError);
    setDescriptionError(descriptionValidationError);

    if (titleValidationError || descriptionValidationError) {
      return;
    }

    try {
      await onSubmit({
        title,
        description: trimmedDescription.length > 0 ? trimmedDescription : undefined,
        dueDate,
      });
      setTitle('');
      setDescription('');
      setDueDate(null);
      setTitleError(null);
      setDescriptionError(null);
      Keyboard.dismiss();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Unable to create task.';
      setDescriptionError(message);
    }
  }, [description, onSubmit, title]);

  const handleChangeTitle = useCallback((text: string) => {
    setTitle(text);
    if (titleError) {
      setTitleError(null);
    }
  }, [titleError]);

  const handleChangeText = useCallback((text: string) => {
    setDescription(text);
    if (descriptionError) {
      setDescriptionError(null);
    }
  }, [descriptionError]);

  return (
    <View style={styles.container}>
      <Input
        label="Task title"
        placeholder="Add a title"
        value={title}
        onChangeText={handleChangeTitle}
        helperText="Give your task a clear, action-oriented title"
        errorText={titleError}
        maxLength={TASK_TITLE_MAX_LENGTH}
        accessibilityLabel="Task title"
        autoCapitalize="sentences"
        autoCorrect
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => {
          descriptionInputRef.current?.focus();
        }}
      />
      <Input
        ref={descriptionInputRef}
        label="Task description"
    placeholder="Add details (optional)"
        multiline
        value={description}
        onChangeText={handleChangeText}
    helperText="Optional — add more context if you need to"
        errorText={descriptionError}
        maxLength={TASK_DESCRIPTION_MAX_LENGTH}
        showCounter
        autoCorrect
        autoCapitalize="sentences"
        accessibilityLabel="Task description"
        textAlignVertical="top"
        style={styles.input}
      />
      <DueDateField value={dueDate} onChange={setDueDate} label="Due date (optional)" mode="datetime" />
      <Button
        label="Add Task"
        onPress={handleSubmit}
        loading={loading}
        disabled={title.trim().length === 0}
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

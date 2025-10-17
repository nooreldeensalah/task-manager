import { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Colors from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { formatDateInput, formatTimeInput, roundToMinute } from '@/utils/formatting';

export interface WebDueDatePickerProps {
  visible: boolean;
  onClose: () => void;
  onSave: (date: Date | null) => void;
  initialDate: Date;
}

export const WebDueDatePicker = ({ visible, onClose, onSave, initialDate }: WebDueDatePickerProps) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      const rounded = roundToMinute(initialDate);
      setDateInput(formatDateInput(rounded));
      setTimeInput(formatTimeInput(rounded));
      setError(null);
    }
  }, [visible, initialDate]);

  const handleSave = useCallback(() => {
    const trimmedDate = dateInput.trim();
    const trimmedTime = timeInput.trim();

    if (!trimmedDate || !/^\d{4}-\d{2}-\d{2}$/.test(trimmedDate)) {
      setError('Enter a valid date in YYYY-MM-DD format.');
      return;
    }

    if (!trimmedTime || !/^\d{2}:\d{2}$/.test(trimmedTime)) {
      setError('Enter a valid time in HH:MM format.');
      return;
    }

    const [hoursString, minutesString] = trimmedTime.split(':');
    const hours = Number.parseInt(hoursString, 10);
    const minutes = Number.parseInt(minutesString, 10);

    if (Number.isNaN(hours) || Number.isNaN(minutes) || hours > 23 || minutes > 59) {
      setError('Time must be between 00:00 and 23:59.');
      return;
    }

    const candidate = new Date(`${trimmedDate}T${trimmedTime}`);

    if (Number.isNaN(candidate.getTime())) {
      setError('That date and time could not be parsed.');
      return;
    }

    onSave(candidate);
  }, [dateInput, timeInput, onSave]);

  const handleClear = useCallback(() => {
    onSave(null);
  }, [onSave]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.card, { backgroundColor: palette.surfaceElevated, borderColor: palette.border }]}
          onPress={(event) => event.stopPropagation()}
        >
          <Text style={[styles.title, { color: palette.text }]}>Choose a due date</Text>
          <Text style={[styles.subtitle, { color: palette.textMuted }]}>Pick the exact minute you want to finish.</Text>

          <Input
            label="Date"
            placeholder="YYYY-MM-DD"
            value={dateInput}
            onChangeText={(text) => {
              setDateInput(text);
              setError(null);
            }}
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Time"
            placeholder="HH:MM"
            value={timeInput}
            onChangeText={(text) => {
              setTimeInput(text);
              setError(null);
            }}
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {error ? (
            <Text style={[styles.error, { color: palette.danger }]} accessibilityLiveRegion="polite">
              {error}
            </Text>
          ) : null}

          <View style={styles.actionsRow}>
            <Button label="Clear" variant="ghost" onPress={handleClear} />
            <Button label="Save" onPress={handleSave} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  error: {
    fontSize: 13,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
});

export default WebDueDatePicker;
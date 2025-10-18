import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import Button from '@/components/common/Button';
import Colors from '@/constants/Colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '@/constants/Layout';
import { useTheme } from '@/hooks/useTheme';
import { formatDateTimeLocalInput, roundToMinute } from '@/utils/formatting';

export interface WebDueDatePickerProps {
  visible: boolean;
  onClose: () => void;
  onSave: (date: Date | null) => void;
  initialDate: Date;
  minimumDate: Date;
}

export const WebDueDatePicker = ({ visible, onClose, onSave, initialDate, minimumDate }: WebDueDatePickerProps) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const [dateTimeInput, setDateTimeInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const roundedMinimum = useMemo(() => roundToMinute(minimumDate), [minimumDate]);
  const minValue = useMemo(() => formatDateTimeLocalInput(roundedMinimum), [roundedMinimum]);

  useEffect(() => {
    if (visible) {
      const rounded = roundToMinute(initialDate);
      setDateTimeInput(formatDateTimeLocalInput(rounded));
      setError(null);
    }
  }, [visible, initialDate]);

  const handleSave = useCallback(() => {
    const trimmed = dateTimeInput.trim();

    if (!trimmed) {
      setError('Choose a date and time.');
      return;
    }

    const candidate = new Date(trimmed);

    if (Number.isNaN(candidate.getTime())) {
      setError('That date and time could not be parsed.');
      return;
    }

    const rounded = roundToMinute(candidate);
    if (rounded.getTime() < roundedMinimum.getTime()) {
      setError('Choose a time in the future.');
      return;
    }

    onSave(rounded);
    onClose();
  }, [dateTimeInput, onClose, onSave, roundedMinimum]);

  const handleClear = useCallback(() => {
    onSave(null);
    onClose();
  }, [onClose, onSave]);

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

          <View style={styles.inputGroup}>
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: SPACING.xs,
                width: '100%',
              }}>
              <Text style={[styles.inputLabel, { color: palette.text }]}>Date &amp; time</Text>
              <View
                style={{
                  borderRadius: RADIUS.md,
                  borderWidth: 1,
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.md,
                  borderColor: focused ? palette.primary : palette.border,
                  backgroundColor: focused ? palette.surfaceElevated : palette.surface,
                }}>
                <input
                  type="datetime-local"
                  value={dateTimeInput}
                  min={minValue}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setDateTimeInput(event.target.value);
                    setError(null);
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={{
                    width: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    padding: 0,
                    margin: 0,
                    boxSizing: 'border-box',
                    fontSize: TYPOGRAPHY.body.fontSize,
                    lineHeight: `${TYPOGRAPHY.body.lineHeight}px`,
                    color: palette.text,
                    outline: 'none',
                    colorScheme: theme === 'dark' ? 'dark' : 'light',
                  }}
                />
              </View>
            </label>
          </View>

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
    padding: SPACING.lg,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.titleMd,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.bodySmall,
    textAlign: 'center',
  },
  inputLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  error: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
});

export default WebDueDatePicker;
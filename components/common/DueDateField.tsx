import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useCallback, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

import WebDueDatePicker from '@/components/common/WebDueDatePicker';
import Colors from '@/constants/Colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '@/constants/Layout';
import { useTheme } from '@/hooks/useTheme';
import { formatDateTime, roundToMinute } from '@/utils/formatting';

export type DueDatePickerMode = 'date' | 'time' | 'datetime';

export interface DueDateFieldProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  mode?: DueDatePickerMode;
}

const getDisplayOptions = (mode: DueDatePickerMode) => {
  switch (mode) {
    case 'time':
      return { timeStyle: 'short' as const };
    case 'datetime':
      return { dateStyle: 'medium' as const, timeStyle: 'short' as const };
    case 'date':
    default:
      return { dateStyle: 'medium' as const };
  }
};

const SELECTOR_HORIZONTAL_PADDING = SPACING.md - SPACING.xs;
const SELECTOR_VERTICAL_PADDING = SPACING.sm + SPACING.xxs;
const CLEAR_BUTTON_HORIZONTAL_PADDING = SPACING.sm + SPACING.xxs;

export const DueDateField = ({ value, onChange, label = 'Due date', mode = 'datetime' }: DueDateFieldProps) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const [iosPickerVisible, setIosPickerVisible] = useState(false);
  const [webPickerVisible, setWebPickerVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const displayValue = useMemo(() => {
    if (!value) {
      return 'Add due date';
    }

    const options = getDisplayOptions(mode);
    return formatDateTime(value, options);
  }, [mode, value]);

  const minimumDate = roundToMinute(new Date());

  const defaultDate = useMemo(() => {
    const candidate = roundToMinute(value ?? minimumDate);
    return candidate.getTime() < minimumDate.getTime() ? minimumDate : candidate;
  }, [minimumDate, value]);

  const applyDueDate = useCallback(
    (next: Date | null): boolean => {
      if (next) {
        const rounded = roundToMinute(next);
        const now = roundToMinute(new Date());

        if (rounded.getTime() < now.getTime()) {
          setErrorMessage('Choose a time in the future.');
          return false;
        }

        onChange(rounded);
        setErrorMessage(null);
        return true;
      }

      onChange(null);
      setErrorMessage(null);
      return true;
    },
    [onChange],
  );

  const closeIosPicker = useCallback(() => {
    setIosPickerVisible(false);
  }, []);

  const handleChange = useCallback(
    (_event: DateTimePickerEvent, selectedDate?: Date) => {
      if (selectedDate) {
        applyDueDate(selectedDate);
      }
    },
    [applyDueDate],
  );

  const handleOpenPicker = useCallback(() => {
    setErrorMessage(null);

    if (Platform.OS === 'web') {
      setWebPickerVisible(true);
      return;
    }

    if (Platform.OS === 'android') {
      const openTimePicker = (baseDate: Date) => {
        DateTimePickerAndroid.open({
          mode: 'time',
          value: baseDate,
          is24Hour: true,
          onChange: (event, selectedTime) => {
            if (event.type !== 'set' || !selectedTime) {
              return;
            }

            const combined = new Date(baseDate);
            combined.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
            applyDueDate(combined);
          },
        });
      };

      DateTimePickerAndroid.open({
        mode: 'date',
        value: defaultDate,
        minimumDate,
        onChange: (event, selectedDate) => {
          if (event.type !== 'set' || !selectedDate) {
            return;
          }

          const baseDate = new Date(selectedDate);
          baseDate.setHours(defaultDate.getHours(), defaultDate.getMinutes(), 0, 0);
          openTimePicker(baseDate);
        },
      });
      return;
    }

    setIosPickerVisible(true);
  }, [applyDueDate, defaultDate, minimumDate]);

  const handleClear = useCallback(() => {
    applyDueDate(null);
    setIosPickerVisible(false);
    setWebPickerVisible(false);
  }, [applyDueDate]);

  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, { color: palette.text }]}>{label}</Text> : null}
      <View style={styles.row}>
        <Pressable
          style={[styles.selector, { backgroundColor: palette.surface, borderColor: palette.border }]}
          accessibilityRole="button"
          accessibilityLabel="Set due date"
          onPress={handleOpenPicker}>
          <MaterialCommunityIcons
            name="calendar"
            size={18}
            color={value ? palette.primary : palette.textMuted}
          />
          <Text style={[styles.selectorText, { color: value ? palette.primary : palette.textMuted }]}>
                        {displayValue}
          </Text>
        </Pressable>
        {value ? (
          <Pressable
            onPress={handleClear}
            accessibilityRole="button"
            accessibilityLabel="Clear due date"
            style={[styles.clearButton, { backgroundColor: palette.surface }]}>
            <MaterialCommunityIcons name="close" size={16} color={palette.textMuted} />
            <Text style={[styles.clearText, { color: palette.textMuted }]}>Clear</Text>
          </Pressable>
        ) : null}
      </View>

      {errorMessage ? (
        <Text style={[styles.errorText, { color: palette.danger }]} accessibilityLiveRegion="polite">
          {errorMessage}
        </Text>
      ) : null}

      {Platform.OS === 'ios' && iosPickerVisible ? (
        <View style={[styles.iosPickerContainer, { backgroundColor: palette.surfaceElevated }]}
          accessibilityLabel="iOS due date picker">
          <DateTimePicker
            mode={mode === 'time' ? 'time' : 'datetime'}
            display={mode === 'time' ? 'spinner' : 'default'}
            value={defaultDate}
            minuteInterval={1}
            minimumDate={minimumDate}
            onChange={handleChange}
          />
          <View style={styles.iosPickerActions}>
            <Pressable onPress={closeIosPicker} style={styles.doneButton}
              accessibilityRole="button"
              accessibilityLabel="Close due date picker">
              <Text style={[styles.doneText, { color: palette.primary }]}>Done</Text>
            </Pressable>
            <Pressable onPress={handleClear}
              accessibilityRole="button"
              accessibilityLabel="Remove due date"
              style={styles.doneButton}>
              <Text style={[styles.doneText, { color: palette.danger }]}>Remove</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {Platform.OS === 'web' && (
        <WebDueDatePicker
          visible={webPickerVisible}
          onClose={() => setWebPickerVisible(false)}
          onSave={(next) => {
            if (applyDueDate(next)) {
              setWebPickerVisible(false);
            }
          }}
          initialDate={defaultDate}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  label: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.smPlus,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + SPACING.xxs,
    paddingVertical: SELECTOR_VERTICAL_PADDING,
    paddingHorizontal: SELECTOR_HORIZONTAL_PADDING,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  selectorText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + SPACING.xxs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: CLEAR_BUTTON_HORIZONTAL_PADDING,
    borderRadius: RADIUS.md,
  },
  clearText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  errorText: {
    ...TYPOGRAPHY.bodySmall,
  },
  iosPickerContainer: {
    borderRadius: RADIUS.lg,
    marginTop: SPACING.smPlus,
    overflow: 'hidden',
  },
  iosPickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.smPlus,
  },
  doneButton: {
    padding: SPACING.xs,
  },
  doneText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
});

export default DueDateField;

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

export const DueDateField = ({ value, onChange, label = 'Due date', mode = 'datetime' }: DueDateFieldProps) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const [iosPickerVisible, setIosPickerVisible] = useState(false);
  const [webPickerVisible, setWebPickerVisible] = useState(false);

  const displayValue = useMemo(() => {
    if (!value) {
      return 'Add due date';
    }

    const options = getDisplayOptions(mode);
    return formatDateTime(value, options);
  }, [mode, value]);

  const defaultDate = useMemo(() => roundToMinute(value ?? new Date()), [value]);

  const setDueDate = useCallback(
    (next: Date | null) => {
      if (next) {
        onChange(roundToMinute(next));
      } else {
        onChange(null);
      }
    },
    [onChange],
  );

  const closeIosPicker = useCallback(() => {
    setIosPickerVisible(false);
  }, []);

  const handleChange = useCallback(
    (_event: DateTimePickerEvent, selectedDate?: Date) => {
      if (selectedDate) {
        setDueDate(selectedDate);
      }
    },
    [setDueDate],
  );

  const handleOpenPicker = useCallback(() => {
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
            setDueDate(combined);
          },
        });
      };

      DateTimePickerAndroid.open({
        mode: 'date',
        value: defaultDate,
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
  }, [defaultDate, setDueDate]);

  const handleClear = useCallback(() => {
    setDueDate(null);
    setIosPickerVisible(false);
    setWebPickerVisible(false);
  }, [setDueDate]);

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

      {Platform.OS === 'ios' && iosPickerVisible ? (
        <View style={[styles.iosPickerContainer, { backgroundColor: palette.surfaceElevated }]}
          accessibilityLabel="iOS due date picker">
          <DateTimePicker
            mode={mode === 'time' ? 'time' : 'datetime'}
            display={mode === 'time' ? 'spinner' : 'default'}
            value={defaultDate}
            minuteInterval={1}
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
          onSave={setDueDate}
          initialDate={defaultDate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectorText: {
    fontSize: 15,
    fontWeight: '600',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
  },
  iosPickerContainer: {
    borderRadius: 16,
    marginTop: 12,
    overflow: 'hidden',
  },
  iosPickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  doneButton: {
    padding: 4,
  },
  doneText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default DueDateField;

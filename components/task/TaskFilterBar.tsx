import { MaterialCommunityIcons } from '@expo/vector-icons';
import { memo } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import Colors from '@/constants/Colors';
import { BREAKPOINTS, RADIUS, SPACING, TYPOGRAPHY } from '@/constants/Layout';
import { useTheme } from '@/hooks/useTheme';

export type TaskStatusFilter = 'all' | 'active' | 'completed';

export interface TaskFilterBarProps {
  filter: TaskStatusFilter;
  counts: Record<TaskStatusFilter, number>;
  onFilterChange: (value: TaskStatusFilter) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onClearSearch: () => void;
}

const FILTER_OPTIONS: Array<{ value: TaskStatusFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

const TaskFilterBarComponent = ({
  filter,
  counts,
  onFilterChange,
  searchQuery,
  onSearchQueryChange,
  onClearSearch,
}: TaskFilterBarProps) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const { width } = useWindowDimensions();
  const isTabletUp = width >= BREAKPOINTS.tablet;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.surfaceElevated,
          borderColor: palette.border,
        },
      ]}
      accessibilityRole="toolbar"
      accessibilityLabel="Task filters and search"
    >
      <View
        style={[
          styles.searchContainer,
          {
            borderColor: palette.border,
            backgroundColor: palette.surface,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={palette.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          value={searchQuery}
          onChangeText={onSearchQueryChange}
          placeholder="Search tasks..."
          placeholderTextColor={palette.textMuted}
          style={[styles.searchInput, { color: palette.text }]}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : 'never'}
          accessibilityLabel="Search tasks by title or description"
        />
        {searchQuery.trim().length > 0 ? (
          <Pressable
            onPress={onClearSearch}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={12}
            style={({ pressed }) => [
              styles.clearButton,
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <MaterialCommunityIcons name="close-circle" size={20} color={palette.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <View
        style={[
          styles.filtersRow,
          isTabletUp ? styles.filtersRowTablet : undefined,
        ]}
      >
        {FILTER_OPTIONS.map(({ value, label }) => {
          const isActive = filter === value;
          const count = counts[value] ?? 0;

          return (
            <Pressable
              key={value}
              onPress={() => onFilterChange(value)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${label} tasks`}
              style={({ pressed }) => [
                styles.filterButton,
                {
                  backgroundColor: isActive ? palette.primary : palette.surface,
                  borderColor: isActive ? palette.primary : palette.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  {
                    color: isActive ? palette.background : palette.text,
                  },
                ]}
              >
                {label} {count}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? SPACING.smPlus : SPACING.sm,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    padding: 0,
    minHeight: 20,
  },
  clearButton: {
    marginLeft: SPACING.xs,
    padding: SPACING.xs,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  filtersRowTablet: {
    justifyContent: 'flex-start',
  },
  filterButton: {
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minWidth: 60,
    alignItems: 'center',
  },
  filterLabel: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
});

export const TaskFilterBar = memo(TaskFilterBarComponent);

export default TaskFilterBar;

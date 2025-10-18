import { Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import { Button } from '@/components/common/Button';
import Colors from '@/constants/Colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '@/constants/Layout';
import { useTheme } from '@/hooks/useTheme';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  visible,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const { theme } = useTheme();
  const palette = Colors[theme];

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
      statusBarTranslucent
      supportedOrientations={['portrait', 'portrait-upside-down', 'landscape']}>
      <TouchableWithoutFeedback onPress={onCancel} accessibilityRole="button" accessibilityLabel="Dismiss dialog">
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={() => undefined} accessible={false}>
            <View
              style={[styles.card, { backgroundColor: palette.surfaceElevated }]}
              accessibilityViewIsModal
              accessibilityLiveRegion="polite">
              <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
              <Text style={[styles.message, { color: palette.textMuted }]}>{message}</Text>
              <View style={styles.actions}>
                <Button
                  label={cancelLabel}
                  variant="ghost"
                  onPress={onCancel}
                  accessibilityLabel={`${cancelLabel} deletion`}
                />
                <Button
                  label={confirmLabel}
                  variant="primary"
                  onPress={onConfirm}
                  accessibilityLabel={`${confirmLabel} task`}
                  style={{ backgroundColor: palette.danger }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  card: {
    width: '100%',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  title: {
    ...TYPOGRAPHY.titleMd,
    marginBottom: SPACING.sm,
  },
  message: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },
});

export default ConfirmDialog;

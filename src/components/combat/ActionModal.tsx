/**
 * ActionModal - Secondary combat actions modal
 * Clean modal for Observe, Taunt, Item, Skill, Flee
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, BorderRadius, BorderWidth } from '../../constants/Spacing';
import { CeremonialDivider } from '../ui/CeremonialDivider';

export interface ActionOption {
  id: string;
  label: string;
  icon?: string;
  description?: string;
  disabled?: boolean;
  disabledReason?: string;
  badge?: string;
  variant?: 'default' | 'danger' | 'muted';
}

export interface ActionModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  actions: ActionOption[];
  onSelectAction: (actionId: string) => void;
}

export function ActionModal({
  visible,
  onClose,
  title = 'Actions',
  actions,
  onSelectAction,
}: ActionModalProps) {
  const handleAction = (action: ActionOption) => {
    if (action.disabled) return;
    onSelectAction(action.id);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.content}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>

          <CeremonialDivider variant="thin" spacing="sm" />

          {/* Actions */}
          <View style={styles.actionsContainer}>
            {actions.map((action, index) => (
              <Pressable
                key={action.id}
                style={[
                  styles.actionButton,
                  action.disabled && styles.actionDisabled,
                  action.variant === 'danger' && styles.actionDanger,
                  action.variant === 'muted' && styles.actionMuted,
                  index === 0 && styles.actionFirst,
                  index === actions.length - 1 && styles.actionLast,
                ]}
                onPress={() => handleAction(action)}
                disabled={action.disabled}
              >
                <View style={styles.actionContent}>
                  {action.icon && (
                    <Text style={styles.actionIcon}>{action.icon}</Text>
                  )}
                  <View style={styles.actionText}>
                    <View style={styles.actionHeader}>
                      <Text
                        style={[
                          styles.actionLabel,
                          action.disabled && styles.actionLabelDisabled,
                          action.variant === 'danger' && styles.actionLabelDanger,
                          action.variant === 'muted' && styles.actionLabelMuted,
                        ]}
                      >
                        {action.label}
                      </Text>
                      {action.badge && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{action.badge}</Text>
                        </View>
                      )}
                    </View>
                    {action.description && (
                      <Text style={styles.actionDescription}>
                        {action.description}
                      </Text>
                    )}
                    {action.disabled && action.disabledReason && (
                      <Text style={styles.disabledReason}>
                        {action.disabledReason}
                      </Text>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Cancel */}
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  content: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    width: '100%',
    maxWidth: 340,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
    overflow: 'hidden',
  },
  header: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'center',
  },
  title: {
    ...Typography.h5,
    color: Colors.text.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  actionsContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  actionButton: {
    backgroundColor: Colors.background.tertiary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginVertical: 3,
  },
  actionFirst: {
    borderTopLeftRadius: BorderRadius.md,
    borderTopRightRadius: BorderRadius.md,
  },
  actionLast: {
    borderBottomLeftRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
  },
  actionDisabled: {
    opacity: 0.5,
  },
  actionDanger: {
    backgroundColor: Colors.ui.error + '15',
  },
  actionMuted: {
    backgroundColor: Colors.background.primary,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  actionIcon: {
    fontSize: 24,
    width: 32,
    textAlign: 'center',
  },
  actionText: {
    flex: 1,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionLabel: {
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  actionLabelDisabled: {
    color: Colors.text.muted,
  },
  actionLabelDanger: {
    color: Colors.ui.error,
  },
  actionLabelMuted: {
    color: Colors.text.secondary,
  },
  actionDescription: {
    ...Typography.caption,
    color: Colors.text.muted,
    marginTop: 2,
  },
  disabledReason: {
    ...Typography.caption,
    color: Colors.ui.error,
    marginTop: 2,
    fontStyle: 'italic',
  },
  badge: {
    backgroundColor: Colors.text.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.background.primary,
    fontWeight: '600',
  },
  cancelButton: {
    padding: Spacing.lg,
    alignItems: 'center',
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  cancelText: {
    ...Typography.body,
    color: Colors.text.muted,
  },
});

export default ActionModal;

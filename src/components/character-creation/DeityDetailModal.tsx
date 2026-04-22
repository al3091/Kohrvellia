/**
 * Shared Deity Detail Modal
 * Used by both PantheonScreen and DeityListScreen.
 * Shows: domain icon, name/title, domain badge, description (2 sentences max),
 * blessing box with inline stats, unique ability. No lore section.
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, Padding, BorderRadius } from '../../constants/Spacing';
import { Button } from '../ui';
import { DomainIcon } from '../icons/DomainIcon';
import type { Deity } from '../../types/Deity';
import { DOMAIN_EFFECTS } from '../../types/Deity';

type DomainType = keyof typeof Colors.domain;

interface DeityDetailModalProps {
  deity: Deity | null;
  visible: boolean;
  onClose: () => void;
  onSelect: (deityId: string) => void;
}

function getDomainColor(domain: string): string {
  const domainColors: Record<string, string> = Colors.domain;
  return domainColors[domain] || Colors.text.secondary;
}

function formatDomain(domain: string): string {
  return domain.charAt(0).toUpperCase() + domain.slice(1);
}

export function DeityDetailModal({ deity, visible, onClose, onSelect }: DeityDetailModalProps) {
  const handleSelect = () => {
    if (!deity) return;
    onSelect(deity.id);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.modalSafeArea} edges={['bottom']}>
            <View style={styles.modalHeader}>
              <Pressable
                onPress={onClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            {deity && (
              <>
                <ScrollView
                  style={styles.modalScroll}
                  contentContainerStyle={styles.modalScrollContent}
                  showsVerticalScrollIndicator={true}
                  bounces={true}
                >
                  {/* Name + icon row */}
                  <View style={styles.detailHeader}>
                    <DomainIcon
                      domain={deity.domain as DomainType}
                      size={32}
                      color={getDomainColor(deity.domain)}
                    />
                    <View style={styles.headerTextContainer}>
                      <Text style={styles.detailName}>{deity.name}</Text>
                      <Text style={styles.detailTitle}>{deity.title}</Text>
                    </View>
                  </View>

                  {/* Domain badge */}
                  <View style={styles.detailBadgeRow}>
                    <View style={[
                      styles.detailDomainBadge,
                      { backgroundColor: getDomainColor(deity.domain) + '20' }
                    ]}>
                      <Text style={[
                        styles.detailDomainText,
                        { color: getDomainColor(deity.domain) }
                      ]}>
                        {formatDomain(deity.domain)}
                      </Text>
                    </View>
                    <View style={styles.detailPersonalityBadge}>
                      <Text style={styles.detailPersonalityText}>
                        {formatDomain(deity.personality)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.detailDescription}>{deity.description}</Text>

                  {/* Blessing box */}
                  <View style={[
                    styles.detailBlessingBox,
                    { borderColor: getDomainColor(deity.domain) + '50' }
                  ]}>
                    <Text style={styles.detailBlessingLabel}>DOMAIN BLESSING</Text>
                    <Text style={[
                      styles.detailBlessingEffect,
                      { color: getDomainColor(deity.domain) }
                    ]}>
                      {DOMAIN_EFFECTS[deity.domain as keyof typeof DOMAIN_EFFECTS]?.primaryEffect || deity.domainBlessing.description}
                    </Text>
                    {DOMAIN_EFFECTS[deity.domain as keyof typeof DOMAIN_EFFECTS]?.secondaryEffect && (
                      <Text style={styles.detailBlessingSecondary}>
                        {DOMAIN_EFFECTS[deity.domain as keyof typeof DOMAIN_EFFECTS].secondaryEffect}
                      </Text>
                    )}
                    <View style={styles.inlineStats}>
                      <Text style={styles.inlineStatBonus}>
                        +{deity.statBonus.value} {deity.statBonus.stat}
                      </Text>
                      <Text style={styles.inlineStatDivider}>•</Text>
                      <Text style={styles.inlineStatPenalty}>
                        -{deity.statPenalty.value} {deity.statPenalty.stat}
                      </Text>
                    </View>
                  </View>

                  {/* Unique ability */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>UNIQUE ABILITY</Text>
                    <View style={styles.abilityCard}>
                      <Text style={styles.detailAbilityName}>
                        {deity.uniqueAbility.name}
                      </Text>
                      <Text style={styles.detailAbilityDesc}>
                        {deity.uniqueAbility.description}
                      </Text>
                      <View style={styles.abilityUnlockRow}>
                        <Text style={styles.abilityUnlockText}>
                          Unlocks at {deity.uniqueAbility.unlockFavor}% Favor
                        </Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>

                <View style={styles.modalFooter}>
                  <Button
                    label={`Choose ${deity.name}`}
                    onPress={handleSelect}
                    hapticStyle="heavy"
                    fullWidth
                  />
                </View>
              </>
            )}
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.background.overlay,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: Colors.background.card,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    maxHeight: '85%',
    minHeight: '50%',
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 18,
  },
  closeText: {
    color: Colors.text.muted,
    fontSize: 18,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: Padding.modal.horizontal,
    paddingBottom: Spacing.md,
  },
  modalFooter: {
    paddingHorizontal: Padding.modal.horizontal,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
    backgroundColor: Colors.background.card,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  detailName: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  detailTitle: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  detailBadgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  detailDomainBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  detailDomainText: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailPersonalityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background.secondary,
  },
  detailPersonalityText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  detailDescription: {
    ...Typography.body,
    marginTop: Spacing.md,
    lineHeight: 22,
  },
  detailBlessingBox: {
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  detailBlessingLabel: {
    ...Typography.label,
    fontSize: 10,
    color: Colors.text.muted,
    marginBottom: Spacing.xs,
  },
  detailBlessingEffect: {
    ...Typography.h6,
    textAlign: 'center',
  },
  detailBlessingSecondary: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  inlineStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  inlineStatBonus: {
    ...Typography.bodySmall,
    color: Colors.ui.success,
    fontWeight: '600',
  },
  inlineStatDivider: {
    color: Colors.text.muted,
    fontSize: 12,
  },
  inlineStatPenalty: {
    ...Typography.bodySmall,
    color: Colors.ui.error,
    fontWeight: '600',
  },
  detailSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
  },
  detailSectionTitle: {
    ...Typography.label,
    color: Colors.text.muted,
    marginBottom: Spacing.sm,
  },
  abilityCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  detailAbilityName: {
    ...Typography.h6,
    color: Colors.text.accent,
    marginBottom: Spacing.xs,
  },
  detailAbilityDesc: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  abilityUnlockRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
    paddingTop: Spacing.sm,
  },
  abilityUnlockText: {
    ...Typography.caption,
    color: Colors.text.muted,
  },
});

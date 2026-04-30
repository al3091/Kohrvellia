/**
 * Dungeon Floor Map Screen
 * Slay the Spire-style vertical branching path map
 */

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Animated, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { Typography } from '../../src/constants/Typography';
import { Spacing, Padding, BorderRadius, BorderWidth } from '../../src/constants/Spacing';
import { useDungeonStore } from '../../src/stores/useDungeonStore';
import { useCharacterStore } from '../../src/stores/useCharacterStore';
import { useDeityStore } from '../../src/stores/useDeityStore';
import { useHaptics } from '../../src/hooks/useHaptics';
import { getNodeIcon, getNodeDisplayName } from '../../src/types/Dungeon';
import type { MapNode, NodeType } from '../../src/types/Dungeon';
import { useSoundStore } from '../../src/stores/useSoundStore';
import { useShopStore } from '../../src/stores/useShopStore';
import { useAchievementStore } from '../../src/stores/useAchievementStore';

// Node type colors
const NODE_COLORS: Record<NodeType, string> = {
  start: Colors.ui.info,
  combat: Colors.ui.error,
  elite: Colors.danger.deadly,
  treasure: Colors.resource.gold,
  event: '#5B8DD9',
  rest: Colors.domain.life,
  shop: '#3A8050',
  shrine: '#9A6898',
  mystery: Colors.text.muted,
  boss: '#8B0000',
};

// Node descriptions for tooltips
const NODE_DESCRIPTIONS: Record<NodeType, { short: string; hint: string }> = {
  start: { short: 'Entrance', hint: 'Safe zone. You can exit here.' },
  combat: { short: 'Monster', hint: 'Fight enemies. Gain Excelia and loot.' },
  elite: { short: 'Elite', hint: 'Powerful enemy. Better rewards but risky.' },
  treasure: { short: 'Treasure', hint: 'May contain traps. Check carefully!' },
  event: { short: 'Event', hint: 'Random encounter. Stat checks possible.' },
  rest: { short: 'Campfire', hint: 'Restore HP/SP. Requires rations for full effect.' },
  shop: { short: 'Merchant', hint: 'Buy supplies if you have gold.' },
  shrine: { short: 'Shrine', hint: 'Receive divine blessings.' },
  mystery: { short: '???', hint: 'Unknown. Could be anything.' },
  boss: { short: 'Floor Boss', hint: 'Defeat to descend deeper.' },
};

const BIOME_GRADIENT_COLORS: Record<string, [string, string]> = {
  ruins: ['#1A0F0A', '#0F0A08'],
  frozen: ['#0A101A', '#08080F'],
  forest: ['#0A1408', '#080F08'],
  desert: ['#1A130A', '#0F0C08'],
  jungle: ['#081408', '#080F08'],
  swamp: ['#0A100A', '#080C08'],
  volcanic: ['#1A0808', '#0F0808'],
  void: ['#080608', '#050405'],
  dreamscape: ['#10080F', '#08080A'],
  cavern: ['#0F0C0A', '#08080A'],
  labyrinth: ['#0C0C0C', '#080808'],
};

export default function FloorScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { character, modifyHP, modifySatiation } = useCharacterStore();
  const {
    currentRun,
    getCurrentMap,
    getCurrentNode,
    getCurrentPathOptions,
    moveToNode,
    canDescend,
    canExitDungeon,
    canAscendFloor,
    enterFloor,
    ascendFloor,
    endRun,
    lastRamifications,
    clearRamifications,
  } = useDungeonStore();

  const { relationship, getPatronDeity } = useDeityStore();
  const activeChallenge = relationship?.currentChallenge ?? null;
  const activeChallengeDeity = getPatronDeity();
  const activeChallengeData = activeChallenge && activeChallengeDeity
    ? activeChallengeDeity.challenges.find((c) => c.id === activeChallenge.challengeId) ?? null
    : null;

  const map = getCurrentMap();
  const currentNode = getCurrentNode();
  const pathOptions = getCurrentPathOptions();

  const rationCount = character?.inventory.find(i => i.id === 'ration')?.quantity ?? 0;
  const satiation = character?.satiation ?? 60;
  const satiationDots = Math.round((satiation / 100) * 6);
  const hungerState = satiation >= 80 ? 'well' : satiation >= 60 ? 'adequate' : satiation >= 40 ? 'hungry' : satiation >= 20 ? 'starving' : 'famine';

  // Path preview state - shows which node is being considered
  const [previewNodeId, setPreviewNodeId] = useState<string | null>(null);

  // Tooltip state - shows node info on long-press
  const [tooltipNode, setTooltipNode] = useState<MapNode | null>(null);

  // Pulse animation for selectable nodes
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Auto-scroll to current node
  const scrollViewRef = useRef<ScrollView>(null);
  const nodePositions = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (!map?.currentNodeId || !scrollViewRef.current) return;
    const yPos = nodePositions.current.get(map.currentNodeId);
    if (yPos !== undefined) {
      scrollViewRef.current.scrollTo({ y: Math.max(0, yPos - 200), animated: true });
    }
  }, [map?.currentNodeId]);

  // Start pulse animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Play dungeon BGM on mount
  useEffect(() => {
    useSoundStore.getState().playBGM('dungeon');
  }, []);

  // Organize nodes by row for vertical display
  const rowData = useMemo(() => {
    if (!map) return [];

    const rows: Map<number, MapNode[]> = new Map();

    for (const node of map.nodes) {
      if (!rows.has(node.row)) {
        rows.set(node.row, []);
      }
      rows.get(node.row)!.push(node);
    }

    // Sort each row by column
    for (const [, nodes] of rows) {
      nodes.sort((a, b) => a.column - b.column);
    }

    // Get max row number
    const maxRow = Math.max(...map.nodes.map(n => n.row));

    // Return rows in reverse order (boss at top, start at bottom)
    const result: { row: number; nodes: MapNode[] }[] = [];
    for (let r = maxRow; r >= 0; r--) {
      result.push({ row: r, nodes: rows.get(r) ?? [] });
    }

    return result;
  }, [map]);

  // Check if a node is a valid path option from current position
  const isPathOption = (nodeId: string) => {
    return pathOptions.some(n => n.id === nodeId);
  };

  // Three-state fog of war
  function getNodeRevealState(node: MapNode, cur: MapNode | null): 'revealed' | 'glimpsed' | 'shrouded' {
    if (!cur) return node.isRevealed ? 'revealed' : 'shrouded';
    if (node.isCompleted || node.isCurrent) return 'revealed';
    if (node.isRevealed) return 'revealed';
    const rowDiff = node.row - cur.row;
    if (rowDiff <= 2 && rowDiff >= -1) return 'glimpsed';
    return 'shrouded';
  }

  // Handle long press for tooltip
  const handleNodeLongPress = (node: MapNode, _event: any) => {
    if (!node.isRevealed) return;
    haptics.light();
    setTooltipNode(node);
  };

  // Handle press in on node for path preview
  const handleNodePressIn = (node: MapNode) => {
    if (isPathOption(node.id)) {
      setPreviewNodeId(node.id);
    }
  };

  // Handle press out to clear preview
  const handleNodePressOut = () => {
    setPreviewNodeId(null);
  };

  // Check if a connection should be highlighted in preview
  const isConnectionInPreview = (fromId: string, toId: string) => {
    if (!previewNodeId || !currentNode) return false;
    // Highlight connection from current node to preview node
    return fromId === currentNode.id && toId === previewNodeId;
  };

  const handleNodePress = (node: MapNode) => {
    if (!currentNode) return;

    // Clear preview
    setPreviewNodeId(null);

    // Can only move to path options
    if (!isPathOption(node.id)) {
      haptics.warning();
      return;
    }

    haptics.medium();

    // Move to the node (this triggers ramifications)
    moveToNode(node.id);

    // Satiation decays on each step
    modifySatiation(-5);

    // Starvation damage on every step when famine
    if (hungerState === 'famine' && Math.random() < 0.3) {
      modifyHP(-8);
    }

    // Navigate to travel screen to show ramifications
    router.push('/dungeon/travel');
  };

  const handleDescend = () => {
    if (!map || !canDescend()) return;

    haptics.heavy();

    // Generate next floor
    const newFloor = map.floorNumber + 1;
    enterFloor(newFloor);
    useAchievementStore.getState().updateProgress('floor_reach', newFloor);

    // Decrement challenge floor countdown — auto-fails if time runs out
    useDeityStore.getState().checkChallengeExpiry(newFloor);
  };

  const handleExitToTown = () => {
    if (!canExitDungeon()) {
      haptics.warning();
      Alert.alert(
        'Cannot Exit',
        currentRun && currentRun.currentFloor > 1
          ? 'You must return to Floor 1 entrance to exit the dungeon.'
          : 'You must be at the dungeon entrance to exit.',
        [{ text: 'OK' }]
      );
      return;
    }

    haptics.medium();
    Alert.alert(
      'Exit Dungeon',
      'Are you sure you want to leave? Your progress will be saved.',
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Exit',
          onPress: () => {
            endRun('return');
            useShopStore.getState().resetSessionCounts();
            router.replace('/town');
          },
        },
      ]
    );
  };

  const handleAscendFloor = () => {
    if (!canAscendFloor() || !map) return;

    haptics.medium();
    Alert.alert(
      'Ascend Floor',
      `Return to Floor ${map.floorNumber - 1}? A new path will be generated.`,
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Ascend',
          onPress: () => {
            ascendFloor();
          },
        },
      ]
    );
  };

  const handleCurrentNodeAction = () => {
    if (!currentNode) return;

    haptics.medium();

    // Clear any pending ramifications first
    if (lastRamifications) {
      clearRamifications();
    }

    // Navigate to room interaction based on node type
    router.replace('/dungeon/room');
  };

  if (!map || !currentRun || !character) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No active dungeon run</Text>
          <Pressable style={styles.returnButton} onPress={() => router.replace('/')}>
            <Text style={styles.returnButtonText}>Return to Title</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.floorNumber}>Floor {map.floorNumber}</Text>
          <Text style={styles.biomeName}>{map.biomeName}</Text>
        </View>
      </View>

      {/* Character Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>HP</Text>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.barFill,
                styles.hpBar,
                { width: `${(character.currentHP / character.maxHP) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.statusValue}>
            {character.currentHP}/{character.maxHP}
          </Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>SP</Text>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.barFill,
                styles.spBar,
                { width: `${(character.currentSP / character.maxSP) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.statusValue}>
            {character.currentSP}/{character.maxSP}
          </Text>
        </View>
      </View>

      {/* Provisions Strip */}
      <View style={styles.provisionsRow}>
        <Text style={styles.provisionsLabel}>Hunger</Text>
        <View style={styles.provisionsDots}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.provisionDot,
                i < satiationDots
                  ? (satiation <= 20 ? styles.provisionDotCritical : satiation <= 40 ? styles.provisionDotLow : styles.provisionDotFull)
                  : styles.provisionDotEmpty,
              ]}
            />
          ))}
        </View>
        <Text style={styles.provisionsRationCount}>{rationCount}R</Text>
        {hungerState === 'famine' && (
          <Text style={styles.hungerTextFamine}>STARVING</Text>
        )}
        {(hungerState === 'hungry' || hungerState === 'starving') && (
          <Text style={styles.hungerTextHungry}>Hungry</Text>
        )}
      </View>

      {/* Active Challenge Strip */}
      {activeChallenge && activeChallengeData && (
        <View style={styles.challengeStrip}>
          <Text style={styles.challengeStripName} numberOfLines={1}>
            {activeChallengeData.name}
          </Text>
          <Text style={styles.challengeStripProgress}>
            {activeChallenge.progress}/{activeChallengeData.requirement.value}
          </Text>
          {activeChallenge.floorsRemaining !== undefined && (
            <Text style={[
              styles.challengeStripFloors,
              activeChallenge.floorsRemaining <= 1 && styles.challengeStripFloorsDanger,
            ]}>
              {activeChallenge.floorsRemaining}F
            </Text>
          )}
        </View>
      )}

      {/* Vertical Node Map */}
      <View style={styles.mapContainer}>
        <View style={[
          styles.biomeOverlay,
          { backgroundColor: BIOME_GRADIENT_COLORS[map.biome]?.[0] ?? '#080608' }
        ]} />
        <Text style={styles.mapTitle}>CHOOSE YOUR PATH</Text>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mapScroll}
        >
          {rowData.map(({ row, nodes }, rowIndex) => {
            // Get the next row's nodes for connection calculation
            const nextRowData = rowData[rowIndex + 1];
            const nextRowNodes = nextRowData?.nodes ?? [];

            // Calculate node spacing: node width + gap
            const nodeWidth = 80;
            const nodeGap = Spacing.xl;
            const nodeSpacing = nodeWidth + nodeGap;

            return (
            <View
              key={row}
              style={styles.mapRow}
              onLayout={nodes.some(n => n.isCurrent) ? (e) => {
                const currentInRow = nodes.find(n => n.isCurrent);
                if (currentInRow) nodePositions.current.set(currentInRow.id, e.nativeEvent.layout.y);
              } : undefined}
            >
              {/* Connection lines to next row */}
              {nodes.map((node, sourceIndex) => {
                // Find connections going down (to lower row numbers)
                const downConnections = map.connections.filter(
                  c => c.fromId === node.id
                );

                return downConnections.map((conn) => {
                  const targetNode = map.nodes.find(n => n.id === conn.toId);
                  if (!targetNode) return null;

                  // Only draw if target is in next row
                  if (targetNode.row !== row - 1) return null;

                  // Find target node's index in next row
                  const targetIndex = nextRowNodes.findIndex(n => n.id === targetNode.id);
                  if (targetIndex === -1) return null;

                  // Calculate horizontal offset based on node positions
                  // Each row is centered, so we calculate offset from row center
                  // Position from center of each row
                  const sourceOffset = (sourceIndex - (nodes.length - 1) / 2) * nodeSpacing;
                  const targetOffset = (targetIndex - (nextRowNodes.length - 1) / 2) * nodeSpacing;

                  // Horizontal difference
                  const horizontalDiff = targetOffset - sourceOffset;

                  // Calculate line angle
                  const lineHeight = 50; // Vertical distance between rows
                  const lineLength = Math.sqrt(horizontalDiff * horizontalDiff + lineHeight * lineHeight);
                  const angleRad = Math.atan2(horizontalDiff, lineHeight);
                  const angleDeg = angleRad * (180 / Math.PI);

                  const isRevealed = node.isRevealed && targetNode.isRevealed;
                  const isPreview = isConnectionInPreview(node.id, targetNode.id);
                  const isNavigable = isPathOption(node.id) || node.isCurrent;

                  return (
                    <Animated.View
                      key={`${conn.fromId}-${conn.toId}`}
                      style={[
                        styles.connectionLine,
                        isRevealed && isNavigable ? styles.connectionLineActive :
                        isRevealed ? styles.connectionLineVisible : styles.connectionLineHidden,
                        isPreview && styles.connectionLinePreview,
                        {
                          height: lineLength,
                          left: '50%',
                          marginLeft: sourceOffset - 1.5,
                          transform: [
                            { translateY: lineLength / 2 },
                            { rotate: `${angleDeg}deg` },
                            { translateY: -(lineLength / 2) },
                          ],
                        },
                      ]}
                    />
                  );
                });
              })}

              {/* Nodes in this row */}
              <View style={styles.nodeRow}>
                {nodes.map(node => {
                  const isCurrent = node.isCurrent;
                  const isOption = isPathOption(node.id);
                  const isPreview = previewNodeId === node.id;
                  const nodeColor = NODE_COLORS[node.type];
                  const revealState = getNodeRevealState(node, currentNode);

                  if (revealState === 'shrouded') return null;

                  // Use animated wrapper for selectable nodes
                  const NodeWrapper = isOption ? Animated.View : View;
                  const animStyle = isOption ? { transform: [{ scale: pulseAnim }] } : {};

                  return (
                    <Pressable
                      key={node.id}
                      style={[
                        styles.nodeContainer,
                        isCurrent && styles.nodeContainerCurrent,
                        isOption && styles.nodeContainerOption,
                        isPreview && styles.nodeContainerPreview,
                        revealState === 'glimpsed' && styles.nodeContainerGlimpsed,
                        node.isCompleted && styles.nodeContainerCompleted,
                      ]}
                      onPress={() => handleNodePress(node)}
                      onPressIn={() => handleNodePressIn(node)}
                      onPressOut={handleNodePressOut}
                      onLongPress={(e) => handleNodeLongPress(node, e)}
                      delayLongPress={400}
                      disabled={!isOption && revealState !== 'revealed'}
                    >
                      {/* Node circle with pulse animation for options */}
                      <NodeWrapper style={animStyle}>
                        <View
                          style={[
                            styles.nodeCircle,
                            { borderColor: revealState === 'revealed' ? nodeColor : Colors.border.secondary },
                            node.type === 'boss' && styles.nodeCircleBoss,
                            isCurrent && styles.nodeCircleCurrent,
                            isPreview && styles.nodeCirclePreview,
                            node.isCompleted && styles.nodeCircleCompleted,
                          ]}
                        >
                          {revealState === 'revealed' ? (
                            <Text style={styles.nodeIcon}>{getNodeIcon(node.type)}</Text>
                          ) : (
                            <Text style={styles.nodeIconHidden}>?</Text>
                          )}
                        </View>
                      </NodeWrapper>

                      {/* Node label */}
                      {revealState === 'revealed' && (
                        <Text
                          style={[
                            styles.nodeLabel,
                            { color: node.isCompleted ? Colors.text.muted : nodeColor },
                            isPreview && styles.nodeLabelPreview,
                          ]}
                        >
                          {getNodeDisplayName(node.type)}
                        </Text>
                      )}

                      {/* Current indicator */}
                      {isCurrent && (
                        <View style={styles.currentBadge}>
                          <Text style={styles.currentBadgeText}>YOU</Text>
                        </View>
                      )}

                      {/* Path option indicator */}
                      {isOption && !isCurrent && (
                        <View style={[styles.optionBadge, isPreview && styles.optionBadgePreview]}>
                          <Text style={styles.optionBadgeText}>GO</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Current Node Info */}
      {currentNode && (
        <View style={styles.currentNodeInfo}>
          <Text style={styles.currentNodeTitle}>
            {getNodeIcon(currentNode.type)} {getNodeDisplayName(currentNode.type)}
          </Text>
          <Text style={styles.currentNodeStatus}>
            {currentNode.isCompleted
              ? 'Completed'
              : getNodeStatusText(currentNode.type)}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {/* Enter current node if not completed */}
        {currentNode && !currentNode.isCompleted && currentNode.type !== 'start' && (
          <Pressable style={styles.enterNodeButton} onPress={handleCurrentNodeAction}>
            <Text style={styles.enterNodeButtonText}>
              Enter {getNodeDisplayName(currentNode.type)}
            </Text>
          </Pressable>
        )}

        {/* Descend button after boss */}
        {canDescend() && (
          <Pressable style={styles.descendButton} onPress={handleDescend}>
            <Text style={styles.descendButtonText}>
              Descend to Floor {map.floorNumber + 1}
            </Text>
          </Pressable>
        )}

        {/* Ascend button (when at entrance of Floor 2+) */}
        {canAscendFloor() && (
          <Pressable style={styles.ascendButton} onPress={handleAscendFloor}>
            <Text style={styles.ascendButtonText}>
              Ascend to Floor {map.floorNumber - 1}
            </Text>
          </Pressable>
        )}

        <View style={styles.bottomButtons}>
          <Pressable
            style={styles.inventoryButton}
            onPress={() => router.push('/dungeon/inventory')}
          >
            <Text style={styles.inventoryButtonText}>Items</Text>
          </Pressable>
          {canExitDungeon() ? (
            <Pressable style={styles.exitButton} onPress={handleExitToTown}>
              <Text style={styles.exitButtonText}>Exit</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.exitButton, styles.exitButtonDisabled]}
              onPress={handleExitToTown}
            >
              <Text style={[styles.exitButtonText, styles.exitButtonTextDisabled]}>
                Exit
              </Text>
            </Pressable>
          )}
          <Pressable style={styles.menuButton} onPress={() => router.push('/')}>
            <Text style={styles.menuButtonText}>Menu</Text>
          </Pressable>
        </View>
      </View>

      {/* Node Tooltip Modal */}
      <Modal
        visible={tooltipNode !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setTooltipNode(null)}
      >
        <Pressable
          style={styles.tooltipOverlay}
          onPress={() => setTooltipNode(null)}
        >
          {tooltipNode && (
            <View style={[
              styles.tooltipContainer,
              { borderColor: NODE_COLORS[tooltipNode.type] }
            ]}>
              <View style={styles.tooltipHeader}>
                <Text style={styles.tooltipIcon}>{getNodeIcon(tooltipNode.type)}</Text>
                <Text style={[styles.tooltipTitle, { color: NODE_COLORS[tooltipNode.type] }]}>
                  {getNodeDisplayName(tooltipNode.type)}
                </Text>
              </View>
              <Text style={styles.tooltipDescription}>
                {NODE_DESCRIPTIONS[tooltipNode.type].hint}
              </Text>
              {tooltipNode.isCompleted && (
                <Text style={styles.tooltipStatus}>Cleared</Text>
              )}
              {isPathOption(tooltipNode.id) && !tooltipNode.isCurrent && (
                <Pressable
                  style={[styles.tooltipGoButton, { backgroundColor: NODE_COLORS[tooltipNode.type] }]}
                  onPress={() => {
                    setTooltipNode(null);
                    handleNodePress(tooltipNode);
                  }}
                >
                  <Text style={styles.tooltipGoButtonText}>Go Here</Text>
                </Pressable>
              )}
              <Text style={styles.tooltipHint}>Tap anywhere to close</Text>
            </View>
          )}
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function getNodeStatusText(type: NodeType): string {
  switch (type) {
    case 'combat':
      return 'Enemies await...';
    case 'elite':
      return 'A powerful foe lurks here';
    case 'treasure':
      return 'A chest gleams in the darkness';
    case 'event':
      return 'Something awaits your attention';
    case 'shrine':
      return 'Divine energy emanates from within';
    case 'shop':
      return 'A merchant awaits';
    case 'rest':
      return 'A place to recover';
    case 'boss':
      return 'The floor guardian awaits';
    case 'mystery':
      return '???';
    default:
      return 'Explore this area';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    ...Typography.h4,
    color: Colors.text.muted,
    marginBottom: Spacing.xl,
  },
  returnButton: {
    backgroundColor: Colors.background.tertiary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  returnButtonText: {
    ...Typography.button,
    color: Colors.text.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.md,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.border.primary,
  },
  headerLeft: {},
  floorNumber: {
    ...Typography.h3,
    color: Colors.text.accent,
  },
  biomeName: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  statusBar: {
    flexDirection: 'row',
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.xs,
    gap: Spacing.md,
    backgroundColor: 'transparent',
  },
  statusItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusLabel: {
    display: 'none', // Hidden for minimal look
  },
  barContainer: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  hpBar: {
    backgroundColor: Colors.resource.hp,
  },
  spBar: {
    backgroundColor: Colors.resource.sp,
  },
  statusValue: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.text.muted,
    width: 40,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  provisionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Padding.screen.horizontal,
    paddingBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  provisionsLabel: {
    ...Typography.caption,
    fontSize: 9,
    color: Colors.text.muted,
    letterSpacing: 0.5,
    width: 60,
  },
  provisionsDots: {
    flexDirection: 'row',
    gap: 3,
  },
  provisionDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  provisionDotFull: {
    backgroundColor: '#C89030',
  },
  provisionDotLow: {
    backgroundColor: '#D4781E',
  },
  provisionDotCritical: {
    backgroundColor: '#C84832',
  },
  provisionDotEmpty: {
    backgroundColor: Colors.background.tertiary,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  hungerTextHungry: {
    ...Typography.caption,
    fontSize: 9,
    color: '#D4781E',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginLeft: Spacing.xs,
  },
  provisionsRationCount: {
    ...Typography.caption,
    fontSize: 9,
    color: Colors.text.muted,
    marginLeft: 4,
    marginRight: 2,
  },
  hungerTextFamine: {
    ...Typography.caption,
    fontSize: 9,
    color: '#C84832',
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: Spacing.xs,
  },
  mapContainer: {
    flex: 1,
    paddingTop: Spacing.md,
    backgroundColor: Colors.background.primary,
  },
  mapTitle: {
    ...Typography.label,
    color: Colors.text.accent,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  mapScroll: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  mapRow: {
    marginBottom: Spacing.xl,
    position: 'relative',
  },
  nodeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  connectionLine: {
    position: 'absolute',
    width: 1,
    backgroundColor: Colors.border.secondary,
    bottom: -20,
    zIndex: -1,
  },
  connectionLineVisible: {
    backgroundColor: '#3D2020',
    width: 1.5,
    opacity: 0.6,
  },
  connectionLineHidden: {
    backgroundColor: '#2A1618',
    opacity: 0.2,
    width: 1,
  },
  connectionLineActive: {
    backgroundColor: Colors.text.accent,
    width: 2,
    opacity: 0.8,
  },
  nodeContainer: {
    alignItems: 'center',
    width: 80,
  },
  nodeContainerCurrent: {},
  nodeContainerOption: {},
  nodeContainerPreview: {},
  nodeContainerHidden: {
    opacity: 0.3,
  },
  nodeContainerShrouded: {
    opacity: 0.15,
  },
  nodeContainerGlimpsed: {
    opacity: 0.45,
  },
  nodeContainerCompleted: {
    opacity: 0.5,
  },
  nodeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCircleBoss: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  nodeCircleCurrent: {
    backgroundColor: Colors.background.tertiary,
    borderColor: Colors.text.accent,
    borderWidth: 2,
  },
  nodeCirclePreview: {
    borderColor: Colors.ui.success,
    borderWidth: 2,
  },
  nodeCircleCompleted: {
    backgroundColor: Colors.background.primary,
    opacity: 0.7,
  },
  nodeIcon: {
    fontSize: 22,
    color: Colors.text.primary,
  },
  nodeIconHidden: {
    ...Typography.caption,
    color: Colors.text.muted,
    fontSize: 14,
  },
  nodeIconShrouded: {
    opacity: 0,
  },
  nodeLabel: {
    ...Typography.caption,
    fontSize: 11,
    marginTop: 3,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  nodeLabelPreview: {
    color: Colors.ui.success,
  },
  currentBadge: {
    position: 'absolute',
    top: -6,
    backgroundColor: Colors.text.accent,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  currentBadgeText: {
    fontSize: 7,
    color: Colors.background.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  optionBadge: {
    position: 'absolute',
    top: -6,
    backgroundColor: Colors.ui.success,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  optionBadgePreview: {
    backgroundColor: Colors.ui.success,
  },
  optionBadgeText: {
    fontSize: 7,
    color: Colors.background.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  currentNodeInfo: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.primary,
  },
  currentNodeTitle: {
    ...Typography.body,
    color: Colors.text.primary,
    fontSize: 15,
    marginBottom: 2,
  },
  currentNodeStatus: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.text.muted,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  actionContainer: {
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.border.primary,
  },
  enterNodeButton: {
    backgroundColor: Colors.background.tertiary,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  enterNodeButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text.secondary,
    letterSpacing: 1,
  },
  descendButton: {
    backgroundColor: Colors.ui.success,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  descendButtonText: {
    ...Typography.buttonSmall,
    color: Colors.background.primary,
    letterSpacing: 1,
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  inventoryButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  inventoryButtonText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    letterSpacing: 1,
  },
  ascendButton: {
    backgroundColor: 'transparent',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    marginBottom: Spacing.xs,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.ui.info,
  },
  ascendButtonText: {
    ...Typography.buttonSmall,
    color: Colors.ui.info,
    letterSpacing: 1,
  },
  exitButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.ui.success,
  },
  exitButtonDisabled: {
    borderColor: Colors.border.primary,
    opacity: 0.4,
  },
  exitButtonText: {
    ...Typography.caption,
    color: Colors.ui.success,
    letterSpacing: 1,
  },
  exitButtonTextDisabled: {
    color: Colors.text.muted,
  },
  menuButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    borderWidth: BorderWidth.thin,
    borderColor: Colors.border.primary,
  },
  menuButtonText: {
    ...Typography.caption,
    color: Colors.text.muted,
    letterSpacing: 1,
  },

  // Path Preview Styles
  connectionLinePreview: {
    backgroundColor: Colors.ui.success,
    width: 5,
    shadowColor: Colors.ui.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },

  // Tooltip Styles
  tooltipOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  tooltipContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    minWidth: 250,
    maxWidth: 300,
    borderWidth: BorderWidth.thick,
    borderColor: Colors.border.accent,
  },
  tooltipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  tooltipIcon: {
    fontSize: 32,
  },
  tooltipTitle: {
    ...Typography.h4,
  },
  tooltipDescription: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  tooltipStatus: {
    ...Typography.label,
    color: Colors.ui.success,
    marginBottom: Spacing.md,
  },
  tooltipGoButton: {
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tooltipGoButtonText: {
    ...Typography.button,
    color: Colors.text.inverse,
  },
  tooltipHint: {
    ...Typography.caption,
    color: Colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  biomeOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    opacity: 0.4,
    zIndex: -1,
  },

  // Active challenge strip
  challengeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Padding.screen.horizontal,
    paddingVertical: 4,
    backgroundColor: Colors.ui.info + '20',
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.ui.info + '40',
    gap: Spacing.sm,
  },
  challengeStripName: {
    ...Typography.caption,
    color: Colors.ui.info,
    flex: 1,
    fontWeight: '600',
  },
  challengeStripProgress: {
    ...Typography.caption,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  challengeStripFloors: {
    ...Typography.caption,
    color: Colors.text.secondary,
    minWidth: 28,
    textAlign: 'right',
  },
  challengeStripFloorsDanger: {
    color: Colors.ui.error,
    fontWeight: 'bold',
  },
});

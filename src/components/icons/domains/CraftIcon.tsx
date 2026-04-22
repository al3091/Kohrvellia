/**
 * Craft Domain Icon
 * A heavy hammer resting on a cracked, bleeding anvil
 */

import React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { Colors } from '../../../constants/Colors';

interface CraftIconProps {
  size?: number;
  color?: string;
}

export function CraftIcon({ size = 32, color = Colors.domain.craft }: CraftIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <G opacity={0.9}>
        {/* Anvil base */}
        <Path
          d="M8 28H24L22 24H10L8 28Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* Anvil body - cracked */}
        <Path
          d="M6 18H26V24H6V18Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* Anvil horn */}
        <Path
          d="M6 20L4 19L4 21L6 22"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Anvil face */}
        <Path
          d="M8 16H24V18H8V16Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* Major crack in anvil */}
        <Path
          d="M16 16L15 19L17 21L15 24"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Secondary cracks */}
        <Path
          d="M12 18L13 20M20 18L19 21"
          stroke={color}
          strokeWidth={0.75}
          strokeLinecap="round"
          opacity={0.5}
        />
        {/* Hammer - resting, exhausted */}
        <Path
          d="M20 6L22 4L26 8L24 10L20 6Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* Hammer handle */}
        <Path
          d="M20 6L12 14"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Blood/fluid dripping from crack */}
        <Path
          d="M15 24C15 25 14 26 15 27"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.6}
        />
        <Path
          d="M17 24C17 25 18 26 17 28"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />
        {/* Drip at bottom */}
        <Path
          d="M16 27C16 28 16 29 16 30"
          stroke={color}
          strokeWidth={0.75}
          strokeLinecap="round"
          opacity={0.4}
        />
      </G>
    </Svg>
  );
}

export default CraftIcon;

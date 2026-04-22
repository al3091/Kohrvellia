/**
 * Magic Domain Icon
 * Decaying hands failing to contain a tearing rift
 */

import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { Colors } from '../../../constants/Colors';

interface MagicIconProps {
  size?: number;
  color?: string;
}

export function MagicIcon({ size = 32, color = Colors.domain.magic }: MagicIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <G opacity={0.9}>
        {/* Central rift / tear */}
        <Path
          d="M16 8L14 12L18 16L14 20L16 24"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Rift energy emanating */}
        <Circle cx={16} cy={16} r={4} stroke={color} strokeWidth={1} opacity={0.3} />
        <Circle cx={16} cy={16} r={7} stroke={color} strokeWidth={0.5} opacity={0.2} />
        {/* Left hand - skeletal/decaying */}
        <Path
          d="M6 14C8 12 9 14 10 13L11 15L10 17C9 18 8 16 6 18"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.7}
        />
        {/* Left fingers reaching */}
        <Path
          d="M10 13L12 14M10 15L12 15M10 17L12 16"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />
        {/* Right hand - skeletal/decaying */}
        <Path
          d="M26 14C24 12 23 14 22 13L21 15L22 17C23 18 24 16 26 18"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.7}
        />
        {/* Right fingers reaching */}
        <Path
          d="M22 13L20 14M22 15L20 15M22 17L20 16"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />
      </G>
    </Svg>
  );
}

export default MagicIcon;

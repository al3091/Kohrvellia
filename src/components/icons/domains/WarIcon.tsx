/**
 * War Domain Icon
 * A rusted, shattered blade embedded in ash
 */

import React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { Colors } from '../../../constants/Colors';

interface WarIconProps {
  size?: number;
  color?: string;
}

export function WarIcon({ size = 32, color = Colors.domain.war }: WarIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <G opacity={0.9}>
        {/* Ash bed / ground */}
        <Path
          d="M4 26c2-1 4 0 6-1s4 1 6 0 4 0 6 1 4-1 6 0"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.4}
        />
        {/* Shattered blade - main piece */}
        <Path
          d="M16 6L18 24"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Blade edge detail */}
        <Path
          d="M14 8L16 6L18 8"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Crack in blade */}
        <Path
          d="M15 12L17 14L15 16"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.6}
        />
        {/* Shattered fragment - left */}
        <Path
          d="M10 14L12 18L11 22"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.5}
        />
        {/* Shattered fragment - right */}
        <Path
          d="M22 12L20 16L21 20"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.5}
        />
        {/* Guard/crossguard remains */}
        <Path
          d="M12 22H20"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}

export default WarIcon;

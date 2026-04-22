/**
 * Sky Domain Icon
 * A jagged spear of lightning striking a solitary, scorched peak
 */

import React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { Colors } from '../../../constants/Colors';

interface SkyIconProps {
  size?: number;
  color?: string;
}

export function SkyIcon({ size = 32, color = Colors.domain.sky }: SkyIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <G opacity={0.9}>
        {/* Lightning bolt - jagged, violent */}
        <Path
          d="M18 2L14 12H18L12 22L16 14H12L18 2Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
          fill={color}
          fillOpacity={0.2}
        />
        {/* Lightning branches */}
        <Path
          d="M14 8L10 10"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.6}
        />
        <Path
          d="M16 14L20 15"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.6}
        />
        {/* Mountain peak - scorched and solitary */}
        <Path
          d="M4 28L16 16L28 28H4Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* Scorch marks on peak */}
        <Path
          d="M14 20L16 16L18 20"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.7}
        />
        {/* Cracks from strike */}
        <Path
          d="M16 20L15 24M16 20L17 23"
          stroke={color}
          strokeWidth={0.75}
          strokeLinecap="round"
          opacity={0.5}
        />
        {/* Debris/rocks falling */}
        <Path
          d="M12 22L10 24M20 22L22 24"
          stroke={color}
          strokeWidth={0.75}
          strokeLinecap="round"
          opacity={0.4}
        />
        {/* Impact glow */}
        <Path
          d="M14 18C14 17 15 16 16 16C17 16 18 17 18 18"
          stroke={color}
          strokeWidth={0.5}
          strokeLinecap="round"
          opacity={0.3}
        />
        {/* Storm clouds hint */}
        <Path
          d="M6 4C8 3 10 4 12 3"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.3}
        />
        <Path
          d="M20 4C22 3 24 4 26 3"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.3}
        />
      </G>
    </Svg>
  );
}

export default SkyIcon;

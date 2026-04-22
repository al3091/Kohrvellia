/**
 * Life Domain Icon
 * A beating heart bound tightly by suffocating, thorny wire
 */

import React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { Colors } from '../../../constants/Colors';

interface LifeIconProps {
  size?: number;
  color?: string;
}

export function LifeIcon({ size = 32, color = Colors.domain.life }: LifeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <G opacity={0.9}>
        {/* Heart shape - anatomical style */}
        <Path
          d="M16 28L6 18C4 16 4 12 6 10C8 8 12 8 14 10L16 12L18 10C20 8 24 8 26 10C28 12 28 16 26 18L16 28Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* Heart chambers hint */}
        <Path
          d="M14 14L16 18L18 14"
          stroke={color}
          strokeWidth={1}
          opacity={0.5}
        />
        {/* Aorta/vessels at top */}
        <Path
          d="M14 10L12 6M16 8L16 4M18 10L20 6"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.6}
        />
        {/* Thorny wire wrapping - first loop */}
        <Path
          d="M6 14C10 12 14 14 18 12C22 10 26 14 26 14"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.8}
        />
        {/* Thorny wire - second loop */}
        <Path
          d="M8 20C12 18 16 22 20 20C24 18 26 20 26 20"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.7}
        />
        {/* Thorns on wire */}
        <Path
          d="M10 13L9 11M14 12L13 10M18 11L19 9M22 13L23 11"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.6}
        />
        <Path
          d="M10 19L9 17M14 21L13 23M18 21L19 23M22 19L23 17"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />
        {/* Blood drops - constriction damage */}
        <Path
          d="M8 16C7 17 7 18 8 19"
          stroke={color}
          strokeWidth={0.75}
          strokeLinecap="round"
          opacity={0.4}
        />
        <Path
          d="M24 16C25 17 25 18 24 19"
          stroke={color}
          strokeWidth={0.75}
          strokeLinecap="round"
          opacity={0.4}
        />
      </G>
    </Svg>
  );
}

export default LifeIcon;

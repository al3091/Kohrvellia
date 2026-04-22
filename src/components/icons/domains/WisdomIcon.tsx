/**
 * Wisdom Domain Icon
 * A single eye forced open by iron hooks, weeping dark fluid
 */

import React from 'react';
import Svg, { Path, G, Circle } from 'react-native-svg';
import { Colors } from '../../../constants/Colors';

interface WisdomIconProps {
  size?: number;
  color?: string;
}

export function WisdomIcon({ size = 32, color = Colors.domain.wisdom }: WisdomIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <G opacity={0.9}>
        {/* Eye outline - forced wide open */}
        <Path
          d="M6 16C6 16 10 8 16 8C22 8 26 16 26 16C26 16 22 24 16 24C10 24 6 16 6 16Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* Iris */}
        <Circle cx={16} cy={16} r={5} stroke={color} strokeWidth={1.5} />
        {/* Pupil - dilated */}
        <Circle cx={16} cy={16} r={2} fill={color} opacity={0.8} />
        {/* Upper iron hook - holding lid open */}
        <Path
          d="M10 8L8 4L6 6L9 10"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M22 8L24 4L26 6L23 10"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Lower hooks */}
        <Path
          d="M10 24L8 28L6 26L9 22"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.7}
        />
        <Path
          d="M22 24L24 28L26 26L23 22"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.7}
        />
        {/* Dark tears streaming down */}
        <Path
          d="M12 20C12 22 11 25 12 28"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />
        <Path
          d="M16 24C16 26 15 28 16 30"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.4}
        />
        <Path
          d="M20 20C20 22 21 25 20 28"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />
        {/* Bloodshot veins */}
        <Path
          d="M8 14L11 15M8 18L11 17"
          stroke={color}
          strokeWidth={0.5}
          strokeLinecap="round"
          opacity={0.3}
        />
        <Path
          d="M24 14L21 15M24 18L21 17"
          stroke={color}
          strokeWidth={0.5}
          strokeLinecap="round"
          opacity={0.3}
        />
      </G>
    </Svg>
  );
}

export default WisdomIcon;

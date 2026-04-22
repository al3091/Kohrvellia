/**
 * Sea Domain Icon
 * A drowning hand reaching up through black, churning water
 */

import React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { Colors } from '../../../constants/Colors';

interface SeaIconProps {
  size?: number;
  color?: string;
}

export function SeaIcon({ size = 32, color = Colors.domain.sea }: SeaIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <G opacity={0.9}>
        {/* Churning water surface - waves */}
        <Path
          d="M4 14C6 12 8 14 10 12C12 10 14 12 16 10C18 8 20 10 22 8C24 6 26 8 28 6"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.6}
        />
        {/* Secondary wave layer */}
        <Path
          d="M4 18C6 16 8 18 10 16C12 14 14 16 16 14C18 12 20 14 22 12C24 10 26 12 28 10"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.4}
        />
        {/* Drowning hand - desperate reach */}
        <Path
          d="M16 20L16 8"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Palm */}
        <Path
          d="M13 10C13 8 14 7 16 7C18 7 19 8 19 10"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.8}
        />
        {/* Fingers - splayed, grasping */}
        <Path
          d="M13 10L11 6"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <Path
          d="M14 8L13 4"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <Path
          d="M16 7L16 3"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <Path
          d="M18 8L19 4"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <Path
          d="M19 10L21 6"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        {/* Water pulling down - dark depths */}
        <Path
          d="M14 22C14 24 13 26 14 28"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />
        <Path
          d="M16 22C16 25 16 27 16 30"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.6}
        />
        <Path
          d="M18 22C18 24 19 26 18 28"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />
        {/* Bubbles - last breath */}
        <Path
          d="M12 16C12 15 13 15 13 16"
          stroke={color}
          strokeWidth={0.5}
          opacity={0.3}
        />
        <Path
          d="M20 14C20 13 21 13 21 14"
          stroke={color}
          strokeWidth={0.5}
          opacity={0.25}
        />
      </G>
    </Svg>
  );
}

export default SeaIcon;

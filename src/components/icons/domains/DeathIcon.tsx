/**
 * Death Domain Icon
 * A skeletal hand gently cradling a wilting, ash-covered lotus
 */

import React from 'react';
import Svg, { Path, G, Circle } from 'react-native-svg';
import { Colors } from '../../../constants/Colors';

interface DeathIconProps {
  size?: number;
  color?: string;
}

export function DeathIcon({ size = 32, color = Colors.domain.death }: DeathIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <G opacity={0.9}>
        {/* Skeletal palm base */}
        <Path
          d="M10 26C10 24 12 22 14 22H18C20 22 22 24 22 26"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.6}
        />
        {/* Skeletal fingers - curved upward, cradling */}
        <Path
          d="M10 22C8 20 7 18 8 16"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <Path
          d="M12 22C11 19 10 16 11 14"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <Path
          d="M20 22C21 19 22 16 21 14"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <Path
          d="M22 22C24 20 25 18 24 16"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        {/* Thumb */}
        <Path
          d="M14 24C12 23 10 21 10 19"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.8}
        />
        {/* Wilting lotus - center */}
        <Circle cx={16} cy={12} r={2} stroke={color} strokeWidth={1.5} opacity={0.8} />
        {/* Lotus petals - drooping */}
        <Path
          d="M14 12C12 10 11 8 12 6"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />
        <Path
          d="M18 12C20 10 21 8 20 6"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />
        <Path
          d="M16 10C16 8 16 6 16 4"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.6}
        />
        {/* Falling petal */}
        <Path
          d="M18 14C19 15 20 17 19 18"
          stroke={color}
          strokeWidth={0.75}
          strokeLinecap="round"
          opacity={0.3}
        />
        {/* Ash particles */}
        <Circle cx={13} cy={8} r={0.5} fill={color} opacity={0.3} />
        <Circle cx={19} cy={9} r={0.5} fill={color} opacity={0.25} />
        <Circle cx={15} cy={5} r={0.5} fill={color} opacity={0.2} />
      </G>
    </Svg>
  );
}

export default DeathIcon;

/**
 * Fortune Domain Icon
 * A rusted coin melting into a twisted, deformed die
 */

import React from 'react';
import Svg, { Path, G, Circle } from 'react-native-svg';
import { Colors } from '../../../constants/Colors';

interface FortuneIconProps {
  size?: number;
  color?: string;
}

export function FortuneIcon({ size = 32, color = Colors.domain.fortune }: FortuneIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <G opacity={0.9}>
        {/* Rusted coin - top, melting downward */}
        <Path
          d="M10 8C10 5.5 12.5 4 16 4C19.5 4 22 5.5 22 8C22 10.5 19.5 12 16 12"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        {/* Coin edge detail */}
        <Path
          d="M11 7C11 6 13 5 16 5C19 5 21 6 21 7"
          stroke={color}
          strokeWidth={0.75}
          opacity={0.4}
        />
        {/* Melting drips from coin */}
        <Path
          d="M12 10C12 12 11 14 12 16"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.7}
        />
        <Path
          d="M16 12C16 14 16 16 15 18"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.6}
        />
        <Path
          d="M20 10C20 12 21 14 20 16"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.7}
        />
        {/* Twisted die - warped perspective */}
        <Path
          d="M10 20L14 17L22 19L20 26L12 28L10 20Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* Die face line */}
        <Path
          d="M14 17L13 24"
          stroke={color}
          strokeWidth={1}
          opacity={0.5}
        />
        <Path
          d="M22 19L13 24"
          stroke={color}
          strokeWidth={1}
          opacity={0.5}
        />
        {/* Deformed pips on die */}
        <Circle cx={12} cy={23} r={1} fill={color} opacity={0.6} />
        <Circle cx={17} cy={21} r={0.8} fill={color} opacity={0.5} />
        <Circle cx={16} cy={24} r={0.6} fill={color} opacity={0.4} />
      </G>
    </Svg>
  );
}

export default FortuneIcon;

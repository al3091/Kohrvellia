/**
 * Nature Domain Icon
 * A petrified, screaming tree root breaking through dry stone
 */

import React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { Colors } from '../../../constants/Colors';

interface NatureIconProps {
  size?: number;
  color?: string;
}

export function NatureIcon({ size = 32, color = Colors.domain.nature }: NatureIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <G opacity={0.9}>
        {/* Stone ground - cracked */}
        <Path
          d="M4 22H28"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Stone cracks */}
        <Path
          d="M8 22L10 26M16 22L16 28M22 22L20 25"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.4}
        />
        {/* Main root - twisted, breaking through */}
        <Path
          d="M16 22C16 18 14 14 16 10C18 6 16 4 16 4"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Root tendrils - gnarled */}
        <Path
          d="M16 18C14 17 12 18 10 16"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.7}
        />
        <Path
          d="M16 14C18 13 20 14 22 12"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.7}
        />
        {/* Screaming face in the bark - abstract */}
        <Path
          d="M14 9C14 8 15 8 15 9"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.8}
        />
        <Path
          d="M17 9C17 8 18 8 18 9"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.8}
        />
        {/* Screaming mouth */}
        <Path
          d="M15 11C15 12 16 13 17 11"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.6}
        />
        {/* Stone fragments rising */}
        <Path
          d="M12 20L11 18L13 19Z"
          stroke={color}
          strokeWidth={0.75}
          opacity={0.4}
        />
        <Path
          d="M20 20L21 18L19 19Z"
          stroke={color}
          strokeWidth={0.75}
          opacity={0.4}
        />
        {/* Petrified texture lines */}
        <Path
          d="M15 16L17 15M14 12L16 11"
          stroke={color}
          strokeWidth={0.5}
          opacity={0.3}
        />
      </G>
    </Svg>
  );
}

export default NatureIcon;

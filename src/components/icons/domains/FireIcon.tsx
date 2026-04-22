/**
 * Fire Domain Icon
 * A charred silhouette screaming silently within white flame
 */

import React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { Colors } from '../../../constants/Colors';

interface FireIconProps {
  size?: number;
  color?: string;
}

export function FireIcon({ size = 32, color = Colors.domain.fire }: FireIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <G opacity={0.9}>
        {/* Outer flame - intense */}
        <Path
          d="M16 2C12 6 8 10 8 18C8 24 12 28 16 28C20 28 24 24 24 18C24 10 20 6 16 2Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* Inner flame layer */}
        <Path
          d="M16 6C14 9 11 12 11 18C11 22 13 25 16 25C19 25 21 22 21 18C21 12 18 9 16 6Z"
          stroke={color}
          strokeWidth={1}
          strokeLinejoin="round"
          opacity={0.6}
        />
        {/* Flame tongues */}
        <Path
          d="M10 14C9 12 10 10 12 8"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />
        <Path
          d="M22 14C23 12 22 10 20 8"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />
        {/* Charred silhouette - screaming figure */}
        <Path
          d="M14 12C14 10 15 9 16 9C17 9 18 10 18 12C18 13 17 14 16 14C15 14 14 13 14 12Z"
          stroke={color}
          strokeWidth={1.5}
          opacity={0.8}
        />
        {/* Silhouette body */}
        <Path
          d="M14 14C14 16 13 18 14 20C14 22 15 24 16 24C17 24 18 22 18 20C19 18 18 16 18 14"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.7}
        />
        {/* Arms raised in agony */}
        <Path
          d="M14 16L12 14L11 16"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.6}
        />
        <Path
          d="M18 16L20 14L21 16"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.6}
        />
        {/* Screaming mouth - open void */}
        <Path
          d="M15 11C15 12 16 12 17 11"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.8}
        />
        {/* Eye sockets */}
        <Path
          d="M15 10H15.5M17 10H16.5"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.7}
        />
        {/* Embers rising */}
        <Path
          d="M12 6C12 5 13 4 13 3"
          stroke={color}
          strokeWidth={0.5}
          strokeLinecap="round"
          opacity={0.3}
        />
        <Path
          d="M20 6C20 5 19 4 19 3"
          stroke={color}
          strokeWidth={0.5}
          strokeLinecap="round"
          opacity={0.3}
        />
      </G>
    </Svg>
  );
}

export default FireIcon;

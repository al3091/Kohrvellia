/**
 * Knowledge Domain Icon
 * A crumbling stone tablet dripping with thick, dark fluid
 */

import React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { Colors } from '../../../constants/Colors';

interface KnowledgeIconProps {
  size?: number;
  color?: string;
}

export function KnowledgeIcon({ size = 32, color = Colors.domain.knowledge }: KnowledgeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <G opacity={0.9}>
        {/* Stone tablet - crumbling edges */}
        <Path
          d="M8 4L10 4L10 6L8 8L8 24L10 26L10 28L8 28L6 26L6 6L8 4Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <Path
          d="M24 4L22 4L22 6L24 8L24 24L22 26L22 28L24 28L26 26L26 6L24 4Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* Tablet face */}
        <Path
          d="M10 6H22V26H10V6Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* Ancient text/runes - fading */}
        <Path
          d="M12 10H20"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />
        <Path
          d="M12 13H18"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.4}
        />
        <Path
          d="M12 16H16"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.3}
        />
        {/* Crumbling chunks */}
        <Path
          d="M6 10L4 12L5 14"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.4}
        />
        <Path
          d="M26 16L28 18L27 20"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.4}
        />
        {/* Cracks in tablet */}
        <Path
          d="M14 6L16 10L14 14"
          stroke={color}
          strokeWidth={0.75}
          strokeLinecap="round"
          opacity={0.5}
        />
        <Path
          d="M18 18L20 22L18 26"
          stroke={color}
          strokeWidth={0.75}
          strokeLinecap="round"
          opacity={0.5}
        />
        {/* Dark fluid dripping */}
        <Path
          d="M12 26C12 28 11 30 12 32"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.7}
        />
        <Path
          d="M16 26C16 28 16 30 16 32"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.6}
        />
        <Path
          d="M20 26C20 28 21 30 20 32"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.7}
        />
        {/* Pooling at bottom */}
        <Path
          d="M10 30C12 31 14 30 16 31C18 30 20 31 22 30"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.4}
        />
      </G>
    </Svg>
  );
}

export default KnowledgeIcon;

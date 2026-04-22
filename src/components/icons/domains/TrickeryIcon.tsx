/**
 * Trickery Domain Icon
 * A shattered mirror reflecting a warped, faceless silhouette
 */

import React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { Colors } from '../../../constants/Colors';

interface TrickeryIconProps {
  size?: number;
  color?: string;
}

export function TrickeryIcon({ size = 32, color = Colors.domain.trickery }: TrickeryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <G opacity={0.9}>
        {/* Mirror frame - ornate, broken */}
        <Path
          d="M8 6C8 5 9 4 10 4H22C23 4 24 5 24 6V26C24 27 23 28 22 28H10C9 28 8 27 8 26V6Z"
          stroke={color}
          strokeWidth={1.5}
          opacity={0.6}
        />
        {/* Major crack - diagonal shatter */}
        <Path
          d="M10 8L16 16L22 6"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Secondary cracks */}
        <Path
          d="M16 16L12 24M16 16L20 22M16 16L18 12"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />
        {/* Faceless silhouette in the shards */}
        <Path
          d="M14 12C14 10 15 9 16 9C17 9 18 10 18 12V14C18 15 17 16 16 16C15 16 14 15 14 14V12Z"
          stroke={color}
          strokeWidth={1.5}
          opacity={0.7}
        />
        {/* Shoulders of silhouette */}
        <Path
          d="M12 20C12 18 14 17 16 17C18 17 20 18 20 20"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.5}
        />
        {/* Void where face should be */}
        <Path
          d="M15 11H17"
          stroke={color}
          strokeWidth={0.5}
          opacity={0.2}
        />
        {/* Falling shard */}
        <Path
          d="M6 22L8 20L7 24Z"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.4}
        />
      </G>
    </Svg>
  );
}

export default TrickeryIcon;

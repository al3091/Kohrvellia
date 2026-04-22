/**
 * Authority Domain Icon
 * A heavy, oxidized iron crown crushing the skull beneath it
 */

import React from 'react';
import Svg, { Path, G, Circle } from 'react-native-svg';
import { Colors } from '../../../constants/Colors';

interface AuthorityIconProps {
  size?: number;
  color?: string;
}

export function AuthorityIcon({ size = 32, color = Colors.domain.authority }: AuthorityIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <G opacity={0.9}>
        {/* Crown base - heavy, oxidized */}
        <Path
          d="M6 14H26V18H6V14Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* Crown spikes */}
        <Path
          d="M8 14L10 8L12 14"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M12 14L16 6L20 14"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M20 14L22 8L24 14"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Skull beneath - being crushed */}
        <Path
          d="M10 20C10 18 12 18 16 18C20 18 22 18 22 20C22 24 20 26 16 26C12 26 10 24 10 20Z"
          stroke={color}
          strokeWidth={1.5}
          opacity={0.7}
        />
        {/* Eye sockets - hollow */}
        <Circle cx={13} cy={21} r={1.5} stroke={color} strokeWidth={1} opacity={0.6} />
        <Circle cx={19} cy={21} r={1.5} stroke={color} strokeWidth={1} opacity={0.6} />
        {/* Nose cavity */}
        <Path
          d="M16 22L15 24L17 24L16 22Z"
          stroke={color}
          strokeWidth={0.75}
          opacity={0.5}
        />
        {/* Teeth / jaw - cracking */}
        <Path
          d="M13 25H19"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />
        {/* Cracks in skull from weight */}
        <Path
          d="M12 18L11 21"
          stroke={color}
          strokeWidth={0.75}
          strokeLinecap="round"
          opacity={0.4}
        />
        <Path
          d="M20 18L21 21"
          stroke={color}
          strokeWidth={0.75}
          strokeLinecap="round"
          opacity={0.4}
        />
        <Path
          d="M16 18L16 20"
          stroke={color}
          strokeWidth={0.75}
          strokeLinecap="round"
          opacity={0.3}
        />
        {/* Crown oxidation/damage marks */}
        <Path
          d="M8 16L10 15M22 16L24 15"
          stroke={color}
          strokeWidth={0.5}
          opacity={0.3}
        />
      </G>
    </Svg>
  );
}

export default AuthorityIcon;

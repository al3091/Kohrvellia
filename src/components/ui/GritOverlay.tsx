import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Defs, Pattern, Rect as SvgRect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width: W, height: H } = Dimensions.get('window');

const VIGNETTE_OPACITY = 0.38;
const VIGNETTE_SIZE_V = H * 0.22;
const VIGNETTE_SIZE_H = W * 0.20;

export function GritOverlay() {
  return (
    <View style={styles.root} pointerEvents="none">
      {/* Grain noise + scanlines via SVG pattern tiling */}
      <Svg style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Defs>
          {/* 8×8 noise tile — warm dust specks at low opacity */}
          <Pattern id="grain" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <SvgRect x="1" y="2" width="1" height="1" fill="#FDC880" opacity="0.048" />
            <SvgRect x="4" y="0" width="1" height="1" fill="#000000" opacity="0.038" />
            <SvgRect x="6" y="4" width="1" height="1" fill="#FDC880" opacity="0.052" />
            <SvgRect x="2" y="6" width="1" height="1" fill="#000000" opacity="0.042" />
            <SvgRect x="7" y="1" width="1" height="1" fill="#000000" opacity="0.035" />
            <SvgRect x="3" y="5" width="1" height="1" fill="#FDC880" opacity="0.028" />
            <SvgRect x="0" y="3" width="1" height="1" fill="#FDC880" opacity="0.040" />
            <SvgRect x="5" y="7" width="1" height="1" fill="#000000" opacity="0.032" />
          </Pattern>
          {/* Scanline pattern — 1px dark band every 3px */}
          <Pattern id="scanlines" x="0" y="0" width={W} height="3" patternUnits="userSpaceOnUse">
            <SvgRect x="0" y="0" width={W} height="1" fill="#000000" opacity="0.055" />
          </Pattern>
        </Defs>
        <SvgRect x="0" y="0" width={W} height={H} fill="url(#grain)" />
        <SvgRect x="0" y="0" width={W} height={H} fill="url(#scanlines)" />
      </Svg>

      {/* Vignette — four gradient bars pulling the edges dark */}
      <LinearGradient
        colors={['#030203', 'transparent']}
        style={[styles.vignette, { top: 0, left: 0, right: 0, height: VIGNETTE_SIZE_V }]}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['transparent', '#030203']}
        style={[styles.vignette, { bottom: 0, left: 0, right: 0, height: VIGNETTE_SIZE_V }]}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['#030203', 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.vignette, { top: 0, bottom: 0, left: 0, width: VIGNETTE_SIZE_H }]}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['transparent', '#030203']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.vignette, { top: 0, bottom: 0, right: 0, width: VIGNETTE_SIZE_H }]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  vignette: {
    position: 'absolute',
    opacity: VIGNETTE_OPACITY,
  },
});

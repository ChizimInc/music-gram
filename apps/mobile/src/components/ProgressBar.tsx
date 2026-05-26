import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import Layout from '../constants/layout';
import { formatTime } from '../utils/formatTime';

interface ProgressBarProps {
  positionMs: number;
  durationMs: number;
  onSeek?: (positionMs: number) => void;
}

export default function ProgressBar({ positionMs, durationMs }: ProgressBarProps) {
  const progress = durationMs > 0 ? positionMs / durationMs : 0;

  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
      <View style={styles.times}>
        <Text style={styles.time}>{formatTime(positionMs)}</Text>
        <Text style={styles.time}>{formatTime(durationMs)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.padding.lg,
    width: '100%',
  },
  barBackground: {
    height: 4,
    backgroundColor: Colors.surfaceLighter,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  times: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Layout.padding.xs,
  },
  time: {
    color: Colors.textMuted,
    fontSize: Layout.fontSize.xs,
  },
});

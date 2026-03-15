import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import Layout from '../constants/layout';
import { RepeatMode } from '../types';

interface PlayerControlsProps {
  isPlaying: boolean;
  shuffle: boolean;
  repeatMode: RepeatMode;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
}

const repeatLabels: Record<RepeatMode, string> = {
  off: '\uD83D\uDD01',
  all: '\uD83D\uDD01',
  one: '\uD83D\uDD02',
};

export default function PlayerControls({
  isPlaying,
  shuffle,
  repeatMode,
  onPlayPause,
  onNext,
  onPrevious,
  onToggleShuffle,
  onCycleRepeat,
}: PlayerControlsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onToggleShuffle} style={styles.sideButton}>
        <Text style={[styles.sideIcon, shuffle && styles.active]}>
          {'\uD83D\uDD00'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPrevious} style={styles.controlButton}>
        <Text style={styles.controlIcon}>{'\u23EE'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPlayPause} style={styles.playButton}>
        <Text style={styles.playIcon}>{isPlaying ? '\u23F8' : '\u25B6'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onNext} style={styles.controlButton}>
        <Text style={styles.controlIcon}>{'\u23ED'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onCycleRepeat} style={styles.sideButton}>
        <Text style={[styles.sideIcon, repeatMode !== 'off' && styles.active]}>
          {repeatLabels[repeatMode]}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.padding.lg,
  },
  sideButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  active: {
    opacity: 1,
  },
  controlButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIcon: {
    color: Colors.text,
    fontSize: 28,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Layout.padding.md,
  },
  playIcon: {
    color: Colors.black,
    fontSize: 28,
  },
});

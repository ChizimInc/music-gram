import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { usePlayer } from '../contexts/PlayerContext';
import { RootStackParamList } from '../types';
import Colors from '../constants/colors';
import Layout from '../constants/layout';

type Nav = StackNavigationProp<RootStackParamList>;

export default function MiniPlayer() {
  const { state, togglePlayPause } = usePlayer();
  const navigation = useNavigation<Nav>();

  if (!state.currentTrack) return null;

  const progress = state.durationMs > 0 ? state.positionMs / state.durationMs : 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Player')}
      activeOpacity={0.9}
    >
      <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      <View style={styles.content}>
        <Image
          source={{ uri: state.currentTrack.coverImageURL || undefined }}
          style={styles.cover}
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {state.currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {state.currentTrack.artistName}
          </Text>
        </View>
        <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
          <Text style={styles.playIcon}>{state.isPlaying ? '\u23F8' : '\u25B6'}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Layout.tabBarHeight,
    left: 0,
    right: 0,
    height: Layout.miniPlayerHeight,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  progressBar: {
    height: 2,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.padding.sm,
  },
  cover: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.sm,
    backgroundColor: Colors.surfaceLight,
  },
  info: {
    flex: 1,
    marginLeft: Layout.padding.sm,
  },
  title: {
    color: Colors.text,
    fontSize: Layout.fontSize.md,
    fontWeight: '500',
  },
  artist: {
    color: Colors.textSecondary,
    fontSize: Layout.fontSize.sm,
  },
  playButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: Colors.text,
    fontSize: 20,
  },
});

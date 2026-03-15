import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Playlist } from '../types';
import Colors from '../constants/colors';
import Layout from '../constants/layout';

interface PlaylistCardProps {
  playlist: Playlist;
  onPress: (playlist: Playlist) => void;
}

export default function PlaylistCard({ playlist, onPress }: PlaylistCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(playlist)}>
      <Image
        source={{ uri: playlist.coverImageURL || undefined }}
        style={styles.cover}
        defaultSource={require('../../assets/icon.png')}
      />
      <Text style={styles.title} numberOfLines={1}>{playlist.title}</Text>
      <Text style={styles.subtitle} numberOfLines={1}>{playlist.ownerDisplayName}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Layout.albumCardWidth,
    marginRight: Layout.padding.md,
  },
  cover: {
    width: Layout.albumCardWidth,
    height: Layout.albumCardWidth,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.surfaceLight,
    marginBottom: Layout.padding.sm,
  },
  title: {
    color: Colors.text,
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Layout.fontSize.sm,
    marginTop: 2,
  },
});

import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Album } from '../types';
import Colors from '../constants/colors';
import Layout from '../constants/layout';

interface AlbumCardProps {
  album: Album;
  onPress: (album: Album) => void;
}

export default function AlbumCard({ album, onPress }: AlbumCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(album)}>
      <Image
        source={{ uri: album.coverImageURL || undefined }}
        style={styles.cover}
        defaultSource={require('../../assets/icon.png')}
      />
      <Text style={styles.title} numberOfLines={1}>{album.title}</Text>
      <Text style={styles.artist} numberOfLines={1}>{album.artistName}</Text>
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
  artist: {
    color: Colors.textSecondary,
    fontSize: Layout.fontSize.sm,
    marginTop: 2,
  },
});

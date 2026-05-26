import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { Song } from '../types';
import Colors from '../constants/colors';
import Layout from '../constants/layout';
import { formatTime } from '../utils/formatTime';

interface SongListItemProps {
  song: Song;
  onPress: (song: Song) => void;
  showCover?: boolean;
}

export default function SongListItem({ song, onPress, showCover = true }: SongListItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(song)}>
      {showCover && (
        <Image
          source={{ uri: song.coverImageURL || undefined }}
          style={styles.cover}
          defaultSource={require('../../assets/icon.png')}
        />
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{song.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{song.artistName}</Text>
      </View>
      <Text style={styles.duration}>{formatTime(song.durationMs)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.padding.sm,
    paddingHorizontal: Layout.padding.md,
  },
  cover: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.sm,
    backgroundColor: Colors.surfaceLight,
    marginRight: Layout.padding.sm,
  },
  info: {
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontSize: Layout.fontSize.lg,
    fontWeight: '500',
  },
  artist: {
    color: Colors.textSecondary,
    fontSize: Layout.fontSize.sm,
    marginTop: 2,
  },
  duration: {
    color: Colors.textMuted,
    fontSize: Layout.fontSize.sm,
    marginLeft: Layout.padding.sm,
  },
});

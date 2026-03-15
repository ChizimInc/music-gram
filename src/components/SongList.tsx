import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Song } from '../types';
import SongListItem from './SongListItem';
import Colors from '../constants/colors';
import Layout from '../constants/layout';

interface SongListProps {
  songs: Song[];
  onSongPress: (song: Song, index: number) => void;
  showCover?: boolean;
  ListHeaderComponent?: React.ReactElement;
}

export default function SongList({ songs, onSongPress, showCover, ListHeaderComponent }: SongListProps) {
  if (songs.length === 0) {
    return (
      <View style={styles.empty}>
        {ListHeaderComponent}
        <Text style={styles.emptyText}>No songs found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={songs}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <SongListItem
          song={item}
          onPress={() => onSongPress(item, index)}
          showCover={showCover}
        />
      )}
      ListHeaderComponent={ListHeaderComponent}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  empty: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: Layout.fontSize.md,
    textAlign: 'center',
    marginTop: Layout.padding.xl,
  },
});

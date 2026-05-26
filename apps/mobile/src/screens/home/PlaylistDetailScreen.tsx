import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList, Song } from '../../types';
import { usePlaylist } from '../../hooks/usePlaylists';
import { useSongsByIds } from '../../hooks/useSongs';
import { usePlayer } from '../../contexts/PlayerContext';
import SongList from '../../components/SongList';
import LoadingSpinner from '../../components/LoadingSpinner';
import Colors from '../../constants/colors';
import Layout from '../../constants/layout';

type Props = StackScreenProps<HomeStackParamList, 'PlaylistDetail'>;

export default function PlaylistDetailScreen({ route }: Props) {
  const { playlistId } = route.params;
  const { data: playlist, loading: playlistLoading } = usePlaylist(playlistId);
  const { data: songs, loading: songsLoading } = useSongsByIds(
    playlist?.songIds ?? []
  );
  const { playTrack } = usePlayer();

  const handleSongPress = (song: Song, index: number) => {
    if (songs) playTrack(song, songs, index);
  };

  if (playlistLoading || songsLoading) {
    return <LoadingSpinner />;
  }

  if (!playlist) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Playlist not found</Text>
      </View>
    );
  }

  const header = (
    <View style={styles.header}>
      <Image
        source={{ uri: playlist.coverImageURL || undefined }}
        style={styles.cover}
        defaultSource={require('../../../assets/icon.png')}
      />
      <Text style={styles.title}>{playlist.title}</Text>
      <Text style={styles.owner}>{playlist.ownerDisplayName}</Text>
      {playlist.description ? (
        <Text style={styles.description}>{playlist.description}</Text>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <SongList
        songs={songs ?? []}
        onSongPress={handleSongPress}
        showCover
        ListHeaderComponent={header}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: Layout.padding.lg,
    paddingBottom: Layout.padding.md,
    paddingHorizontal: Layout.padding.md,
  },
  cover: {
    width: 200,
    height: 200,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.surfaceLight,
    marginBottom: Layout.padding.md,
  },
  title: {
    color: Colors.text,
    fontSize: Layout.fontSize.xxl,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  owner: {
    color: Colors.textSecondary,
    fontSize: Layout.fontSize.lg,
    marginTop: Layout.padding.xs,
  },
  description: {
    color: Colors.textMuted,
    fontSize: Layout.fontSize.md,
    marginTop: Layout.padding.sm,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.textMuted,
    fontSize: Layout.fontSize.lg,
    textAlign: 'center',
    marginTop: Layout.padding.xl,
  },
});

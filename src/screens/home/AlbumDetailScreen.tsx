import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList, Song } from '../../types';
import { useAlbum } from '../../hooks/useAlbums';
import { useSongsByIds } from '../../hooks/useSongs';
import { usePlayer } from '../../contexts/PlayerContext';
import SongList from '../../components/SongList';
import LoadingSpinner from '../../components/LoadingSpinner';
import Colors from '../../constants/colors';
import Layout from '../../constants/layout';

type Props = StackScreenProps<HomeStackParamList, 'AlbumDetail'>;

export default function AlbumDetailScreen({ route }: Props) {
  const { albumId } = route.params;
  const { data: album, loading: albumLoading } = useAlbum(albumId);
  const { data: songs, loading: songsLoading } = useSongsByIds(
    album?.songIds ?? []
  );
  const { playTrack } = usePlayer();

  const handleSongPress = (song: Song, index: number) => {
    if (songs) playTrack(song, songs, index);
  };

  if (albumLoading || songsLoading) {
    return <LoadingSpinner />;
  }

  if (!album) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Album not found</Text>
      </View>
    );
  }

  const header = (
    <View style={styles.header}>
      <Image
        source={{ uri: album.coverImageURL || undefined }}
        style={styles.cover}
        defaultSource={require('../../../assets/icon.png')}
      />
      <Text style={styles.title}>{album.title}</Text>
      <Text style={styles.artist}>{album.artistName}</Text>
      <Text style={styles.year}>{album.releaseYear}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SongList
        songs={songs ?? []}
        onSongPress={handleSongPress}
        showCover={false}
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
  artist: {
    color: Colors.textSecondary,
    fontSize: Layout.fontSize.lg,
    marginTop: Layout.padding.xs,
  },
  year: {
    color: Colors.textMuted,
    fontSize: Layout.fontSize.md,
    marginTop: Layout.padding.xs,
  },
  errorText: {
    color: Colors.textMuted,
    fontSize: Layout.fontSize.lg,
    textAlign: 'center',
    marginTop: Layout.padding.xl,
  },
});

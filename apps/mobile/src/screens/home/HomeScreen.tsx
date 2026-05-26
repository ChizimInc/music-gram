import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList, Album, Playlist } from '../../types';
import { useAlbums } from '../../hooks/useAlbums';
import { usePublicPlaylists } from '../../hooks/usePlaylists';
import AlbumCard from '../../components/AlbumCard';
import PlaylistCard from '../../components/PlaylistCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Colors from '../../constants/colors';
import Layout from '../../constants/layout';

type Props = StackScreenProps<HomeStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { data: albums, loading: albumsLoading } = useAlbums();
  const { data: playlists, loading: playlistsLoading } = usePublicPlaylists();

  const handleAlbumPress = (album: Album) => {
    navigation.navigate('AlbumDetail', { albumId: album.id });
  };

  const handlePlaylistPress = (playlist: Playlist) => {
    navigation.navigate('PlaylistDetail', { playlistId: playlist.id });
  };

  if (albumsLoading && playlistsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Good evening</Text>

        <Text style={styles.sectionTitle}>Recent Albums</Text>
        <FlatList
          data={albums ?? []}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <AlbumCard album={item} onPress={handleAlbumPress} />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No albums yet</Text>
          }
          scrollEnabled
        />

        <Text style={styles.sectionTitle}>Popular Playlists</Text>
        <FlatList
          data={playlists ?? []}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <PlaylistCard playlist={item} onPress={handlePlaylistPress} />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No playlists yet</Text>
          }
          scrollEnabled
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Layout.padding.xl,
  },
  greeting: {
    color: Colors.text,
    fontSize: Layout.fontSize.xxxl,
    fontWeight: 'bold',
    paddingHorizontal: Layout.padding.md,
    paddingTop: Layout.padding.lg,
    paddingBottom: Layout.padding.md,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: Layout.fontSize.xl,
    fontWeight: '700',
    paddingHorizontal: Layout.padding.md,
    marginTop: Layout.padding.lg,
    marginBottom: Layout.padding.sm,
  },
  horizontalList: {
    paddingHorizontal: Layout.padding.md,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: Layout.fontSize.md,
  },
});

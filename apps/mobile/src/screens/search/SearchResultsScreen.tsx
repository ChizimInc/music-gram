import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { SearchStackParamList, Album, Song } from '../../types';
import { useSearch } from '../../hooks/useSearch';
import { usePlayer } from '../../contexts/PlayerContext';
import SongListItem from '../../components/SongListItem';
import AlbumCard from '../../components/AlbumCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Colors from '../../constants/colors';
import Layout from '../../constants/layout';

type Props = StackScreenProps<SearchStackParamList, 'SearchResults'>;

export default function SearchResultsScreen({ route, navigation }: Props) {
  const { query } = route.params;
  const { songs, albums, loading, error } = useSearch(query);
  const { playTrack } = usePlayer();

  const handleSongPress = (song: Song) => {
    const index = songs.indexOf(song);
    playTrack(song, songs, index >= 0 ? index : 0);
  };

  const handleAlbumPress = (album: Album) => {
    navigation.navigate('AlbumDetail', { albumId: album.id });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Results for "{query}"</Text>

        {songs.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Songs</Text>
            {songs.map((song) => (
              <SongListItem
                key={song.id}
                song={song}
                onPress={handleSongPress}
              />
            ))}
          </View>
        )}

        {albums.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Albums</Text>
            <FlatList
              data={albums}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <AlbumCard album={item} onPress={handleAlbumPress} />
              )}
              scrollEnabled
            />
          </View>
        )}

        {songs.length === 0 && albums.length === 0 && (
          <Text style={styles.emptyText}>No results found</Text>
        )}
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
  backButton: {
    paddingHorizontal: Layout.padding.md,
    paddingTop: Layout.padding.md,
  },
  backText: {
    color: Colors.primary,
    fontSize: Layout.fontSize.lg,
  },
  heading: {
    color: Colors.text,
    fontSize: Layout.fontSize.xxl,
    fontWeight: 'bold',
    paddingHorizontal: Layout.padding.md,
    paddingTop: Layout.padding.md,
    paddingBottom: Layout.padding.sm,
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
    textAlign: 'center',
    marginTop: Layout.padding.xl,
  },
  errorText: {
    color: Colors.error,
    fontSize: Layout.fontSize.md,
    textAlign: 'center',
    marginTop: Layout.padding.xl,
  },
});

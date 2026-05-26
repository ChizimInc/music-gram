import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { LibraryStackParamList, Song } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { usePlayer } from '../../contexts/PlayerContext';
import { getUser } from '../../services/firestore';
import { useSongsByIds } from '../../hooks/useSongs';
import SongList from '../../components/SongList';
import LoadingSpinner from '../../components/LoadingSpinner';
import Colors from '../../constants/colors';
import Layout from '../../constants/layout';

type Props = StackScreenProps<LibraryStackParamList, 'LikedSongs'>;

export default function LikedSongsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [likedSongIds, setLikedSongIds] = useState<string[]>([]);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    getUser(user.uid)
      .then((userData) => {
        if (!cancelled && userData) {
          setLikedSongIds(userData.likedSongIds);
        }
        if (!cancelled) setUserLoading(false);
      })
      .catch(() => {
        if (!cancelled) setUserLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const { data: songs, loading: songsLoading } = useSongsByIds(likedSongIds);
  const { playTrack } = usePlayer();

  const handleSongPress = (song: Song, index: number) => {
    if (songs) playTrack(song, songs, index);
  };

  if (userLoading || songsLoading) {
    return <LoadingSpinner />;
  }

  const header = (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Liked Songs</Text>
      <Text style={styles.count}>
        {songs?.length ?? 0} song{(songs?.length ?? 0) !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SongList
        songs={songs ?? []}
        onSongPress={handleSongPress}
        showCover
        ListHeaderComponent={header}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Layout.padding.md,
    paddingTop: Layout.padding.md,
    paddingBottom: Layout.padding.lg,
  },
  backButton: {
    marginBottom: Layout.padding.md,
  },
  backText: {
    color: Colors.primary,
    fontSize: Layout.fontSize.lg,
  },
  title: {
    color: Colors.text,
    fontSize: Layout.fontSize.xxxl,
    fontWeight: 'bold',
  },
  count: {
    color: Colors.textSecondary,
    fontSize: Layout.fontSize.md,
    marginTop: Layout.padding.xs,
  },
});

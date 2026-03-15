import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { LibraryStackParamList, Playlist } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useUserPlaylists } from '../../hooks/usePlaylists';
import { logout } from '../../services/auth';
import PlaylistCard from '../../components/PlaylistCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Colors from '../../constants/colors';
import Layout from '../../constants/layout';

type Props = StackScreenProps<LibraryStackParamList, 'Library'>;

export default function LibraryScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { data: playlists, loading } = useUserPlaylists(user?.uid);

  const handlePlaylistPress = (playlist: Playlist) => {
    navigation.navigate('PlaylistDetail', { playlistId: playlist.id });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      Alert.alert('Error', message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Your Library</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.likedRow}
          onPress={() => navigation.navigate('LikedSongs')}
        >
          <View style={styles.likedIcon}>
            <Text style={styles.likedIconText}>♥</Text>
          </View>
          <View style={styles.likedInfo}>
            <Text style={styles.likedTitle}>Liked Songs</Text>
            <Text style={styles.likedSubtitle}>Your favorite tracks</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Your Playlists</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreatePlaylist')}
          >
            <Text style={styles.createText}>+ Create</Text>
          </TouchableOpacity>
        </View>

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
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Layout.padding.xl },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.padding.md,
    paddingTop: Layout.padding.lg,
    paddingBottom: Layout.padding.md,
  },
  heading: {
    color: Colors.text,
    fontSize: Layout.fontSize.xxxl,
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingVertical: Layout.padding.xs,
    paddingHorizontal: Layout.padding.sm,
  },
  logoutText: { color: Colors.textSecondary, fontSize: Layout.fontSize.md },
  likedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Layout.padding.md,
    padding: Layout.padding.md,
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.padding.lg,
  },
  likedIcon: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.padding.sm,
  },
  likedIconText: { color: Colors.white, fontSize: Layout.fontSize.xl },
  likedInfo: { flex: 1 },
  likedTitle: {
    color: Colors.text,
    fontSize: Layout.fontSize.lg,
    fontWeight: '600',
  },
  likedSubtitle: {
    color: Colors.textSecondary,
    fontSize: Layout.fontSize.sm,
    marginTop: 2,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.padding.md,
    marginBottom: Layout.padding.sm,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: Layout.fontSize.xl,
    fontWeight: '700',
  },
  createText: { color: Colors.primary, fontSize: Layout.fontSize.md },
  horizontalList: { paddingHorizontal: Layout.padding.md },
  emptyText: { color: Colors.textMuted, fontSize: Layout.fontSize.md },
});

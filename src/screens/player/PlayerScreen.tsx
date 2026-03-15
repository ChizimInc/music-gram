import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePlayer } from '../../contexts/PlayerContext';
import ProgressBar from '../../components/ProgressBar';
import PlayerControls from '../../components/PlayerControls';
import Colors from '../../constants/colors';
import Layout from '../../constants/layout';

export default function PlayerScreen() {
  const navigation = useNavigation();
  const { state, togglePlayPause, nextTrack, previousTrack, toggleShuffle, cycleRepeat } =
    usePlayer();

  if (!state.currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>No track playing</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.closeIcon}>{'\u2304'}</Text>
      </TouchableOpacity>

      <View style={styles.artworkContainer}>
        <Image
          source={{ uri: state.currentTrack.coverImageURL || undefined }}
          style={styles.artwork}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {state.currentTrack.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {state.currentTrack.artistName}
        </Text>
      </View>

      <ProgressBar positionMs={state.positionMs} durationMs={state.durationMs} />

      <PlayerControls
        isPlaying={state.isPlaying}
        shuffle={state.shuffle}
        repeatMode={state.repeatMode}
        onPlayPause={togglePlayPause}
        onNext={nextTrack}
        onPrevious={previousTrack}
        onToggleShuffle={toggleShuffle}
        onCycleRepeat={cycleRepeat}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Layout.padding.lg,
  },
  closeButton: {
    alignSelf: 'center',
    paddingVertical: Layout.padding.sm,
  },
  closeIcon: {
    color: Colors.textSecondary,
    fontSize: 32,
  },
  artworkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artwork: {
    width: 300,
    height: 300,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.surfaceLight,
  },
  infoContainer: {
    paddingVertical: Layout.padding.lg,
    paddingHorizontal: Layout.padding.sm,
  },
  title: {
    color: Colors.text,
    fontSize: Layout.fontSize.xxl,
    fontWeight: 'bold',
  },
  artist: {
    color: Colors.textSecondary,
    fontSize: Layout.fontSize.lg,
    marginTop: Layout.padding.xs,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: Layout.fontSize.lg,
    textAlign: 'center',
    marginTop: 100,
  },
});

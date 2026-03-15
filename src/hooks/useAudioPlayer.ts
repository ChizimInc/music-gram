import { useRef, useCallback, useEffect } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Song, PlayerAction } from '../types';

interface UseAudioPlayerOptions {
  dispatch: React.Dispatch<PlayerAction>;
  onTrackEnd: () => void;
}

export function useAudioPlayer({ dispatch, onTrackEnd }: UseAudioPlayerOptions) {
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const onPlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        if (status.error) {
          console.error('Playback error:', status.error);
        }
        return;
      }
      dispatch({
        type: 'UPDATE_POSITION',
        payload: {
          positionMs: status.positionMillis,
          durationMs: status.durationMillis ?? 0,
        },
      });
      dispatch({ type: 'SET_BUFFERING', payload: status.isBuffering });

      if (status.didJustFinish && !status.isLooping) {
        onTrackEnd();
      }
    },
    [dispatch, onTrackEnd]
  );

  const loadAndPlay = useCallback(
    async (track: Song) => {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      if (!track.audioURL) return;

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audioURL },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
    },
    [onPlaybackStatusUpdate]
  );

  const play = useCallback(async () => {
    await soundRef.current?.playAsync();
  }, []);

  const pause = useCallback(async () => {
    await soundRef.current?.pauseAsync();
  }, []);

  const seekTo = useCallback(async (positionMs: number) => {
    await soundRef.current?.setPositionAsync(positionMs);
  }, []);

  const setLooping = useCallback(async (isLooping: boolean) => {
    await soundRef.current?.setIsLoopingAsync(isLooping);
  }, []);

  return { loadAndPlay, play, pause, seekTo, setLooping };
}

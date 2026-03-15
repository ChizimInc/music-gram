import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { Song, PlayerState, PlayerAction, RepeatMode } from '../types';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { shuffleArray } from '../utils/shuffleArray';

const initialState: PlayerState = {
  currentTrack: null,
  queue: [],
  queueIndex: 0,
  isPlaying: false,
  isBuffering: false,
  positionMs: 0,
  durationMs: 0,
  shuffle: false,
  repeatMode: 'off',
};

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'SET_TRACK':
      return {
        ...state,
        currentTrack: action.payload.track,
        queue: action.payload.queue,
        queueIndex: action.payload.index,
        isPlaying: true,
        positionMs: 0,
        durationMs: 0,
      };
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'SET_BUFFERING':
      return { ...state, isBuffering: action.payload };
    case 'UPDATE_POSITION':
      return {
        ...state,
        positionMs: action.payload.positionMs,
        durationMs: action.payload.durationMs,
      };
    case 'NEXT_TRACK': {
      const nextIndex = state.queueIndex + 1;
      if (nextIndex >= state.queue.length) {
        if (state.repeatMode === 'all') {
          return { ...state, queueIndex: 0, currentTrack: state.queue[0], positionMs: 0 };
        }
        return { ...state, isPlaying: false };
      }
      return { ...state, queueIndex: nextIndex, currentTrack: state.queue[nextIndex], positionMs: 0 };
    }
    case 'PREVIOUS_TRACK': {
      if (state.positionMs > 3000) {
        return { ...state, positionMs: 0 };
      }
      const prevIndex = Math.max(0, state.queueIndex - 1);
      return { ...state, queueIndex: prevIndex, currentTrack: state.queue[prevIndex], positionMs: 0 };
    }
    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffle: !state.shuffle };
    case 'CYCLE_REPEAT': {
      const modes: RepeatMode[] = ['off', 'all', 'one'];
      const currentIdx = modes.indexOf(state.repeatMode);
      return { ...state, repeatMode: modes[(currentIdx + 1) % modes.length] };
    }
    case 'SET_QUEUE':
      return { ...state, queue: action.payload.queue, queueIndex: action.payload.index };
    default:
      return state;
  }
}

interface PlayerContextValue {
  state: PlayerState;
  playTrack: (song: Song, queue: Song[], index: number) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  seekTo: (positionMs: number) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayer(): PlayerContextValue {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}

interface PlayerProviderProps {
  children: React.ReactNode;
}

export function PlayerProvider({ children }: PlayerProviderProps) {
  const [state, dispatch] = useReducer(playerReducer, initialState);

  const handleTrackEnd = useCallback(() => {
    if (state.repeatMode === 'one') {
      return; // looping handled by expo-av
    }
    dispatch({ type: 'NEXT_TRACK' });
  }, [state.repeatMode]);

  const { loadAndPlay, play, pause, seekTo, setLooping } = useAudioPlayer({
    dispatch,
    onTrackEnd: handleTrackEnd,
  });

  // Load and play when currentTrack changes
  const prevTrackRef = React.useRef<string | null>(null);
  useEffect(() => {
    if (state.currentTrack && state.currentTrack.id !== prevTrackRef.current) {
      prevTrackRef.current = state.currentTrack.id;
      loadAndPlay(state.currentTrack);
    }
  }, [state.currentTrack, loadAndPlay]);

  // Update looping when repeat mode changes
  useEffect(() => {
    setLooping(state.repeatMode === 'one');
  }, [state.repeatMode, setLooping]);

  const playTrack = useCallback(
    (song: Song, queue: Song[], index: number) => {
      let finalQueue = queue;
      let finalIndex = index;
      if (state.shuffle) {
        finalQueue = shuffleArray(queue);
        finalIndex = finalQueue.findIndex((s) => s.id === song.id);
        if (finalIndex === -1) finalIndex = 0;
      }
      dispatch({ type: 'SET_TRACK', payload: { track: song, queue: finalQueue, index: finalIndex } });
    },
    [state.shuffle]
  );

  const togglePlayPause = useCallback(async () => {
    if (state.isPlaying) {
      await pause();
      dispatch({ type: 'PAUSE' });
    } else {
      await play();
      dispatch({ type: 'PLAY' });
    }
  }, [state.isPlaying, play, pause]);

  const nextTrack = useCallback(() => {
    dispatch({ type: 'NEXT_TRACK' });
  }, []);

  const previousTrack = useCallback(() => {
    dispatch({ type: 'PREVIOUS_TRACK' });
  }, []);

  const toggleShuffle = useCallback(() => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  }, []);

  const cycleRepeat = useCallback(() => {
    dispatch({ type: 'CYCLE_REPEAT' });
  }, []);

  const handleSeek = useCallback(
    async (positionMs: number) => {
      await seekTo(positionMs);
    },
    [seekTo]
  );

  const value = useMemo(
    () => ({
      state,
      playTrack,
      togglePlayPause,
      nextTrack,
      previousTrack,
      toggleShuffle,
      cycleRepeat,
      seekTo: handleSeek,
    }),
    [state, playTrack, togglePlayPause, nextTrack, previousTrack, toggleShuffle, cycleRepeat, handleSeek]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

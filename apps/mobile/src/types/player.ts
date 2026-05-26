import { Song } from './models';

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
  currentTrack: Song | null;
  queue: Song[];
  queueIndex: number;
  isPlaying: boolean;
  isBuffering: boolean;
  positionMs: number;
  durationMs: number;
  shuffle: boolean;
  repeatMode: RepeatMode;
}

export type PlayerAction =
  | { type: 'SET_TRACK'; payload: { track: Song; queue: Song[]; index: number } }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'SET_BUFFERING'; payload: boolean }
  | { type: 'UPDATE_POSITION'; payload: { positionMs: number; durationMs: number } }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREVIOUS_TRACK' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'CYCLE_REPEAT' }
  | { type: 'SET_QUEUE'; payload: { queue: Song[]; index: number } };

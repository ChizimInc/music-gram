import { useFirestoreQuery } from './useFirestoreQuery';
import {
  getPublicPlaylists,
  getUserPlaylists,
  getPlaylist,
} from '../services/firestore';
import { Playlist } from '../types';

export function usePublicPlaylists(maxResults = 20) {
  return useFirestoreQuery<Playlist[]>(
    () => getPublicPlaylists(maxResults),
    [maxResults]
  );
}

export function useUserPlaylists(userId: string | undefined) {
  return useFirestoreQuery<Playlist[]>(
    () => (userId ? getUserPlaylists(userId) : Promise.resolve([])),
    [userId]
  );
}

export function usePlaylist(playlistId: string) {
  return useFirestoreQuery<Playlist | null>(
    () => getPlaylist(playlistId),
    [playlistId]
  );
}

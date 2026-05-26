import { useFirestoreQuery } from './useFirestoreQuery';
import { getSongs, getSongsByIds, searchSongs } from '../services/firestore';
import { Song } from '../types';

export function useSongs(maxResults = 20) {
  return useFirestoreQuery<Song[]>(() => getSongs(maxResults), [maxResults]);
}

export function useSongsByIds(songIds: string[]) {
  const key = songIds.join(',');
  return useFirestoreQuery<Song[]>(() => getSongsByIds(songIds), [key]);
}

export function useSongSearch(query: string) {
  return useFirestoreQuery<Song[]>(
    () => (query.trim() ? searchSongs(query) : Promise.resolve([])),
    [query]
  );
}

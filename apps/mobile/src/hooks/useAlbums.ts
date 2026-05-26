import { useFirestoreQuery } from './useFirestoreQuery';
import { getAlbums, getAlbum, searchAlbums } from '../services/firestore';
import { Album } from '../types';

export function useAlbums(maxResults = 20) {
  return useFirestoreQuery<Album[]>(() => getAlbums(maxResults), [maxResults]);
}

export function useAlbum(albumId: string) {
  return useFirestoreQuery<Album | null>(() => getAlbum(albumId), [albumId]);
}

export function useAlbumSearch(query: string) {
  return useFirestoreQuery<Album[]>(
    () => (query.trim() ? searchAlbums(query) : Promise.resolve([])),
    [query]
  );
}

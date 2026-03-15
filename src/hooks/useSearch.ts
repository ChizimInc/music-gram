import { useState, useEffect } from 'react';
import { searchSongs, searchAlbums } from '../services/firestore';
import { Song, Album } from '../types';

interface SearchResults {
  songs: Song[];
  albums: Album[];
  loading: boolean;
  error: string | null;
}

export function useSearch(query: string): SearchResults {
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setSongs([]);
      setAlbums([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([searchSongs(query), searchAlbums(query)])
      .then(([songResults, albumResults]) => {
        if (!cancelled) {
          setSongs(songResults);
          setAlbums(albumResults);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Search failed');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return { songs, albums, loading, error };
}

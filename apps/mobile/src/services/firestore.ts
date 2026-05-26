import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  QueryConstraint,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import { db } from './firebase';
import { Song, Album, Playlist, User } from '../types';

function createConverter<T extends DocumentData>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: T): DocumentData {
      return data;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): T {
      const data = snapshot.data(options);
      return { id: snapshot.id, ...data } as unknown as T;
    },
  };
}

const songConverter = createConverter<Song>();
const albumConverter = createConverter<Album>();
const playlistConverter = createConverter<Playlist>();
const userConverter = createConverter<User>();

// Songs
export async function getSongs(maxResults = 20): Promise<Song[]> {
  const q = query(
    collection(db, 'songs').withConverter(songConverter),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

export async function getSong(songId: string): Promise<Song | null> {
  const snap = await getDoc(doc(db, 'songs', songId).withConverter(songConverter));
  return snap.exists() ? snap.data() : null;
}

export async function getSongsByIds(songIds: string[]): Promise<Song[]> {
  if (songIds.length === 0) return [];
  const songs: Song[] = [];
  // Firestore 'in' queries limited to 30 items
  const chunks = [];
  for (let i = 0; i < songIds.length; i += 30) {
    chunks.push(songIds.slice(i, i + 30));
  }
  for (const chunk of chunks) {
    const q = query(
      collection(db, 'songs').withConverter(songConverter),
      where('__name__', 'in', chunk)
    );
    const snapshot = await getDocs(q);
    songs.push(...snapshot.docs.map((d) => d.data()));
  }
  return songs;
}

export async function searchSongs(searchQuery: string, maxResults = 30): Promise<Song[]> {
  const normalizedQuery = searchQuery.toLowerCase();
  const q = query(
    collection(db, 'songs').withConverter(songConverter),
    orderBy('title'),
    limit(maxResults)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => d.data())
    .filter(
      (song) =>
        song.title.toLowerCase().includes(normalizedQuery) ||
        song.artistName.toLowerCase().includes(normalizedQuery)
    );
}

// Albums
export async function getAlbums(maxResults = 20): Promise<Album[]> {
  const q = query(
    collection(db, 'albums').withConverter(albumConverter),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

export async function getAlbum(albumId: string): Promise<Album | null> {
  const snap = await getDoc(doc(db, 'albums', albumId).withConverter(albumConverter));
  return snap.exists() ? snap.data() : null;
}

export async function searchAlbums(searchQuery: string, maxResults = 20): Promise<Album[]> {
  const normalizedQuery = searchQuery.toLowerCase();
  const q = query(
    collection(db, 'albums').withConverter(albumConverter),
    orderBy('title'),
    limit(maxResults)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => d.data())
    .filter(
      (album) =>
        album.title.toLowerCase().includes(normalizedQuery) ||
        album.artistName.toLowerCase().includes(normalizedQuery)
    );
}

// Playlists
export async function getPublicPlaylists(maxResults = 20): Promise<Playlist[]> {
  const q = query(
    collection(db, 'playlists').withConverter(playlistConverter),
    where('isPublic', '==', true),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

export async function getUserPlaylists(userId: string): Promise<Playlist[]> {
  const q = query(
    collection(db, 'playlists').withConverter(playlistConverter),
    where('ownerId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

export async function getPlaylist(playlistId: string): Promise<Playlist | null> {
  const snap = await getDoc(
    doc(db, 'playlists', playlistId).withConverter(playlistConverter)
  );
  return snap.exists() ? snap.data() : null;
}

export async function createPlaylist(
  title: string,
  description: string,
  ownerId: string,
  ownerDisplayName: string,
  isPublic: boolean
): Promise<string> {
  const ref = doc(collection(db, 'playlists'));
  await setDoc(ref, {
    title,
    description,
    coverImageURL: '',
    ownerId,
    ownerDisplayName,
    songIds: [],
    isPublic,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function addSongToPlaylist(
  playlistId: string,
  songId: string
): Promise<void> {
  await updateDoc(doc(db, 'playlists', playlistId), {
    songIds: arrayUnion(songId),
    updatedAt: serverTimestamp(),
  });
}

export async function removeSongFromPlaylist(
  playlistId: string,
  songId: string
): Promise<void> {
  await updateDoc(doc(db, 'playlists', playlistId), {
    songIds: arrayRemove(songId),
    updatedAt: serverTimestamp(),
  });
}

export async function deletePlaylist(playlistId: string): Promise<void> {
  await deleteDoc(doc(db, 'playlists', playlistId));
}

// Users
export async function getUser(userId: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', userId).withConverter(userConverter));
  return snap.exists() ? snap.data() : null;
}

export async function toggleLikeSong(
  userId: string,
  songId: string,
  isLiked: boolean
): Promise<void> {
  const ref = doc(db, 'users', userId);
  if (isLiked) {
    await updateDoc(ref, { likedSongIds: arrayRemove(songId) });
  } else {
    await updateDoc(ref, { likedSongIds: arrayUnion(songId) });
  }
}

export async function toggleFollowPlaylist(
  userId: string,
  playlistId: string,
  isFollowing: boolean
): Promise<void> {
  const ref = doc(db, 'users', userId);
  if (isFollowing) {
    await updateDoc(ref, { followedPlaylistIds: arrayRemove(playlistId) });
  } else {
    await updateDoc(ref, { followedPlaylistIds: arrayUnion(playlistId) });
  }
}

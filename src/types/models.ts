import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  avatarBgColor: string;
  createdAt: Timestamp;
  likedSongIds: string[];
  followedPlaylistIds: string[];
}

export interface Song {
  id: string;
  title: string;
  artistName: string;
  artistId: string;
  albumId: string;
  albumTitle: string;
  coverImageURL: string;
  audioURL: string;
  durationMs: number;
  trackNumber: number;
  genre: string;
  createdAt: Timestamp;
}

export interface Album {
  id: string;
  title: string;
  artistName: string;
  artistId: string;
  coverImageURL: string;
  songIds: string[];
  releaseYear: number;
  genre: string;
  createdAt: Timestamp;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverImageURL: string;
  ownerId: string;
  ownerDisplayName: string;
  songIds: string[];
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

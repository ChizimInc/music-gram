export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl?: string;
  durationSec: number;
}

export interface Playlist {
  id: string;
  name: string;
  ownerId: string;
  songs: Song[];
}
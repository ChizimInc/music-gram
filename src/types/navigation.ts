import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Player: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  SearchTab: NavigatorScreenParams<SearchStackParamList>;
  LibraryTab: NavigatorScreenParams<LibraryStackParamList>;
};

export type HomeStackParamList = {
  Home: undefined;
  AlbumDetail: { albumId: string };
  PlaylistDetail: { playlistId: string };
};

export type SearchStackParamList = {
  Search: undefined;
  SearchResults: { query: string };
  AlbumDetail: { albumId: string };
  PlaylistDetail: { playlistId: string };
};

export type LibraryStackParamList = {
  Library: undefined;
  LikedSongs: undefined;
  PlaylistDetail: { playlistId: string };
  CreatePlaylist: undefined;
};

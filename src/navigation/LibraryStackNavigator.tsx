import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LibraryStackParamList } from '../types';
import LibraryScreen from '../screens/library/LibraryScreen';
import LikedSongsScreen from '../screens/library/LikedSongsScreen';
import PlaylistDetailScreen from '../screens/home/PlaylistDetailScreen';
import CreatePlaylistScreen from '../screens/library/CreatePlaylistScreen';

const Stack = createStackNavigator<LibraryStackParamList>();

export default function LibraryStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen name="LikedSongs" component={LikedSongsScreen} />
      <Stack.Screen name="PlaylistDetail" component={PlaylistDetailScreen} />
      <Stack.Screen name="CreatePlaylist" component={CreatePlaylistScreen} />
    </Stack.Navigator>
  );
}

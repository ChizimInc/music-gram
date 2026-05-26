import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SearchStackParamList } from '../types';
import SearchScreen from '../screens/search/SearchScreen';
import SearchResultsScreen from '../screens/search/SearchResultsScreen';
import AlbumDetailScreen from '../screens/home/AlbumDetailScreen';
import PlaylistDetailScreen from '../screens/home/PlaylistDetailScreen';

const Stack = createStackNavigator<SearchStackParamList>();

export default function SearchStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="AlbumDetail" component={AlbumDetailScreen} />
      <Stack.Screen name="PlaylistDetail" component={PlaylistDetailScreen} />
    </Stack.Navigator>
  );
}

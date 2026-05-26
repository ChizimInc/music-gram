import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { SearchStackParamList } from '../../types';
import SearchBar from '../../components/SearchBar';
import Colors from '../../constants/colors';
import Layout from '../../constants/layout';

type Props = StackScreenProps<SearchStackParamList, 'Search'>;

export default function SearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (trimmed) {
      navigation.navigate('SearchResults', { query: trimmed });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Search</Text>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Songs, albums, artists..."
        onSubmit={handleSubmit}
      />
      <View style={styles.browseSection}>
        <Text style={styles.browseTitle}>Browse Categories</Text>
        <Text style={styles.browsePlaceholder}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heading: {
    color: Colors.text,
    fontSize: Layout.fontSize.xxxl,
    fontWeight: 'bold',
    paddingHorizontal: Layout.padding.md,
    paddingTop: Layout.padding.lg,
    paddingBottom: Layout.padding.sm,
  },
  browseSection: {
    flex: 1,
    paddingHorizontal: Layout.padding.md,
    paddingTop: Layout.padding.lg,
  },
  browseTitle: {
    color: Colors.text,
    fontSize: Layout.fontSize.xl,
    fontWeight: '700',
    marginBottom: Layout.padding.md,
  },
  browsePlaceholder: {
    color: Colors.textMuted,
    fontSize: Layout.fontSize.md,
  },
});

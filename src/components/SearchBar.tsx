import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import Layout from '../constants/layout';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
}

export default function SearchBar({ value, onChangeText, placeholder = 'Search...', onSubmit }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.padding.md,
    paddingVertical: Layout.padding.sm,
  },
  input: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.padding.sm,
    paddingHorizontal: Layout.padding.md,
    color: Colors.text,
    fontSize: Layout.fontSize.lg,
  },
});

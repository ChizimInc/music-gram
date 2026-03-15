import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import Colors from '../constants/colors';
import Layout from '../constants/layout';

interface AuthInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function AuthInput({ value, onChangeText, ...rest }: AuthInputProps) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={Colors.textMuted}
      autoCapitalize="none"
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.inputBackground,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.padding.md,
    color: Colors.text,
    fontSize: Layout.fontSize.lg,
    marginBottom: Layout.padding.md,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
});

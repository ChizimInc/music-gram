import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Colors from '../../constants/colors';
import Layout from '../../constants/layout';

interface GoogleSignInButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export default function GoogleSignInButton({ onPress, disabled }: GoogleSignInButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.content}>
        <Text style={styles.gLogo}>G</Text>
        <Text style={styles.label}>Continue with Google</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.padding.md,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gLogo: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: '#4285F4',
    marginRight: Layout.padding.sm,
  },
  label: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.black,
  },
});

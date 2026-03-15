import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

interface IconButtonProps {
  icon: string;
  onPress: () => void;
  size?: number;
  color?: string;
  disabled?: boolean;
}

export default function IconButton({ icon, onPress, size = 24, color = Colors.text, disabled = false }: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, { width: size + 16, height: size + 16 }]}
    >
      <Text style={[styles.icon, { fontSize: size, color: disabled ? Colors.textMuted : color }]}>
        {icon}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
  },
});

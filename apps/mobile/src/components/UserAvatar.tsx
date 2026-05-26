import React, { useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { getAvatarBgColor } from '../utils/avatar';

interface UserAvatarProps {
  displayName: string;
  size: number;
  photoURL?: string;
}

export default function UserAvatar({ displayName, size, photoURL }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const bgColor = getAvatarBgColor(displayName);
  const showImage = photoURL && !imageError;

  if (showImage) {
    return (
      <Image
        source={{ uri: photoURL }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        onError={() => setImageError(true)}
      />
    );
  }

  const iconSize = size * 0.5;

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor },
      ]}
    >
      <Text style={{ fontSize: iconSize, color: 'rgba(255,255,255,0.85)' }}>
        {'\u{1F464}'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

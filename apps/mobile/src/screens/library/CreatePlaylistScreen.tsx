import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { LibraryStackParamList } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { createPlaylist } from '../../services/firestore';
import Colors from '../../constants/colors';
import Layout from '../../constants/layout';

type Props = StackScreenProps<LibraryStackParamList, 'CreatePlaylist'>;

export default function CreatePlaylistScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a playlist title');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'You must be logged in');
      return;
    }

    setSubmitting(true);
    try {
      await createPlaylist(
        title.trim(),
        description.trim(),
        user.uid,
        user.displayName ?? 'User',
        isPublic
      );
      navigation.goBack();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create playlist';
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Create Playlist</Text>

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Playlist name"
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="sentences"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add an optional description"
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setIsPublic((prev) => !prev)}
        >
          <Text style={styles.toggleLabel}>Public</Text>
          <View
            style={[styles.toggle, isPublic ? styles.toggleOn : styles.toggleOff]}
          >
            <View
              style={[
                styles.toggleDot,
                isPublic ? styles.dotOn : styles.dotOff,
              ]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitText}>
            {submitting ? 'Creating...' : 'Create'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Layout.padding.md },
  backButton: { marginBottom: Layout.padding.md },
  backText: { color: Colors.primary, fontSize: Layout.fontSize.lg },
  heading: {
    color: Colors.text,
    fontSize: Layout.fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: Layout.padding.lg,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: Layout.fontSize.md,
    marginBottom: Layout.padding.xs,
  },
  input: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.padding.sm,
    paddingHorizontal: Layout.padding.md,
    color: Colors.text,
    fontSize: Layout.fontSize.lg,
    marginBottom: Layout.padding.md,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.padding.lg,
    paddingVertical: Layout.padding.sm,
  },
  toggleLabel: { color: Colors.text, fontSize: Layout.fontSize.lg },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: Layout.borderRadius.xl,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleOn: { backgroundColor: Colors.primary },
  toggleOff: { backgroundColor: Colors.surfaceLighter },
  toggleDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.white },
  dotOn: { alignSelf: 'flex-end' },
  dotOff: { alignSelf: 'flex-start' },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.full,
    paddingVertical: Layout.padding.sm,
    alignItems: 'center',
  },
  submitDisabled: { opacity: 0.6 },
  submitText: {
    color: Colors.text,
    fontSize: Layout.fontSize.lg,
    fontWeight: '700',
  },
});

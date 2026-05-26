import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types';
import { register } from '../../services/auth';
import AuthInput from '../../components/AuthInput';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';
import useGoogleAuth from '../../hooks/useGoogleAuth';
import Colors from '../../constants/colors';
import Layout from '../../constants/layout';

type RegisterNav = StackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterNav>();
  const { request, promptAsync } = useGoogleAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(email.trim(), password, displayName.trim());
      navigation.navigate('EmailVerification');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Music-Gram</Text>

        <AuthInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Display name"
          autoComplete="name"
        />
        <AuthInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoComplete="email"
        />
        <AuthInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          autoComplete="new-password"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <GoogleSignInButton
          onPress={() => promptAsync()}
          disabled={!request}
        />

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.loginLink}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkBold}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Layout.padding.xl,
  },
  title: {
    color: Colors.primary,
    fontSize: Layout.fontSize.xxxl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Layout.padding.xs,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Layout.fontSize.lg,
    textAlign: 'center',
    marginBottom: Layout.padding.xl,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.padding.md,
    alignItems: 'center',
    marginTop: Layout.padding.sm,
    marginBottom: Layout.padding.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.black,
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
  },
  linkText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    fontSize: Layout.fontSize.md,
  },
  linkBold: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.padding.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  dividerText: {
    color: Colors.textSecondary,
    marginHorizontal: Layout.padding.md,
    fontSize: Layout.fontSize.md,
  },
  loginLink: {
    marginTop: Layout.padding.lg,
  },
});

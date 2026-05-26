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
import { login } from '../../services/auth';
import AuthInput from '../../components/AuthInput';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';
import useGoogleAuth from '../../hooks/useGoogleAuth';
import Colors from '../../constants/colors';
import Layout from '../../constants/layout';

type LoginNav = StackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNav>();
  const { request, promptAsync } = useGoogleAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
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
        <Text style={styles.title}>Music-Gram</Text>
        <Text style={styles.subtitle}>Log in to continue</Text>

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
          autoComplete="password"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Logging in...' : 'Log In'}
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

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
          <Text style={styles.linkText}>
            Don&apos;t have an account? <Text style={styles.linkBold}>Sign up</Text>
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
  registerLink: {
    marginTop: Layout.padding.lg,
  },
});

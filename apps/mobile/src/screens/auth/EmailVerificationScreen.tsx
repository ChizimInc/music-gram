import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { sendVerification, reloadUser } from '../../services/auth';
import { logout } from '../../services/auth';
import Colors from '../../constants/colors';
import Layout from '../../constants/layout';

const COOLDOWN_SECONDS = 60;

export default function EmailVerificationScreen() {
  const { user, refreshUser } = useAuth();
  const [cooldown, setCooldown] = useState(0);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    try {
      await sendVerification();
      setCooldown(COOLDOWN_SECONDS);
      Alert.alert('Sent', 'Verification email sent. Check your inbox.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send email';
      Alert.alert('Error', message);
    }
  }, []);

  const handleCheckVerified = useCallback(async () => {
    setChecking(true);
    try {
      const verified = await reloadUser();
      if (verified) {
        refreshUser();
      } else {
        Alert.alert('Not yet verified', 'Please check your email and click the verification link.');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to check status';
      Alert.alert('Error', message);
    } finally {
      setChecking(false);
    }
  }, [refreshUser]);

  const handleLogout = useCallback(async () => {
    await logout();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{'\u2709\uFE0F'}</Text>
      <Text style={styles.title}>Check your email</Text>
      <Text style={styles.subtitle}>
        We sent a verification link to
      </Text>
      <Text style={styles.email}>{user?.email ?? ''}</Text>

      <TouchableOpacity
        style={[styles.button, cooldown > 0 && styles.buttonDisabled]}
        onPress={handleResend}
        disabled={cooldown > 0}
      >
        <Text style={styles.buttonText}>
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend verification email'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.buttonOutline, checking && styles.buttonDisabled]}
        onPress={handleCheckVerified}
        disabled={checking}
      >
        <Text style={styles.buttonOutlineText}>
          {checking ? 'Checking...' : "I've verified my email"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutLink}>
        <Text style={styles.linkText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.padding.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: Layout.padding.lg,
  },
  title: {
    color: Colors.text,
    fontSize: Layout.fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: Layout.padding.sm,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Layout.fontSize.md,
    textAlign: 'center',
  },
  email: {
    color: Colors.primary,
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: Layout.padding.xl,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.padding.md,
    alignItems: 'center',
    width: '100%',
    marginBottom: Layout.padding.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.black,
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
  },
  buttonOutline: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.padding.md,
    alignItems: 'center',
    width: '100%',
    marginBottom: Layout.padding.lg,
  },
  buttonOutlineText: {
    color: Colors.primary,
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
  },
  logoutLink: {
    marginTop: Layout.padding.sm,
  },
  linkText: {
    color: Colors.textSecondary,
    fontSize: Layout.fontSize.md,
  },
});

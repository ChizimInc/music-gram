import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import PlayerScreen from '../screens/player/PlayerScreen';
import EmailVerificationScreen from '../screens/auth/EmailVerificationScreen';

const Stack = createStackNavigator<RootStackParamList>();

function isEmailProvider(user: { providerData: Array<{ providerId: string }> }): boolean {
  return user.providerData.some((p) => p.providerId === 'password');
}

export default function RootNavigator() {
  const { user, loading, emailVerified } = useAuth();

  if (loading) {
    return null;
  }

  const needsVerification = user && !emailVerified && isEmailProvider(user);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        needsVerification ? (
          <Stack.Screen name="Auth" component={EmailVerificationGate} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen
              name="Player"
              component={PlayerScreen}
              options={{ presentation: 'modal' }}
            />
          </>
        )
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

function EmailVerificationGate() {
  return <EmailVerificationScreen />;
}

import { useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';
import { signInWithGoogle } from '../services/auth';
import { GOOGLE_WEB_CLIENT_ID } from '../constants/auth';

WebBrowser.maybeCompleteAuthSession();

export default function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token: idToken } = response.params;
      if (idToken) {
        signInWithGoogle(idToken).catch((error: unknown) => {
          const message = error instanceof Error ? error.message : 'Google sign-in failed';
          Alert.alert('Error', message);
        });
      }
    }
  }, [response]);

  return { request, promptAsync };
}

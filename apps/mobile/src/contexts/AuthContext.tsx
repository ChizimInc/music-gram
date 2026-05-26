import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthContextValue {
  user: FirebaseUser | null;
  loading: boolean;
  emailVerified: boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  emailVerified: false,
  refreshUser: () => {},
});

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setEmailVerified(firebaseUser?.emailVerified ?? false);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshUser = useCallback(() => {
    const current = auth.currentUser;
    if (current) {
      setUser(current);
      setEmailVerified(current.emailVerified);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, emailVerified, refreshUser }),
    [user, loading, emailVerified, refreshUser],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

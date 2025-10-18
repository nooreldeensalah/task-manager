import type { User, UserCredential } from 'firebase/auth';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getAuthInstance } from '@/services/auth';

interface AuthContextValue {
  user: User | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const auth = getAuthInstance();
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const signInHandler = useCallback((email: string, password: string) => {
    const auth = getAuthInstance();
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUpHandler = useCallback((email: string, password: string) => {
    const auth = getAuthInstance();
    return createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const signOutHandler = useCallback(() => {
    const auth = getAuthInstance();
    return signOut(auth);
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      signIn: signInHandler,
      signUp: signUpHandler,
      signOut: signOutHandler,
    }),
    [user, initializing, signInHandler, signUpHandler, signOutHandler],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

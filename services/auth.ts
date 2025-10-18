import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, initializeAuth, type Auth } from 'firebase/auth';
import * as firebaseAuth from 'firebase/auth';
import { Platform } from 'react-native';

import { getFirebaseApp } from '@/firebaseConfig';

let authInstance: Auth | null = null;

export const getAuthInstance = (): Auth => {
  if (authInstance) {
    return authInstance;
  }

  const app = getFirebaseApp();

  if (Platform.OS === 'web') {
    authInstance = getAuth(app);
    return authInstance;
  }

  const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

  authInstance = initializeAuth(app, {
    persistence: reactNativePersistence(AsyncStorage),
  });

  return authInstance;
};

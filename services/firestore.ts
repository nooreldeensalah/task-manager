import {
  enableIndexedDbPersistence,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from 'firebase/firestore';
import { Platform } from 'react-native';

import { getFirebaseApp } from '@/firebaseConfig';

let firestoreInstance: Firestore | null = null;

export const getFirestoreInstance = (): Firestore => {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  const app = getFirebaseApp();

  if (Platform.OS === 'web') {
    const db = getFirestore(app);
    if (typeof window !== 'undefined') {
      enableIndexedDbPersistence(db).catch(() => {
        // Ignore persistence errors (e.g., multiple tabs); Firestore handles fallback.
      });
    }

    firestoreInstance = db;
    return firestoreInstance;
  }

  firestoreInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });

  return firestoreInstance;
};

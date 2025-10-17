import { getFirestore, type Firestore } from 'firebase/firestore';

import { getFirebaseApp } from '@/firebaseConfig';

let firestoreInstance: Firestore | null = null;

export const getFirestoreInstance = (): Firestore => {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  const app = getFirebaseApp();
  firestoreInstance = getFirestore(app);
  return firestoreInstance;
};

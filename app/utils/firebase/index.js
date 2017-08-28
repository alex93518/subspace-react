import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { firebaseConfig } from './config';

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  // we skip the "already exists" message which is
  // not an actual error when we're hot-reloading
  if (!/already exists/.test(err.message)) {
    // console.error('Firebase initialization error', err.stack);
  }
}

export const firebaseApp = firebase;
export const firebaseAuth = firebase.auth();
export const firebaseDb = firebase.database();

export const getToken = async () => {
  if (firebaseAuth.currentUser) {
    const auth = await firebaseAuth.currentUser.getIdToken()
    return auth || undefined
  }

  return undefined
}

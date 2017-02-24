import firebase from 'firebase';
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
export const firebaseAuth = firebaseApp.auth();
export const firebaseDb = firebaseApp.database();
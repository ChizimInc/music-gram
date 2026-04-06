import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  sendEmailVerification,
  signOut,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { getAvatarBgColor } from '../utils/avatar';

export async function register(
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  const avatarBgColor = getAvatarBgColor(displayName);
  await setDoc(doc(db, 'users', credential.user.uid), {
    uid: credential.user.uid,
    email,
    displayName,
    photoURL: '',
    avatarBgColor,
    createdAt: serverTimestamp(),
    likedSongIds: [],
    followedPlaylistIds: [],
  });
  await sendEmailVerification(credential.user);
  return credential;
}

export async function signInWithGoogle(idToken: string): Promise<UserCredential> {
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  const userDoc = await getDoc(doc(db, 'users', result.user.uid));
  if (!userDoc.exists()) {
    const displayName = result.user.displayName ?? 'User';
    const avatarBgColor = getAvatarBgColor(displayName);
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      email: result.user.email ?? '',
      displayName,
      photoURL: result.user.photoURL ?? '',
      avatarBgColor,
      createdAt: serverTimestamp(),
      likedSongIds: [],
      followedPlaylistIds: [],
    });
  }
  return result;
}

export async function login(
  email: string,
  password: string
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function sendVerification(): Promise<void> {
  if (!auth.currentUser) throw new Error('No user signed in');
  await sendEmailVerification(auth.currentUser);
}

export async function reloadUser(): Promise<boolean> {
  if (!auth.currentUser) throw new Error('No user signed in');
  await auth.currentUser.reload();
  return auth.currentUser.emailVerified;
}

export async function logout(): Promise<void> {
  return signOut(auth);
}

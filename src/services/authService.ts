import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserRole, UserProfile } from '../types';

// Cadastro — cria conta no Auth e documento no Firestore
export async function signUp(
  email: string,
  password: string,
  nome: string,
  roles: UserRole[],
  extrasMotorista?: { cnh: string }
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;

  await updateProfile(credential.user, { displayName: nome });

  const userData: UserProfile = {
    id: uid,
    nome,
    email,
    roles,
    createdAt: serverTimestamp() as any,
    ...(extrasMotorista && { cnh: extrasMotorista.cnh }),
  };

  await setDoc(doc(db, 'users', uid), userData);
  return credential.user;
}

// Login
export async function signIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

// Buscar perfil completo do Firestore
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as UserProfile;
}

// Logout
export async function signOut() {
  await firebaseSignOut(auth);
}
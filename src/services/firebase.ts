import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC1nbmSj0VMhi_YNIp-I4l-xdK_rjM38Vc",
  authDomain: "fastvan-31e7f.firebaseapp.com",
  projectId: "fastvan-31e7f",
  storageBucket: "fastvan-31e7f.firebasestorage.app",
  messagingSenderId: "434556601934",
  appId: "1:434556601934:web:1b30215dae07dcdec3651f"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);



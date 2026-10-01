import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAcMWY9Hdx3k80Cl6NHo20urGBl5NJ4Phk",
  authDomain: "pbd-tracker.firebaseapp.com",
  projectId: "pbd-tracker",
  storageBucket: "pbd-tracker.firebasestorage.app",
  messagingSenderId: "534072241285",
  appId: "1:534072241285:web:a96b31e014cf5273014dec"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, signInWithPopup, signOut };

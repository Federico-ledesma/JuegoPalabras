// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKdBvRHx7FLZlY_AslT3IV0_GUUhbz6yc",
  authDomain: "iniciales-game.firebaseapp.com",
  projectId: "iniciales-game",
  storageBucket: "iniciales-game.firebasestorage.app",
  messagingSenderId: "55269659737",
  appId: "1:55269659737:web:965a73165a64544bc38d48",
  measurementId: "G-7EF1SPEG54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
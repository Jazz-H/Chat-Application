import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase web API keys are safe to expose in client code; access is
// controlled by Firestore Security Rules, not by key secrecy.
const firebaseConfig = {
  apiKey: "AIzaSyBzt7AbH_wmNic9guYUCGXiJVnCZ_6Tem0",
  authDomain: "chatappdemo-e1b26.firebaseapp.com",
  projectId: "chatappdemo-e1b26",
  storageBucket: "chatappdemo-e1b26.firebasestorage.app",
  messagingSenderId: "553668512426",
  appId: "1:553668512426:web:05d61b08d4f5b96c7e5ed3",
  measurementId: "G-20QE356L8C",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyBzt7AbH_wmNic9guYUCGXiJVnCZ_6Tem0",

  authDomain: "chatappdemo-e1b26.firebaseapp.com",

  projectId: "chatappdemo-e1b26",

  storageBucket: "chatappdemo-e1b26.firebasestorage.app",

  messagingSenderId: "553668512426",

  appId: "1:553668512426:web:05d61b08d4f5b96c7e5ed3",

  measurementId: "G-20QE356L8C"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)

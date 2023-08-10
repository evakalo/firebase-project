import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAA7GwL0x6tuajuyfOF87l7C7ylc6OANcE",

  authDomain: "books-c2709.firebaseapp.com",

  projectId: "books-c2709",

  storageBucket: "books-c2709.appspot.com",

  messagingSenderId: "338181073741",

  appId: "1:338181073741:web:63d8e7abc205c5ad73a504",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

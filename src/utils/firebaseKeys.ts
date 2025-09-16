import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAtmkzL_1Y9LLgOXknagjGh_-TZUbE3U_A",
  authDomain: "tutorhail-c9fd4.firebaseapp.com",
  projectId: "tutorhail-c9fd4",
  storageBucket: "tutorhail-c9fd4.appspot.com",
  messagingSenderId: "831651786344",
  appId: "1:831651786344:web:9301357b0ba7a8d0a315dd",
  measurementId: "G-F1MTV5RGJ4"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const googleProvider = new GoogleAuthProvider();

export default app;


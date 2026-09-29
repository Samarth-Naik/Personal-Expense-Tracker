import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAiQO-XgEHaEQdMRudxk6hGzqNFrjxwtQY",
  authDomain: "expense-tracker-dfcdf.firebaseapp.com",
  projectId: "expense-tracker-dfcdf",
  storageBucket: "expense-tracker-dfcdf.firebasestorage.app",
  messagingSenderId: "523332674723",
  appId: "1:523332674723:web:7ef9c7a00fb0f6aeefcb16"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
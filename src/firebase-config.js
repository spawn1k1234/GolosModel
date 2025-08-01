// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBwXWAuh7-BoHeJGe-9T7B4GQQjD-kJqAo",
  authDomain: "vlom-71da6.firebaseapp.com",
  databaseURL: "https://vlom-71da6-default-rtdb.firebaseio.com",
  projectId: "vlom-71da6",
  storageBucket: "vlom-71da6.firebasestorage.app",
  messagingSenderId: "566418934815",
  appId: "1:566418934815:web:e27892e69bbdc09a11d92a",
  measurementId: "G-B1851J0J50",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };

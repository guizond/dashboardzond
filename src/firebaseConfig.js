import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
    apiKey: "AIzaSyBTm0f_zOR_88GBmkEIxHoP-FRLPFdIjCw",
    authDomain: "dropsmartz.firebaseapp.com",
    projectId: "dropsmartz",
    storageBucket: "dropsmartz.firebasestorage.app",
    messagingSenderId: "460151237587",
    appId: "1:460151237587:web:7b0d6bbe43463c88a21d26",
    measurementId: "G-BSWP04PZC0"
  };
  
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);

export { db, auth }; 
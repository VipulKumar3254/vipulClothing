
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgmVq7IWPZcTAKQ17zdXzebfFhYG-tzFo",
  authDomain: "vipulclothing.firebaseapp.com",
  projectId: "vipulclothing",
  storageBucket: "vipulclothing.appspot.com",
  messagingSenderId: "1010230800659",
  appId: "1:1010230800659:web:b2f19439cc5bb47d136ae6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export {db,app, storage,auth};
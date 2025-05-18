// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-Z-7mzFScX-BTDD85ShkGGL6iavxeIOE",
  authDomain: "hockey-union.firebaseapp.com",
  projectId: "hockey-union",
  storageBucket: "hockey-union.firebasestorage.app",
  messagingSenderId: "163997337297",
  appId: "1:163997337297:web:785da756306ed75686a7f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
export  {app, auth}
export { db, storage };
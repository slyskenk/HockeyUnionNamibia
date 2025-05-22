import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyA-Z-7mzFScX-BTDD85ShkGGL6iavxeIOE",
  authDomain: "hockey-union.firebaseapp.com",
  projectId: "hockey-union",
  storageBucket: "hockey-union.appspot.com", // ✅ FIXED
  messagingSenderId: "163997337297",
  appId: "1:163997337297:web:785da756306ed75686a7f0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);


export { app, auth, db, storage };

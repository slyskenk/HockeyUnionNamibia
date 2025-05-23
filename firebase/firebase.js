// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyA-Z-7mzFScX-BTDD85ShkGGL6iavxeIOE",
  authDomain: "hockey-union.firebaseapp.com",
  projectId: "hockey-union",
  storageBucket: "hockey-union.appspot.com",
  messagingSenderId: "163997337297",
  appId: "1:163997337297:web:785da756306ed75686a7f0"
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Export Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

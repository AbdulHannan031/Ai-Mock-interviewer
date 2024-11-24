import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBNgqKyDYM29hLjCEYv3ROKlb6hUsYOdQY",
    authDomain: "ai-intervew-6d583.firebaseapp.com",
    projectId: "ai-intervew-6d583",
    storageBucket: "ai-intervew-6d583.appspot.com",
    messagingSenderId: "513764379606",
    appId: "1:513764379606:web:6745f3ab0bc93aa195f277",
    measurementId: "G-KY4K2HVH4V"
};

const app = initializeApp(firebaseConfig);
const db= getFirestore(app);
const auth= getAuth(app)
const provider = new GoogleAuthProvider(); 

const storage = getStorage(app);

export {auth,provider,storage};
export default db;
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCg3X8GhD_X1gWdqzKItJ6gNyCxW3Lzovk",
    authDomain: "funstudy-ca7a5.firebaseapp.com",
    projectId: "funstudy-ca7a5",
    storageBucket: "funstudy-ca7a5.firebasestorage.app",
    messagingSenderId: "927092757979",
    appId: "1:927092757979:web:dfb169d05807804ac7c3fe",
    measurementId: "G-4SDR9BYSQN"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
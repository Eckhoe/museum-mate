import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebase = {
    
    apiKey: "AIzaSyDXd3SXujiOC-0iYxe4E0gg2pfv5NUJaWI",
    authDomain: "museummate-e06b8.firebaseapp.com",
    databaseURL: "https://museummate-e06b8-default-rtdb.firebaseio.com",
    projectId: "museummate-e06b8",
    storageBucket: "museummate-e06b8.appspot.com",
    messagingSenderId: "607698800264",
    appId: "1:607698800264:web:4c20dd01fe7e9ededcd93d",
    measurementId: "G-JW69LNL7LD"

};

const app = initializeApp(firebase);
const db = getFirestore(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
export {auth,provider,db};
// firebase.jsx
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCenJ5CpOcPy8p0Gw2JE9pMondmRPHQbRI",
    authDomain: "rojers-the-snake-method.firebaseapp.com",
    projectId: "rojers-the-snake-method",
    storageBucket: "rojers-the-snake-method.appspot.com",
    messagingSenderId: "827551361821",
    appId: "1:827551361821:web:47c682a4d636627c9e4ff4",
    measurementId: "G-0B8X88QXBQ"
};


const app = initializeApp(firebaseConfig);


export const db = getFirestore(app); 


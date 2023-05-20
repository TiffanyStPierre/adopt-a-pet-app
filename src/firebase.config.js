// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAa3ISml21y22W7gED0dPBSX1UbAFL0xJc",
  authDomain: "adopt-a-pet-app-23e43.firebaseapp.com",
  projectId: "adopt-a-pet-app-23e43",
  storageBucket: "adopt-a-pet-app-23e43.appspot.com",
  messagingSenderId: "471344779891",
  appId: "1:471344779891:web:0e54ea033b9355d2a1d006"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzDAsthRk_vKng59u1vHUBelxbxhT4-Aw",
  authDomain: "jogo-educativo-86afb.firebaseapp.com",
  projectId: "jogo-educativo-86afb",
  storageBucket: "jogo-educativo-86afb.firebasestorage.app",
  messagingSenderId: "409472042344",
  appId: "1:409472042344:web:be702da9bc1e6970cd42dd",
  measurementId: "G-CZ4930P5KM"
  databaseURL:"https://jogo-educativo-86afb-default-rtdb.firebaseio.com"

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
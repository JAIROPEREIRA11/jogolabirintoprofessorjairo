const firebaseConfig = {
  apiKey: "AIzaSyBzDAsthRk_vKng59u1vHUBelxbxhT4-Aw",
  authDomain: "jogo-educativo-86afb.firebaseapp.com",
  databaseURL: "https://jogo-educativo-86afb-default-rtdb.firebaseio.com",
  projectId: "jogo-educativo-86afb",
  storageBucket: "jogo-educativo-86afb.appspot.com",
  messagingSenderId: "409472042344",
  appId: "1:409472042344:web:be702da9bc1e6970cd42dd"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
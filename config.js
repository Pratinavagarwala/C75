import * as firebase from "firebase";
require("@firebase/firestore");
var firebaseConfig = {
  apiKey: "AIzaSyALguv06GJblDRgZYcRMJUBFdMvP0y-ShE",
  authDomain: "willy-ec27c.firebaseapp.com",
  projectId: "willy-ec27c",
  storageBucket: "willy-ec27c.appspot.com",
  messagingSenderId: "162963169517",
  appId: "1:162963169517:web:c293919d3763b4c58eece4"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();
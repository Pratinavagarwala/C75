import * as firebase from "firebase";
require("@firebase/firestore");
var firebaseConfig = {
    apiKey: "AIzaSyCLnbs8u1Ni3woDor1VUS4m5Sw9fbpNNmA",
    authDomain: "willy3-88fb2.firebaseapp.com",
    projectId: "willy3-88fb2",
    storageBucket: "willy3-88fb2.appspot.com",
    messagingSenderId: "782045866899",
    appId: "1:782045866899:web:506ca2c1d9ac0bf5ed1666"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();
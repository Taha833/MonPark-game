import firebase from "firebase/compat/app"
import "firebase/compat/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDSE74cbbPgGbuLsjm2s27K-z7FpVysZQo",
  authDomain: "monpark-test.firebaseapp.com",
  projectId: "monpark-test",
  storageBucket: "monpark-test.appspot.com",
  messagingSenderId: "302175703937",
  appId: "1:302175703937:web:768309071fc1e4ce824e80"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()

export default db
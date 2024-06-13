const firebase = require("firebase/compat/app");
require('firebase/compat/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyAL8rZLxhIo3JxiKTdIZWsFfckvH1GU2_Q",
    authDomain: "monpark-16c40.firebaseapp.com",
    projectId: "monpark-16c40",
    storageBucket: "monpark-16c40.appspot.com",
    messagingSenderId: "1036011524838",
    appId: "1:1036011524838:web:0b3fd83d6de1396a0b2127",
    measurementId: "G-RC7RD4TYBS"
};

//eslint-disable-next-line
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()

module.exports = db
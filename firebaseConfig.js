import { initializeApp }
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

getAuth,

GoogleAuthProvider,

signInWithPopup,

signOut,

onAuthStateChanged

}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {

getFirestore

}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

    apiKey:"YOUR_API_KEY",

    authDomain:"YOUR_PROJECT.firebaseapp.com",

    projectId:"YOUR_PROJECT_ID",

    storageBucket:"YOUR_PROJECT.appspot.com",

    messagingSenderId:"XXXXXXXX",

    appId:"XXXXXXXX"

};

const app =
initializeApp(
firebaseConfig
);

const auth =
getAuth(app);

const db =
getFirestore(app);

export {

auth,

db,

GoogleAuthProvider,

signInWithPopup,

signOut,

onAuthStateChanged

};

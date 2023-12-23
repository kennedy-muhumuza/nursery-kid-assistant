// Import the functions you need from the SDKs you need
// import dotenv from "dotenv";
// dotenv.config();
// import firebase from "firebase/app";
// import "firebase/firestore";

import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7U_M5C9VfnthS3JqB9kdlZogCam623UU",
  authDomain: "envirescue-23e34.firebaseapp.com",
  projectId: "envirescue-23e34",
  storageBucket: "envirescue-23e34.appspot.com",
  messagingSenderId: "228912689223",
  appId: "1:228912689223:web:8de36603d4fa031b678162",
  measurementId: "G-2DGNB5V1Q4",
};

// export const setPersist = firebase
//   .auth()
//   .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
//   .then(() => {
//     // Now, you can listen for auth state changes
//     firebase.auth().onAuthStateChanged((user) => {
//       if (user) {
//         // User is signed in.
//         console.log("User is logged in:", user);
//       } else {
//         // User is signed out.
//         console.log("User is logged out");
//       }
//     });
//   })
//   .catch((error) => {
//     console.error("Error setting persistence:", error);
//   });

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// const firestore = app.firestore();
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { createUserWithEmailAndPassword };
// export { firestore };

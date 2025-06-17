// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtQhN_YCyHPen8slnBlnaBvUq3qAXIsh8",
  authDomain: "impulsa-86311.firebaseapp.com",
  projectId: "impulsa-86311",
  storageBucket: "impulsa-86311.firebasestorage.app",
  messagingSenderId: "746681899335",
  appId: "1:746681899335:web:3de360825178b9b0cbd462",
  measurementId: "G-2EGK973BCQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
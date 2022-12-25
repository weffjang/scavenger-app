// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxHRNv0-uzgnBTc1eTlLZdZTz9hlPMm2Q",
  authDomain: "scavenger-app-ed99f.firebaseapp.com",
  projectId: "scavenger-app-ed99f",
  storageBucket: "scavenger-app-ed99f.appspot.com",
  messagingSenderId: "691124220005",
  appId: "1:691124220005:web:df9a34c5b10a0b2bc5d68c",
  measurementId: "G-K3XPSBJD6K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);
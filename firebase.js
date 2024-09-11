// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABTWMDUhRrBsG41GuUwZxdn9em6QNG5KI",
  authDomain: "md-react-notes.firebaseapp.com",
  projectId: "md-react-notes",
  storageBucket: "md-react-notes.appspot.com",
  messagingSenderId: "297875373799",
  appId: "1:297875373799:web:cb1dae72fcb19f5d586c42",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notesCollection = collection(db, "notes");
export  {notesCollection,db,};

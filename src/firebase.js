import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOEM341N8cDhp7jUEr_t413VXBG0OHgxw",
  authDomain: "quickpaste-f0f59.firebaseapp.com",
  databaseURL: "https://quickpaste-f0f59.firebaseio.com",
  projectId: "quickpaste-f0f59",
  storageBucket: "quickpaste-f0f59.appspot.com",
  messagingSenderId: "728408714567",
  appId: "1:728408714567:web:ed04d5a24419fdb817b062",
  measurementId: "G-M6J30YNQC6",
};

const app = firebase.initializeApp(firebaseConfig);

export default app.firestore();

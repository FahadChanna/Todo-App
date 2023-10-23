
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging"

const firebaseConfig = {
  apiKey: "AIzaSyAX0i0sOv00GP9DOjv5Yh75kxshIxvNH4k",
  authDomain: "todoapp-ceb47.firebaseapp.com",
  projectId: "todoapp-ceb47",
  storageBucket: "todoapp-ceb47.appspot.com",
  messagingSenderId: "323558274540",
  appId: "1:323558274540:web:38004b6c522388fa6dbcc9",
  measurementId: "G-9DTHG9HDXG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const messaging = getMessaging(app)
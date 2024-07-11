import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: "my-blog-4a699.firebaseapp.com",
  projectId: "my-blog-4a699",
  storageBucket: "my-blog-4a699.appspot.com",
  messagingSenderId: "365997360005",
  appId: "1:365997360005:web:b2c3e40c37977f6b14faec",
};

export const app = initializeApp(firebaseConfig);

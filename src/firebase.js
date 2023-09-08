import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSiJiJerZfaSL61dYaRIpyZQ3Z8oKShMw",
  authDomain: process.env.React_App_authDomain,
  projectId: process.env.React_App_projectId,
  databaseURL:
    "https://systemdigitalizacji-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "systemdigitalizacji.appspot.com",
  messagingSenderId: process.env.React_App_messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.Raect_App_measurementId,
};

export const app = initializeApp(firebaseConfig);

export const myStorage = getStorage(app);
export const auth2 = getAuth(app);

export const firebaseRealtime = getDatabase(app);

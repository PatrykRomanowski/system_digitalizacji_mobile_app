import {
  initializeApp
} from "firebase/app";
import {
  getStorage
} from "firebase/storage";
import {
  getAuth
} from "firebase/auth";
import {
  getDatabase
} from "firebase/database";

// import { getFirestore } from "firebase/firestore";
import {
  React_App_APIKEY,
  React_App_authDomain,
  React_App_databaseURL,
  React_App_projectId,
  React_App_STORAGE,
  React_App_messagingSenderId,
  React_App_appId,
  Raect_App_measurementId
} from "@env";


const firebaseConfig = {
  apiKey: React_App_APIKEY,
  authDomain: React_App_authDomain,
  projectId: React_App_projectId,
  databaseURL: React_App_databaseURL,
  storageBucket: React_App_STORAGE,
  messagingSenderId: React_App_messagingSenderId,
  appId: React_App_appId,
  measurementId: Raect_App_measurementId,
};

export const app = initializeApp(firebaseConfig);

export const myStorage = getStorage(app);
export const auth2 = getAuth(app);

export const firebaseRealtime = getDatabase(app);
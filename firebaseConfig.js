import { initializeApp } from "firebase/app";

import {
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDc4fnVJ-BJwZC9OLafrO1e-C3DQ0WIT2M",
  authDomain: "atvd06-32d9b.firebaseapp.com",
  projectId: "atvd06-32d9b",
  storageBucket: "atvd06-32d9b.firebasestorage.app",
  messagingSenderId: "362431759464",
  appId: "1:362431759464:web:af629d59ab19371346e7dd"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
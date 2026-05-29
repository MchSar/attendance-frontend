import { initializeApp } from "firebase/app"

import { getFirestore } from "firebase/firestore"

import { getAuth } from "firebase/auth"

const firebaseConfig = {

  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  apiKey: "AIzaSyBBdubMr4ff25kvpsP3OUrCJwkDDRiKVAU",
  authDomain: "ai-smart-attendance-623d9.firebaseapp.com",
  projectId: "ai-smart-attendance-623d9",
  storageBucket: "ai-smart-attendance-623d9.firebasestorage.app",
  messagingSenderId: "363288566559",
  appId: "1:363288566559:web:3fe81bba721a8da4fdee2a",
  measurementId: "G-R3LE5ZTK1S"
};



const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const auth = getAuth(app)
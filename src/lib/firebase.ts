// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { derived } from "svelte/store";

import { userStore, docStore } from "sveltefire";

import type { Readable } from "svelte/store";
import type { UserData } from "$lib/types/user";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhMM5OnVPZxbDWw9zl9jpxIaUiOJgUD-Q",
  authDomain: "dani-catering.firebaseapp.com",
  projectId: "dani-catering",
  storageBucket: "dani-catering.appspot.com",
  messagingSenderId: "517737759926",
  appId: "1:517737759926:web:8936517f2b3e2467e65217",
  measurementId: "G-WM4RB2Q7WV",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
// export const analytics = getAnalytics(app);

export const user = userStore(auth);

export const userData: Readable<UserData | null> = derived(
  user,
  ($user, set) => {
    if ($user) {
      return docStore<UserData>(db, `users/${$user.uid}`).subscribe(set);
    } else {
      set(null);
    }
  }
);

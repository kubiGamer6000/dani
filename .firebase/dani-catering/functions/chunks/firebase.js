import { initializeApp } from "firebase/app";
import { doc, onSnapshot, collection, getFirestore } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { w as writable, d as derived } from "./index2.js";
import "firebase/analytics";
import "firebase/database";
function userStore(auth2, startWith = null) {
  let unsubscribe;
  if (!globalThis.window) {
    const { subscribe: subscribe2 } = writable(startWith);
    return {
      subscribe: subscribe2
    };
  }
  if (!auth2) {
    console.warn("Firebase Auth is not initialized. Are you missing FirebaseApp as a parent component?");
    const { subscribe: subscribe2 } = writable(null);
    return {
      subscribe: subscribe2
    };
  }
  const { subscribe } = writable(auth2?.currentUser ?? null, (set) => {
    unsubscribe = onAuthStateChanged(auth2, (user2) => {
      set(user2);
    });
    return () => unsubscribe();
  });
  return {
    subscribe
  };
}
function docStore(firestore, ref, startWith) {
  let unsubscribe;
  if (!globalThis.window) {
    const { subscribe: subscribe2 } = writable(startWith);
    return {
      subscribe: subscribe2,
      ref: null,
      id: ""
    };
  }
  if (!firestore) {
    console.warn("Firestore is not initialized. Are you missing FirebaseApp as a parent component?");
    const { subscribe: subscribe2 } = writable(null);
    return {
      subscribe: subscribe2,
      ref: null,
      id: ""
    };
  }
  const docRef = typeof ref === "string" ? doc(firestore, ref) : ref;
  const { subscribe } = writable(startWith, (set) => {
    unsubscribe = onSnapshot(docRef, (snapshot) => {
      set(snapshot.data() ?? null);
    });
    return () => unsubscribe();
  });
  return {
    subscribe,
    ref: docRef,
    id: docRef.id
  };
}
function collectionStore(firestore, ref, startWith = []) {
  let unsubscribe;
  if (!globalThis.window) {
    const { subscribe: subscribe2 } = writable(startWith);
    return {
      subscribe: subscribe2,
      ref: null
    };
  }
  if (!firestore) {
    console.warn("Firestore is not initialized. Are you missing FirebaseApp as a parent component?");
    const { subscribe: subscribe2 } = writable([]);
    return {
      subscribe: subscribe2,
      ref: null
    };
  }
  const colRef = typeof ref === "string" ? collection(firestore, ref) : ref;
  const { subscribe } = writable(startWith, (set) => {
    unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map((s) => {
        return { id: s.id, ref: s.ref, ...s.data() };
      });
      set(data);
    });
    return () => unsubscribe();
  });
  return {
    subscribe,
    ref: colRef
  };
}
const firebaseConfig = {
  apiKey: "AIzaSyBhMM5OnVPZxbDWw9zl9jpxIaUiOJgUD-Q",
  authDomain: "dani-catering.firebaseapp.com",
  projectId: "dani-catering",
  storageBucket: "dani-catering.appspot.com",
  messagingSenderId: "517737759926",
  appId: "1:517737759926:web:8936517f2b3e2467e65217",
  measurementId: "G-WM4RB2Q7WV"
};
initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
getStorage();
const user = userStore(auth);
const userData = derived(
  user,
  ($user, set) => {
    if ($user) {
      return docStore(db, `users/${$user.uid}`).subscribe(set);
    } else {
      set(null);
    }
  }
);
export {
  auth as a,
  docStore as b,
  userStore as c,
  db as d,
  userData as e,
  collectionStore as f,
  user as u
};

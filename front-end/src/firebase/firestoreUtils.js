// frontend/src/firebase/firestoreUtils.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC17_RIlZu3rv4PkAVcbODBm6sv5RmKhXE",
  authDomain: "cinematch-51545.firebaseapp.com",
  projectId: "cinematch-51545",
  storageBucket: "cinematch-51545.appspot.com",
  messagingSenderId: "1013852019379",
  appId: "1:1013852019379:web:94e4c2978dd7c77a32eec6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Save guest swipe to Firestore → guests/{user_id} → liked: [movie IDs]
 */
export const saveGuestSwipe = async (userId, movieId) => {
  try {
    const guestRef = doc(db, "guests", userId);
    const docSnap = await getDoc(guestRef);

    if (!docSnap.exists()) {
      await setDoc(guestRef, {
        liked: [movieId], // ✅ use 'liked' field
      });
      console.log(`🆕 Created guest doc for ${userId} with movie ${movieId}`);
    } else {
      await updateDoc(guestRef, {
        liked: arrayUnion(movieId), // ✅ add movie to 'liked'
      });
      console.log(`✅ Updated guest ${userId} with movie ${movieId}`);
    }
  } catch (error) {
    console.error("🔥 Firestore guest swipe save error:", error);
  }
};

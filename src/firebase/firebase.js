import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// 🔥 GOOGLE PROVIDER + CLASSROOM
export const getGoogleProvider = () => {

  const provider = new GoogleAuthProvider();

  provider.addScope(
  "https://www.googleapis.com/auth/classroom.courses.readonly"
);

provider.addScope(
  "https://www.googleapis.com/auth/classroom.coursework.me.readonly"
);

provider.addScope(
  "https://www.googleapis.com/auth/classroom.coursework.students.readonly"
);

provider.addScope(
  "https://www.googleapis.com/auth/classroom.rosters.readonly"
);

provider.addScope(
  "https://www.googleapis.com/auth/classroom.student-submissions.me.readonly"
);

provider.setCustomParameters({
  prompt: "consent"
});

  return provider;
};

// listener auth
export const onAuthStateChangedListener = (callback) => {
  onAuthStateChanged(auth, callback);
};
import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export const saveStudySession = async (
  uid,
  data
) => {

  try {

    await addDoc(
      collection(
        db,
        "users",
        uid,
        "studySessions"
      ),
      {
        ...data,
        createdAt: serverTimestamp()
      }
    );

  } catch (error) {

    console.error(
      "Error guardando sesión",
      error
    );

  }

}; 
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function obtenerHabitos(userId) {
  const snapshot = await onSnapshot(
    collection(db, "usuarios", userId, "habitos")
  );

  return snapshot.docs.map(doc => doc.data());
}
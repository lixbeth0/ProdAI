import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const getRecentActivities = async () => {
  try {
    const q = query(
      collection(db, "activities"),
      orderBy("timestamp", "desc"),
      limit(5)
    );

    const snapshot = await onSnapshot(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error obteniendo actividades:", error);
    return [];
  }
};